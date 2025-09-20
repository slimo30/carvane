from fastapi import APIRouter, HTTPException, Depends, Request, BackgroundTasks
from typing import List, Optional
from datetime import datetime, timedelta
import uuid

from src.models.payament import (
    Payment, 
    PaymentCreate, 
    PaymentUpdate, 
    ChargilyPaymentRequest,
    ChargilyWebhookData,
    PaymentStatus,
    ChargilyStatus
)
from src.services.chargily_service import chargily_service
from src.exception import exceptions

router = APIRouter(prefix="/payments", tags=["payments"])


@router.post("/", response_model=Payment)
async def create_payment(payment_data: PaymentCreate) -> Payment:
    """Create a new payment"""
    
    try:
        # Create payment record
        payment = Payment(
            amount=payment_data.amount,
            currency=payment_data.currency,
            method=payment_data.method,
            user_id=payment_data.user_id,
            restaurant_id=payment_data.restaurant_id,
            order_id=payment_data.order_id,
            table_id=payment_data.table_id,
            description=payment_data.description,
            notes=payment_data.notes,
            metadata=payment_data.metadata or {},
            transaction_id=str(uuid.uuid4())
        )
        
        # If Chargily payment, create payment with Chargily
        if payment_data.method == "chargily":
            chargily_request = ChargilyPaymentRequest(
                amount=payment_data.amount,
                currency=payment_data.currency,
                success_url=f"https://your-frontend.com/payment/success?payment_id={payment.id}",
                failure_url=f"https://your-frontend.com/payment/failure?payment_id={payment.id}",
                webhook_url=f"https://your-backend.com/api/payments/webhook",
                invoice_number=f"INV-{payment.transaction_id}",
                metadata={
                    "payment_id": str(payment.id),
                    "user_id": payment_data.user_id,
                    "restaurant_id": payment_data.restaurant_id,
                    "table_id": payment_data.table_id
                }
            )
            
            chargily_response = await chargily_service.create_payment(
                chargily_request, 
                str(payment.id)
            )
            
            payment.chargily_payment_id = chargily_response.invoice_id
            payment.chargily_payment_url = chargily_response.checkout_url
            payment.chargily_status = ChargilyStatus.PENDING
            payment.status = PaymentStatus.PROCESSING
            payment.expires_at = datetime.utcnow() + timedelta(hours=24)
        
        await payment.insert()
        return payment
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create payment: {str(e)}")


@router.get("/{payment_id}", response_model=Payment)
async def get_payment(payment_id: str) -> Payment:
    """Get payment by ID"""
    
    payment = await Payment.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    return payment


@router.get("/", response_model=List[Payment])
async def list_payments(
    user_id: Optional[str] = None,
    restaurant_id: Optional[str] = None,
    status: Optional[PaymentStatus] = None,
    limit: int = 50,
    offset: int = 0
) -> List[Payment]:
    """List payments with optional filters"""
    
    query = {}
    if user_id:
        query["user_id"] = user_id
    if restaurant_id:
        query["restaurant_id"] = restaurant_id
    if status:
        query["status"] = status
    
    payments = await Payment.find(query).skip(offset).limit(limit).to_list()
    return payments


@router.put("/{payment_id}", response_model=Payment)
async def update_payment(payment_id: str, payment_update: PaymentUpdate) -> Payment:
    """Update payment"""
    
    payment = await Payment.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # Update fields
    update_data = payment_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(payment, field, value)
    
    payment.updated_at = datetime.utcnow()
    await payment.save()
    
    return payment


@router.post("/{payment_id}/cancel")
async def cancel_payment(payment_id: str) -> dict:
    """Cancel a payment"""
    
    payment = await Payment.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment.status not in [PaymentStatus.PENDING, PaymentStatus.PROCESSING]:
        raise HTTPException(status_code=400, detail="Payment cannot be cancelled")
    
    payment.status = PaymentStatus.CANCELLED
    payment.updated_at = datetime.utcnow()
    await payment.save()
    
    return {"message": "Payment cancelled successfully"}


