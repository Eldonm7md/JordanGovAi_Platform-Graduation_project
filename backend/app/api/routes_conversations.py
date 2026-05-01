from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from uuid import UUID
from app.db.session import get_db
from app.core.security import get_current_user
from app.models.database_models import User
from app.services import conversation_service

router = APIRouter(prefix="/conversations", tags=["conversations"])


class CreateConversationRequest(BaseModel):
    title: Optional[str] = ""
    language: str = "ar"


class AddMessageRequest(BaseModel):
    message: str
    language: str = "ar"
    input_type: str = "text"


@router.get("/")
async def list_conversations(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """List all conversations for the current user."""
    conversations = conversation_service.get_conversations(db, user.id)
    return {
        "conversations": [
            {
                "id": str(c.id),
                "title": c.title,
                "language": c.language,
                "created_at": c.created_at.isoformat(),
                "updated_at": c.updated_at.isoformat() if c.updated_at else None,
            }
            for c in conversations
        ]
    }


@router.post("/")
async def create_conversation(
    request: CreateConversationRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new conversation."""
    conversation = conversation_service.create_conversation(
        db, user.id, title=request.title, language=request.language
    )
    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "language": conversation.language,
        "created_at": conversation.created_at.isoformat(),
    }


@router.get("/{conversation_id}")
async def get_conversation(
    conversation_id: UUID,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a conversation with all its messages."""
    conversation = conversation_service.get_conversation(db, conversation_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if conversation.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    messages = conversation_service.get_messages(db, conversation_id)

    return {
        "id": str(conversation.id),
        "title": conversation.title,
        "language": conversation.language,
        "created_at": conversation.created_at.isoformat(),
        "messages": [
            {
                "id": str(m.id),
                "role": m.role,
                "content": m.content,
                "input_type": m.input_type,
                "language": m.language,
                "sources": m.sources,
                "created_at": m.created_at.isoformat(),
            }
            for m in messages
        ],
    }


@router.post("/{conversation_id}/messages")
async def add_message(
    conversation_id: UUID,
    request: AddMessageRequest,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Send a message in a conversation and get AI response."""
    conversation = conversation_service.get_conversation(db, conversation_id)

    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")

    if conversation.user_id != user.id:
        raise HTTPException(status_code=403, detail="Access denied")

    # Save user message
    conversation_service.add_message(
        db, conversation_id,
        role="user",
        content=request.message,
        input_type=request.input_type,
        language=request.language,
    )

    # Get conversation history for context
    history = conversation_service.get_conversation_history(db, conversation_id, limit=20)

    # Get AI response (try RAG first, fall back to basic chat)
    from app.services import rag_service, cerebras_service

    try:
        result = await rag_service.rag_chat(
            message=request.message,
            language=request.language,
            conversation_history=history[:-1],  # Exclude last (current) message
        )
        response_text = result["response"]
        sources = result.get("sources", [])
    except Exception:
        response_text = await cerebras_service.chat(
            message=request.message,
            language=request.language,
            conversation_history=history[:-1],
        )
        sources = []

    # Save assistant message
    assistant_msg = conversation_service.add_message(
        db, conversation_id,
        role="assistant",
        content=response_text,
        language=request.language,
        sources=sources,
    )

    return {
        "id": str(assistant_msg.id),
        "role": "assistant",
        "content": response_text,
        "language": request.language,
        "sources": sources,
        "created_at": assistant_msg.created_at.isoformat(),
    }
