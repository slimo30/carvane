from fastapi import FastAPI, Body, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, Dict, Any
import requests
import uuid
from datetime import datetime
import uvicorn
import os
import logging

# Configuration
GUIDDINI_API_URL = os.getenv("GUIDDINI_API_URL", "https://epay.guiddini.dz/api/payment")
GUIDDINI_APP_KEY = os.getenv("GUIDDINI_APP_KEY", "APP-3DV4XC3I6G6OTZ3SNV")
GUIDDINI_APP_SECRET = os.getenv("GUIDDINI_APP_SECRET", "SEC-RXCOVaZlkJXCXHYwAnetISZYM3QRszfI")
PORT = int(os.getenv("PORT", 8000))

app = FastAPI(title="Guiddini Payment Gateway API", version="1.0.0")

# In-memory storage for payments (use a real database in production)
payments_db: Dict[str, Dict[str, Any]] = {}

# Pydantic Models
class PaymentRequest(BaseModel):
    amount: str
    language: Optional[str] = "fr"  # fr, en, ar

class PaymentResponse(BaseModel):
    success: bool
    message: str
    status: str
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    status_code: int

# Logger Service
class LoggerService:
    def __init__(self, context: str):
        self.context = context
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        self.logger_instance = logging.getLogger(context)
    
    def logger(self, message: str, meta: Dict = None):
        meta_str = f" | {meta}" if meta else ""
        self.logger_instance.info(f"{message}{meta_str}")
    
    def error(self, message: str, error: Any, meta: Dict = None):
        meta_str = f" | {meta}" if meta else ""
        self.logger_instance.error(f"{message} | Error: {error}{meta_str}")

# Response Handler
class ResponseHandler:
    @staticmethod
    def success(data: Any, message: str, status: str = "success", status_code: int = 200):
        return PaymentResponse(
            success=True,
            message=message,
            status=status,
            data=data,
            status_code=status_code
        ).dict()
    
    @staticmethod
    def error(message: str, error: str, status: str = "error", status_code: int = 500):
        return PaymentResponse(
            success=False,
            message=message,
            status=status,
            error=error,
            status_code=status_code
        ).dict()