@router.get("/{payment_id}/status")
async def get_payment_status(payment_id: str) -> dict:
    """Get payment status"""
    
    payment = await Payment.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    # If Chargily payment, check status with Chargily
    if payment.method == "chargily" and payment.chargily_payment_id:
        try:
            chargily_status = await chargily_service.get_payment_status(payment.chargily_payment_id)
            
            # Update payment status based on Chargily status
            new_status = chargily_service.map_chargily_status_to_payment_status(chargily_status.status)
            new_chargily_status = chargily_service.map_chargily_status_to_chargily_status(chargily_status.status)
            
            if new_status != payment.status or new_chargily_status != payment.chargily_status:
                payment.status = new_status
                payment.chargily_status = new_chargily_status
                payment.updated_at = datetime.utcnow()
                
                if new_status == PaymentStatus.COMPLETED:
                    payment.completed_at = datetime.utcnow()
                
                await payment.save()
        except Exception as e:
            # Log error but don't fail the request
            print(f"Error checking Chargily status: {e}")
    
    return {
        "payment_id": payment.id,
        "status": payment.status,
        "chargily_status": payment.chargily_status,
        "amount": payment.amount,
        "currency": payment.currency,
        "method": payment.method,
        "created_at": payment.created_at,
        "updated_at": payment.updated_at
    }


@router.post("/webhook")
async def chargily_webhook(
    request: Request,
    background_tasks: BackgroundTasks
) -> dict:
    """Handle Chargily webhook"""
    
    try:
        # Get the raw body
        body = await request.body()
        signature = request.headers.get("X-Signature", "")
        
        # Verify signature
        if not chargily_service.verify_webhook_signature(body.decode(), signature):
            raise HTTPException(status_code=401, detail="Invalid signature")
        
        # Parse webhook data
        webhook_data = await request.json()
        chargily_data = chargily_service.parse_webhook_data(webhook_data)
        
        # Process webhook in background
        background_tasks.add_task(
            process_chargily_webhook,
            chargily_data
        )
        
        return {"status": "success"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Webhook processing failed: {str(e)}")


async def process_chargily_webhook(chargily_data: ChargilyWebhookData):
    """Process Chargily webhook data"""
    
    try:
        # Find payment by Chargily payment ID
        payment = await Payment.find_one({"chargily_payment_id": chargily_data.invoice_id})
        if not payment:
            print(f"Payment not found for Chargily invoice: {chargily_data.invoice_id}")
            return
        
        # Update payment status
        new_status = chargily_service.map_chargily_status_to_payment_status(chargily_data.status)
        new_chargily_status = chargily_service.map_chargily_status_to_chargily_status(chargily_data.status)
        
        payment.status = new_status
        payment.chargily_status = new_chargily_status
        payment.chargily_webhook_data = chargily_data.dict()
        payment.updated_at = datetime.utcnow()
        
        if new_status == PaymentStatus.COMPLETED:
            payment.completed_at = datetime.utcnow()
        
        await payment.save()
        
        print(f"Payment {payment.id} updated to status {new_status}")
        
    except Exception as e:
        print(f"Error processing Chargily webhook: {e}")


@router.get("/{payment_id}/chargily-url")
async def get_chargily_payment_url(payment_id: str) -> dict:
    """Get Chargily payment URL"""
    
    payment = await Payment.get(payment_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Payment not found")
    
    if payment.method != "chargily":
        raise HTTPException(status_code=400, detail="Payment is not a Chargily payment")
    
    if not payment.chargily_payment_url:
        raise HTTPException(status_code=400, detail="Chargily payment URL not available")
    
    return {
        "payment_url": payment.chargily_payment_url,
        "expires_at": payment.expires_at,
        "status": payment.status
    }
