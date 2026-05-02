from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
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


# ─── Title generation ──────────────────────────────────────────
class TitleRequest(BaseModel):
    user_message: str
    assistant_response: str
    language: str = "ar"


class TitleResponse(BaseModel):
    title: str


_TITLE_SYSTEM_AR = (
    "أنت مساعد متخصص في تلخيص المحادثات. "
    "أعطِ عنواناً قصيراً جداً (٣-٥ كلمات) يصف موضوع المحادثة. "
    "ردّ بالعنوان فقط — بدون اقتباسات، بدون نقاط، بدون أي مقدمة."
)
_TITLE_SYSTEM_EN = (
    "You are a concise conversation titler. "
    "Give a very short title (3-5 words) that captures the topic. "
    "Reply with ONLY the title text — no quotes, no punctuation, no preamble."
)


@router.post("/chat/title", response_model=TitleResponse)
async def chat_title(request: TitleRequest):
    """
    Lightweight title generation. Feeds the first exchange to the same
    Cerebras model with a tiny system prompt and short max_tokens.
    """
    system_prompt = _TITLE_SYSTEM_AR if request.language == "ar" else _TITLE_SYSTEM_EN
    user_block = (
        f"User: {request.user_message}\n"
        f"Assistant: {request.assistant_response}"
    )
    try:
        raw = await cerebras_service.chat(
            message=user_block,
            language=request.language,
            system_prompt=system_prompt,
            temperature=0.2,
            max_tokens=24,
        )
        title = raw.strip().strip('"').strip("'").strip("«»").strip("“”").rstrip(".،,!?")
        # Cap to ~6 words / 60 chars defensively.
        words = title.split()
        if len(words) > 6:
            title = " ".join(words[:6])
        if len(title) > 60:
            title = title[:60].rstrip()
        return TitleResponse(title=title or request.user_message[:40])
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error generating title: {str(e)}"
        )
