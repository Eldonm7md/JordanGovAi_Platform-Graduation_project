from pydantic import BaseModel
from typing import Optional, List


# Chat schemas
class ChatRequest(BaseModel):
    message: str
    language: str = "ar"
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    language: str


class SourceInfo(BaseModel):
    filename: str
    page: Optional[int] = None
    chunk: Optional[str] = None


class RAGChatResponse(BaseModel):
    response: str
    language: str
    sources: List[SourceInfo] = []


# Health check
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
