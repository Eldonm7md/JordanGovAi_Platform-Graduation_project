"""Conversation and message persistence service."""

from typing import List, Dict, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from app.models.database_models import Conversation, Message


def create_conversation(
    db: Session,
    user_id: UUID,
    title: str = "",
    language: str = "ar",
) -> Conversation:
    """Create a new conversation."""
    conversation = Conversation(
        user_id=user_id,
        title=title or ("محادثة جديدة" if language == "ar" else "New Chat"),
        language=language,
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation


def get_conversations(db: Session, user_id: UUID) -> List[Conversation]:
    """Get all conversations for a user, most recent first."""
    return (
        db.query(Conversation)
        .filter(Conversation.user_id == user_id)
        .order_by(Conversation.updated_at.desc())
        .all()
    )


def get_conversation(db: Session, conversation_id: UUID) -> Optional[Conversation]:
    """Get a single conversation by ID."""
    return db.query(Conversation).filter(Conversation.id == conversation_id).first()


def add_message(
    db: Session,
    conversation_id: UUID,
    role: str,
    content: str,
    input_type: str = "text",
    language: str = "ar",
    sources: Optional[List[Dict]] = None,
) -> Message:
    """Add a message to a conversation."""
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content,
        input_type=input_type,
        language=language,
        sources=sources,
    )
    db.add(message)

    # Update conversation title from first user message
    conversation = get_conversation(db, conversation_id)
    if conversation and not conversation.title.strip() or conversation.title in ["محادثة جديدة", "New Chat"]:
        if role == "user":
            conversation.title = content[:50] + ("..." if len(content) > 50 else "")

    db.commit()
    db.refresh(message)
    return message


def get_messages(db: Session, conversation_id: UUID) -> List[Message]:
    """Get all messages for a conversation."""
    return (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.asc())
        .all()
    )


def get_conversation_history(
    db: Session,
    conversation_id: UUID,
    limit: int = 20,
) -> List[Dict[str, str]]:
    """
    Get conversation history formatted for the LLM context window.
    Returns list of {role, content} dicts.
    """
    messages = (
        db.query(Message)
        .filter(Message.conversation_id == conversation_id)
        .order_by(Message.created_at.desc())
        .limit(limit)
        .all()
    )

    # Reverse to get chronological order
    messages.reverse()

    return [{"role": msg.role, "content": msg.content} for msg in messages]
