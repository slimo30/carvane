from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from enum import Enum


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class PaymentMethod(str, Enum):
    CARD = "card"
    CASH = "cash"
    DIGITAL = "digital"
    CHARGILY = "chargily"


class ChargilyStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    FAILED = "failed"
    EXPIRED = "expired"
    CANCELLED = "cancelled"


class Payment(Document):
    """Payment model for handling transactions"""
    
    # Basic payment info
    amount: float = Field(..., description="Payment amount")
    currency: str = Field(default="DZD", description="Payment currency")
    status: PaymentStatus = Field(default=PaymentStatus.PENDING, description="Payment status")
    method: PaymentMethod = Field(..., description="Payment method")
    
    # Related entities
    user_id: Optional[str] = Field(None, description="User who made the payment")
    restaurant_id: Optional[str] = Field(None, description="Restaurant where payment was made")
    order_id: Optional[str] = Field(None, description="Related order ID")
    table_id: Optional[str] = Field(None, description="Table number")
    
    # Chargily specific fields
    chargily_payment_id: Optional[str] = Field(None, description="Chargily payment ID")
    chargily_status: Optional[ChargilyStatus] = Field(None, description="Chargily payment status")
    chargily_payment_url: Optional[str] = Field(None, description="Chargily payment URL")
    chargily_webhook_data: Optional[Dict[str, Any]] = Field(None, description="Chargily webhook data")
    
    # Transaction details
    transaction_id: Optional[str] = Field(None, description="Internal transaction ID")
    external_transaction_id: Optional[str] = Field(None, description="External payment provider transaction ID")
    
    # Metadata
    description: Optional[str] = Field(None, description="Payment description")
    notes: Optional[str] = Field(None, description="Additional notes")
    metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, description="Additional metadata")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = Field(None, description="When payment was completed")
    expires_at: Optional[datetime] = Field(None, description="When payment expires")
    
    class Settings:
        name = "payments"
        indexes = [
            "user_id",
            "restaurant_id",
            "order_id",
            "status",
            "method",
            "chargily_payment_id",
            "created_at"
        ]


class PaymentCreate(BaseModel):
    """Schema for creating a new payment"""
    amount: float
    currency: str = "DZD"
    method: PaymentMethod
    user_id: Optional[str] = None
    restaurant_id: Optional[str] = None
    order_id: Optional[str] = None
    table_id: Optional[str] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class PaymentUpdate(BaseModel):
    """Schema for updating a payment"""
    status: Optional[PaymentStatus] = None
    chargily_payment_id: Optional[str] = None
    chargily_status: Optional[ChargilyStatus] = None
    chargily_payment_url: Optional[str] = None
    transaction_id: Optional[str] = None
    external_transaction_id: Optional[str] = None
    notes: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None


class ChargilyWebhookData(BaseModel):
    """Schema for Chargily webhook data"""
    invoice_id: str
    invoice_number: str
    amount: float
    currency: str
    status: str
    payment_method: str
    payment_id: str
    created_at: str
    updated_at: str
    metadata: Optional[Dict[str, Any]] = None


class ChargilyPaymentRequest(BaseModel):
    """Schema for Chargily payment request"""
    amount: float
    currency: str = "DZD"
    payment_method: str = "EDAHABIA"  # or "CIB"
    success_url: str
    failure_url: str
    webhook_url: str
    invoice_number: str
    metadata: Optional[Dict[str, Any]] = None


class ChargilyPaymentResponse(BaseModel):
    """Schema for Chargily payment response"""
    checkout_url: str
    invoice_id: str
    invoice_number: str
    amount: float
    currency: str
    status: str
    payment_method: str
    created_at: str
    expires_at: str


