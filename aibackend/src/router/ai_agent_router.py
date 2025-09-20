from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from src.models.conversation import Conversation, Message, ConversationCreate, MessageCreate
from src.services.ai_agent_service import ai_agent_service
from src.exception import exceptions

router = APIRouter(prefix="/ai", tags=["ai-agent"])


class ChatRequest(BaseModel):
    """Request model for chat with AI agent"""
    message: str
    conversation_id: Optional[str] = None
    user_id: Optional[str] = None
    restaurant_id: Optional[str] = None


class ChatResponse(BaseModel):
    """Response model for chat with AI agent"""
    response: str
    conversation_id: str
    message_id: str
    timestamp: datetime


class ConversationResponse(BaseModel):
    """Response model for conversation details"""
    id: str
    title: Optional[str]
    status: str
    user_id: Optional[str]
    restaurant_id: Optional[str]
    message_count: int
    created_at: datetime
    last_activity: datetime


class MessageResponse(BaseModel):
    """Response model for message details"""
    id: str
    conversation_id: str
    role: str
    content: str
    created_at: datetime
    model_used: Optional[str]
    processing_time: Optional[float]


@router.post("/chat", response_model=ChatResponse)
async def chat_with_agent(request: ChatRequest) -> ChatResponse:
    """Chat with the AI agent"""
    
    try:
        # Generate conversation ID if not provided
        conversation_id = request.conversation_id or f"conv_{datetime.utcnow().timestamp()}"
        
        # Process message with AI agent
        response = await ai_agent_service.process_message(
            conversation_id=conversation_id,
            message_content=request.message,
            user_id=request.user_id,
            restaurant_id=request.restaurant_id
        )
        
        # Get the latest message from the conversation
        latest_message = await Message.find_one(
            {"conversation_id": conversation_id},
            sort=[("created_at", -1)]
        )
        
        return ChatResponse(
            response=response,
            conversation_id=conversation_id,
            message_id=str(latest_message.id) if latest_message else "",
            timestamp=datetime.utcnow()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process message: {str(e)}")


@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(conversation_data: ConversationCreate) -> ConversationResponse:
    """Create a new conversation"""
    
    try:
        conversation = Conversation(
            title=conversation_data.title,
            user_id=conversation_data.user_id,
            restaurant_id=conversation_data.restaurant_id,
            ai_model=conversation_data.ai_model,
            system_prompt=conversation_data.system_prompt,
            max_tokens=conversation_data.max_tokens,
            temperature=conversation_data.temperature,
            tags=conversation_data.tags or [],
            metadata=conversation_data.metadata or {}
        )
        
        await conversation.insert()
        
        return ConversationResponse(
            id=str(conversation.id),
            title=conversation.title,
            status=conversation.status,
            user_id=conversation.user_id,
            restaurant_id=conversation.restaurant_id,
            message_count=conversation.message_count,
            created_at=conversation.created_at,
            last_activity=conversation.last_activity
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create conversation: {str(e)}")


@router.get("/conversations/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: str) -> ConversationResponse:
    """Get conversation by ID"""
    
    conversation = await Conversation.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return ConversationResponse(
        id=str(conversation.id),
        title=conversation.title,
        status=conversation.status,
        user_id=conversation.user_id,
        restaurant_id=conversation.restaurant_id,
        message_count=conversation.message_count,
        created_at=conversation.created_at,
        last_activity=conversation.last_activity
    )


@router.get("/conversations", response_model=List[ConversationResponse])
async def list_conversations(
    user_id: Optional[str] = None,
    restaurant_id: Optional[str] = None,
    limit: int = 50,
    offset: int = 0
) -> List[ConversationResponse]:
    """List conversations with optional filters"""
    
    query = {}
    if user_id:
        query["user_id"] = user_id
    if restaurant_id:
        query["restaurant_id"] = restaurant_id
    
    conversations = await Conversation.find(query).skip(offset).limit(limit).to_list()
    
    return [
        ConversationResponse(
            id=str(conv.id),
            title=conv.title,
            status=conv.status,
            user_id=conv.user_id,
            restaurant_id=conv.restaurant_id,
            message_count=conv.message_count,
            created_at=conv.created_at,
            last_activity=conv.last_activity
        )
        for conv in conversations
    ]


@router.get("/conversations/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: str,
    limit: int = 100,
    offset: int = 0
) -> List[MessageResponse]:
    """Get messages from a conversation"""
    
    # Check if conversation exists
    conversation = await Conversation.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = await Message.find(
        {"conversation_id": conversation_id}
    ).skip(offset).limit(limit).sort("created_at").to_list()
    
    return [
        MessageResponse(
            id=str(msg.id),
            conversation_id=msg.conversation_id,
            role=msg.role,
            content=msg.content,
            created_at=msg.created_at,
            model_used=msg.model_used,
            processing_time=msg.processing_time
        )
        for msg in messages
    ]


@router.post("/conversations/{conversation_id}/messages", response_model=MessageResponse)
async def add_message_to_conversation(
    conversation_id: str,
    message_data: MessageCreate
) -> MessageResponse:
    """Add a message to a conversation"""
    
    # Check if conversation exists
    conversation = await Conversation.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    try:
        message = Message(
            conversation_id=conversation_id,
            role=message_data.role,
            content=message_data.content,
            metadata=message_data.metadata or {}
        )
        
        await message.insert()
        
        # Update conversation
        conversation.message_count += 1
        conversation.last_activity = datetime.utcnow()
        await conversation.save()
        
        return MessageResponse(
            id=str(message.id),
            conversation_id=message.conversation_id,
            role=message.role,
            content=message.content,
            created_at=message.created_at,
            model_used=message.model_used,
            processing_time=message.processing_time
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add message: {str(e)}")


@router.put("/conversations/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    update_data: dict
) -> ConversationResponse:
    """Update conversation"""
    
    conversation = await Conversation.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    try:
        # Update fields
        for field, value in update_data.items():
            if hasattr(conversation, field):
                setattr(conversation, field, value)
        
        conversation.updated_at = datetime.utcnow()
        await conversation.save()
        
        return ConversationResponse(
            id=str(conversation.id),
            title=conversation.title,
            status=conversation.status,
            user_id=conversation.user_id,
            restaurant_id=conversation.restaurant_id,
            message_count=conversation.message_count,
            created_at=conversation.created_at,
            last_activity=conversation.last_activity
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update conversation: {str(e)}")


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(conversation_id: str) -> dict:
    """Delete conversation and all its messages"""
    
    conversation = await Conversation.get(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    try:
        # Delete all messages in the conversation
        await Message.find({"conversation_id": conversation_id}).delete()
        
        # Delete the conversation
        await conversation.delete()
        
        return {"message": "Conversation deleted successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete conversation: {str(e)}")


@router.get("/health")
async def health_check() -> dict:
    """Health check for AI agent service"""
    
    try:
        # Test basic functionality
        test_response = await ai_agent_service.process_message(
            conversation_id="health_check",
            message_content="Hello",
            user_id="system",
            restaurant_id="system"
        )
        
        return {
            "status": "healthy",
            "service": "ai-agent",
            "timestamp": datetime.utcnow(),
            "test_response_length": len(test_response)
        }
        
    except Exception as e:
        return {
            "status": "unhealthy",
            "service": "ai-agent",
            "timestamp": datetime.utcnow(),
            "error": str(e)
        }
