from pydantic import BaseModel
from typing import Dict, Optional, List


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
# `status` is one of "ok" | "partial" | "down". `services` reports per
# upstream component so the frontend can show fine-grained state.
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    services: Dict[str, str] = {}
