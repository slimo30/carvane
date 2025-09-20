import httpx
import hashlib
import hmac
import json
from typing import Optional, Dict, Any
from datetime import datetime, timedelta
from src.models.payament import (
    ChargilyPaymentRequest, 
    ChargilyPaymentResponse, 
    ChargilyWebhookData,
    Payment,
    PaymentStatus,
    ChargilyStatus
)
from src.config import settings
from src.exception import exceptions


class ChargilyService:
    """Service for handling Chargily payment integration"""
    
    def __init__(self):
        self.api_key = settings.chargily_api_key
        self.secret_key = settings.chargily_secret_key
        self.base_url = settings.chargily_base_url
        self.webhook_secret = settings.chargily_webhook_secret
        
        if not self.api_key or not self.secret_key:
            raise ValueError("Chargily API key and secret key are required")
    
    def _generate_signature(self, data: str) -> str:
        """Generate HMAC signature for Chargily API"""
        return hmac.new(
            self.secret_key.encode('utf-8'),
            data.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
    
    def _get_headers(self, data: str) -> Dict[str, str]:
        """Get headers for Chargily API requests"""
        signature = self._generate_signature(data)
        return {
            "Content-Type": "application/json",
            "X-Authorization": f"Bearer {self.api_key}",
            "X-Signature": signature
        }
    
    async def create_payment(
        self, 
        payment_request: ChargilyPaymentRequest,
        payment_id: str
    ) -> ChargilyPaymentResponse:
        """Create a new payment with Chargily"""
        
        # Prepare the request data
        request_data = {
            "amount": payment_request.amount,
            "currency": payment_request.currency,
            "payment_method": payment_request.payment_method,
            "success_url": payment_request.success_url,
            "failure_url": payment_request.failure_url,
            "webhook_url": payment_request.webhook_url,
            "invoice_number": payment_request.invoice_number,
            "metadata": {
                "payment_id": payment_id,
                **(payment_request.metadata or {})
            }
        }
        
        data_json = json.dumps(request_data, separators=(',', ':'))
        headers = self._get_headers(data_json)
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.post(
                    f"{self.base_url}/invoices",
                    content=data_json,
                    headers=headers,
                    timeout=30.0
                )
                response.raise_for_status()
                
                response_data = response.json()
                
                return ChargilyPaymentResponse(
                    checkout_url=response_data["checkout_url"],
                    invoice_id=response_data["invoice_id"],
                    invoice_number=response_data["invoice_number"],
                    amount=response_data["amount"],
                    currency=response_data["currency"],
                    status=response_data["status"],
                    payment_method=response_data["payment_method"],
                    created_at=response_data["created_at"],
                    expires_at=response_data["expires_at"]
                )
                
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 400:
                    error_data = e.response.json()
                    raise exceptions.BadRequest(f"Chargily API error: {error_data.get('message', 'Bad request')}")
                elif e.response.status_code == 401:
                    raise exceptions.Unauthorized("Invalid Chargily API credentials")
                elif e.response.status_code == 403:
                    raise exceptions.Forbidden("Chargily API access forbidden")
                else:
                    raise exceptions.InternalServerError(f"Chargily API error: {e.response.status_code}")
            except httpx.RequestError as e:
                raise exceptions.InternalServerError(f"Failed to connect to Chargily: {str(e)}")
    
    async def get_payment_status(self, invoice_id: str) -> ChargilyPaymentResponse:
        """Get payment status from Chargily"""
        
        async with httpx.AsyncClient() as client:
            try:
                response = await client.get(
                    f"{self.base_url}/invoices/{invoice_id}",
                    headers={
                        "X-Authorization": f"Bearer {self.api_key}",
                        "Content-Type": "application/json"
                    },
                    timeout=30.0
                )
                response.raise_for_status()
                
                response_data = response.json()
                
                return ChargilyPaymentResponse(
                    checkout_url=response_data["checkout_url"],
                    invoice_id=response_data["invoice_id"],
                    invoice_number=response_data["invoice_number"],
                    amount=response_data["amount"],
                    currency=response_data["currency"],
                    status=response_data["status"],
                    payment_method=response_data["payment_method"],
                    created_at=response_data["created_at"],
                    expires_at=response_data["expires_at"]
                )
                
            except httpx.HTTPStatusError as e:
                if e.response.status_code == 404:
                    raise exceptions.NotFound("Payment not found")
                else:
                    raise exceptions.InternalServerError(f"Chargily API error: {e.response.status_code}")
            except httpx.RequestError as e:
                raise exceptions.InternalServerError(f"Failed to connect to Chargily: {str(e)}")
    
    def verify_webhook_signature(self, payload: str, signature: str) -> bool:
        """Verify webhook signature from Chargily"""
        if not self.webhook_secret:
            return True  # Skip verification if no secret is set
        
        expected_signature = hmac.new(
            self.webhook_secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
    
    def parse_webhook_data(self, webhook_data: Dict[str, Any]) -> ChargilyWebhookData:
        """Parse webhook data from Chargily"""
        return ChargilyWebhookData(
            invoice_id=webhook_data["invoice_id"],
            invoice_number=webhook_data["invoice_number"],
            amount=webhook_data["amount"],
            currency=webhook_data["currency"],
            status=webhook_data["status"],
            payment_method=webhook_data["payment_method"],
            payment_id=webhook_data["payment_id"],
            created_at=webhook_data["created_at"],
            updated_at=webhook_data["updated_at"],
            metadata=webhook_data.get("metadata")
        )
    
    def map_chargily_status_to_payment_status(self, chargily_status: str) -> PaymentStatus:
        """Map Chargily status to internal payment status"""
        status_mapping = {
            "pending": PaymentStatus.PENDING,
            "paid": PaymentStatus.COMPLETED,
            "failed": PaymentStatus.FAILED,
            "expired": PaymentStatus.FAILED,
            "cancelled": PaymentStatus.CANCELLED
        }
        return status_mapping.get(chargily_status, PaymentStatus.PENDING)
    
    def map_chargily_status_to_chargily_status(self, chargily_status: str) -> ChargilyStatus:
        """Map Chargily status string to ChargilyStatus enum"""
        status_mapping = {
            "pending": ChargilyStatus.PENDING,
            "paid": ChargilyStatus.PAID,
            "failed": ChargilyStatus.FAILED,
            "expired": ChargilyStatus.EXPIRED,
            "cancelled": ChargilyStatus.CANCELLED
        }
        return status_mapping.get(chargily_status, ChargilyStatus.PENDING)


# Global instance
chargily_service = ChargilyService()
