from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, RAGChatResponse
from app.services import rag_service

router = APIRouter(tags=["rag"])


@router.post("/rag/chat", response_model=RAGChatResponse)
async def rag_chat(request: ChatRequest):
    """
    RAG-enhanced chat endpoint.
    Retrieves relevant context from indexed documents before generating response.
    """
    try:
        result = await rag_service.rag_chat(
            message=request.message,
            language=request.language,
        )
        return RAGChatResponse(
            response=result["response"],
            language=result["language"],
            sources=[
                {"filename": s["filename"], "page": s.get("page"), "chunk": s.get("chunk")}
                for s in result["sources"]
            ],
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"RAG service error: {str(e)}"
        )