# Guiddini API Integration
class GuiddiniAPI:
    def __init__(self):
        self.base_url = GUIDDINI_API_URL
        self.app_key = GUIDDINI_APP_KEY
        self.app_secret = GUIDDINI_APP_SECRET
        self.log = LoggerService('GuiddiniAPI')
    
    def _get_headers(self) -> Dict[str, str]:
        """Get headers for Guiddini API requests"""
        return {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "x-app-key": self.app_key,
            "x-app-secret": self.app_secret
        }
    
    async def initiate_payment(self, amount: str, language: str = "fr") -> Dict[str, Any]:
        """
        Initiate payment with Guiddini API
        
        Args:
            amount: Payment amount as string
            language: Language preference (fr, en, ar)
        
        Returns:
            Dict containing payment initiation response
        """
        url = f"{self.base_url}/initiate"
        headers = self._get_headers()
        data = {
            "amount": amount,
            "language": language
        }
        
        try:
            self.log.logger(f"Initiating payment for amount: {amount}", {
                "url": url,
                "language": language
            })
            
            response = requests.post(url, json=data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Store payment in local database for tracking
                if "data" in result and "id" in result["data"]:
                    payment_id = result["data"]["id"]
                    payment_record = {
                        "id": payment_id,
                        "amount": amount,
                        "language": language,
                        "status": result["data"]["attributes"]["status"],
                        "form_url": result["data"]["attributes"]["form_url"],
                        "created_at": datetime.now().isoformat(),
                        "guiddini_response": result
                    }
                    payments_db[payment_id] = payment_record
                
                self.log.logger("Payment initiated successfully", {
                    "payment_id": result.get("data", {}).get("id", "unknown")
                })
                
                return result
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                self.log.error("Payment initiation failed", error_msg)
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            self.log.error("Network error during payment initiation", str(e))
            raise Exception(f"Network error: {str(e)}")
        except Exception as e:
            self.log.error("Unexpected error during payment initiation", str(e))
            raise Exception(f"Payment initiation failed: {str(e)}")
    
    async def verify_payment(self, transaction_id: str) -> Dict[str, Any]:
        """
        Verify payment status with Guiddini API
        
        Args:
            transaction_id: Transaction ID to verify
        
        Returns:
            Dict containing payment verification response
        """
        url = f"{self.base_url}/verify"
        headers = self._get_headers()
        data = {"transaction_id": transaction_id}
        
        try:
            self.log.logger(f"Verifying payment: {transaction_id}")
            
            response = requests.post(url, json=data, headers=headers, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                
                # Update local payment record if exists
                if transaction_id in payments_db:
                    payments_db[transaction_id].update({
                        "verified_at": datetime.now().isoformat(),
                        "verification_response": result
                    })
                
                self.log.logger("Payment verified successfully", {
                    "transaction_id": transaction_id
                })
                
                return result
            else:
                error_msg = f"HTTP {response.status_code}: {response.text}"
                self.log.error("Payment verification failed", error_msg)
                raise Exception(error_msg)
                
        except requests.exceptions.RequestException as e:
            self.log.error("Network error during payment verification", str(e))
            raise Exception(f"Network error: {str(e)}")
        except Exception as e:
            self.log.error("Unexpected error during payment verification", str(e))
            raise Exception(f"Payment verification failed: {str(e)}")

# Payment Controller
class PaymentController:
    def __init__(self):
        self.log = LoggerService('PaymentController')
        self.guiddini_api = GuiddiniAPI()
    
    async def create_payment(self, payment_request: PaymentRequest):
        """Create a new payment"""
        self.log.logger('Creating payment', {
            'module': 'PaymentController', 
            'method': 'create_payment',
            'amount': payment_request.amount
        })
        
        try:
            # Validate amount
            try:
                amount_float = float(payment_request.amount)
                if amount_float <= 0:
                    raise ValueError("Amount must be greater than 0")
            except ValueError as e:
                return ResponseHandler.error(
                    'Invalid amount format',
                    str(e),
                    'validation_error',
                    400
                )
            
            # Initiate payment with Guiddini
            payment_response = await self.guiddini_api.initiate_payment(
                payment_request.amount,
                payment_request.language
            )
            
            return ResponseHandler.success(
                payment_response,
                'Payment initiated successfully',
                'success',
                201
            )
            
        except Exception as error:
            self.log.error('Error creating payment', error, {
                'module': 'PaymentController', 
                'method': 'create_payment'
            })
            return ResponseHandler.error(
                'Error creating payment',
                str(error),
                'error',
                500
            )
    
    async def verify_payment(self, transaction_id: str):
        """Verify payment status"""
        self.log.logger('Verifying payment', {
            'module': 'PaymentController', 
            'method': 'verify_payment',
            'transaction_id': transaction_id
        })
        
        try:
            verification_response = await self.guiddini_api.verify_payment(transaction_id)
            
            return ResponseHandler.success(
                verification_response,
                'Payment verification completed',
                'success',
                200
            )
            
        except Exception as error:
            self.log.error('Error verifying payment', error, {
                'module': 'PaymentController', 
                'method': 'verify_payment'
            })
            return ResponseHandler.error(
                'Error verifying payment',
                str(error),
                'error',
                500
            )
    
    async def get_payment_status(self, payment_id: str):
        """Get payment status from local storage"""
        self.log.logger('Getting payment status', {
            'module': 'PaymentController', 
            'method': 'get_payment_status',
            'payment_id': payment_id
        })
        
        try:
            if payment_id not in payments_db:
                return ResponseHandler.error(
                    'Payment not found',
                    f'Payment with ID {payment_id} not found',
                    'not_found',
                    404
                )
            
            payment_data = payments_db[payment_id]
            
            return ResponseHandler.success(
                payment_data,
                'Payment status retrieved successfully',
                'success',
                200
            )
            
        except Exception as error:
            self.log.error('Error getting payment status', error, {
                'module': 'PaymentController', 
                'method': 'get_payment_status'
            })
            return ResponseHandler.error(
                'Error getting payment status',
                str(error),
                'error',
                500
            )
    
    async def list_payments(self):
        """List all payments"""
        self.log.logger('Listing all payments', {
            'module': 'PaymentController', 
            'method': 'list_payments'
        })
        
        try:
            payments_list = list(payments_db.values())
            
            return ResponseHandler.success(
                {
                    "payments": payments_list,
                    "total": len(payments_list)
                },
                'Payments retrieved successfully',
                'success',
                200
            )
            
        except Exception as error:
            self.log.error('Error listing payments', error, {
                'module': 'PaymentController', 
                'method': 'list_payments'
            })
            return ResponseHandler.error(
                'Error retrieving payments',
                str(error),
                'error',
                500
            )

# Initialize controller
payment_controller = PaymentController()

# API Routes
@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Guiddini Payment Gateway API",
        "version": "1.0.0",
        "status": "active"
    }

@app.post('/payment/initiate')
async def initiate_payment(payment_request: PaymentRequest):
    """
    Initiate a new payment
    
    - **amount**: Payment amount (required)
    - **language**: Language preference (fr, en, ar) - defaults to 'fr'
    """
    return await payment_controller.create_payment(payment_request)

@app.post('/payment/checkout')
async def checkout(amount: str = Body(..., embed=True), language: str = Body("fr", embed=True)):
    """
    Alternative checkout endpoint for backward compatibility
    """
    payment_request = PaymentRequest(amount=amount, language=language)
    return await payment_controller.create_payment(payment_request)

@app.post('/payment/verify/{transaction_id}')
async def verify_payment(transaction_id: str):
    """
    Verify payment status by transaction ID
    
    - **transaction_id**: Transaction ID to verify
    """
    return await payment_controller.verify_payment(transaction_id)

@app.get('/payment/status/{payment_id}')
async def get_payment_status(payment_id: str):
    """
    Get payment status from local storage
    
    - **payment_id**: Payment ID to check
    """
    return await payment_controller.get_payment_status(payment_id)

@app.get('/payments')
async def list_payments():
    """
    List all payments stored locally
    """
    return await payment_controller.list_payments()

@app.get('/health')
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "Guiddini Payment Gateway API"
    }

# Error Handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return ResponseHandler.error(
        "HTTP Exception",
        str(exc.detail),
        "http_error",
        exc.status_code
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    logging.error(f"Unhandled exception: {str(exc)}")
    return ResponseHandler.error(
        "Internal Server Error",
        "An unexpected error occurred",
        "internal_error",
        500
    )

if __name__ == "__main__":
    print(f"Starting Guiddini Payment Gateway API on port {PORT}")
    print(f"API URL: {GUIDDINI_API_URL}")
    print(f"App Key: {GUIDDINI_APP_KEY[:10]}...")
    uvicorn.run("payment_guidini:app", host="0.0.0.0", port=PORT, reload=True)