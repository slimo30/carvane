from beanie import Document
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


class MessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class ConversationStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    PAUSED = "paused"
    ARCHIVED = "archived"


class Message(Document):
    """Individual message in a conversation"""
    
    conversation_id: str = Field(..., description="ID of the conversation this message belongs to")
    role: MessageRole = Field(..., description="Role of the message sender")
    content: str = Field(..., description="Message content")
    
    # AI-specific fields
    tokens_used: Optional[int] = Field(None, description="Number of tokens used for this message")
    model_used: Optional[str] = Field(None, description="AI model used to generate this message")
    processing_time: Optional[float] = Field(None, description="Time taken to process this message in seconds")
    
    # Metadata
    created_at: datetime = Field(default_factory=datetime.utcnow)
    metadata: Optional[dict] = Field(default_factory=dict, description="Additional message metadata")
    
    class Settings:
        name = "messages"
        indexes = [
            "conversation_id",
            "role",
            "created_at"
        ]


class Conversation(Document):
    """Conversation model for AI interactions"""
    
    # Basic conversation info
    title: Optional[str] = Field(None, description="Conversation title")
    status: ConversationStatus = Field(default=ConversationStatus.ACTIVE, description="Conversation status")
    
    # Participants
    user_id: Optional[str] = Field(None, description="User ID if authenticated")
    session_id: Optional[str] = Field(None, description="Session ID for anonymous users")
    restaurant_id: Optional[str] = Field(None, description="Restaurant ID if restaurant-specific")
    
    # AI Configuration
    ai_model: str = Field(default="gpt-3.5-turbo", description="AI model to use for this conversation")
    system_prompt: Optional[str] = Field(None, description="System prompt for the AI")
    max_tokens: Optional[int] = Field(None, description="Maximum tokens per response")
    temperature: Optional[float] = Field(None, description="AI response temperature")
    
    # Conversation tracking
    total_tokens_used: int = Field(default=0, description="Total tokens used in this conversation")
    message_count: int = Field(default=0, description="Number of messages in this conversation")
    
    # Timestamps
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_activity: datetime = Field(default_factory=datetime.utcnow)
    
    # Metadata
    tags: List[str] = Field(default_factory=list, description="Tags for categorizing conversations")
    metadata: Optional[dict] = Field(default_factory=dict, description="Additional conversation metadata")
    
    class Settings:
        name = "conversations"
        indexes = [
            "user_id",
            "session_id",
            "restaurant_id",
            "status",
            "created_at",
            "last_activity"
        ]


class ConversationCreate(BaseModel):
    """Schema for creating a new conversation"""
    title: Optional[str] = None
    user_id: Optional[str] = None
    session_id: Optional[str] = None
    restaurant_id: Optional[str] = None
    ai_model: str = "gpt-3.5-turbo"
    system_prompt: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    tags: List[str] = []
    metadata: Optional[dict] = None


class MessageCreate(BaseModel):
    """Schema for creating a new message"""
    conversation_id: str
    role: MessageRole
    content: str
    metadata: Optional[dict] = None


class ConversationUpdate(BaseModel):
    """Schema for updating a conversation"""
    title: Optional[str] = None
    status: Optional[ConversationStatus] = None
    ai_model: Optional[str] = None
    system_prompt: Optional[str] = None
    max_tokens: Optional[int] = None
    temperature: Optional[float] = None
    tags: Optional[List[str]] = None
    metadata: Optional[dict] = None
