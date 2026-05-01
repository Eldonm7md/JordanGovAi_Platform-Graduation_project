from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse
from app.services import cerebras_service

router = APIRouter(tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Basic chat endpoint using Cerebras AI.
    Sends user message and returns AI response.
    """
    try:
        response = await cerebras_service.chat(
            message=request.message,
            language=request.language,
        )
        return ChatResponse(
            response=response,
            language=request.language,
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with AI service: {str(e)}"
        )
