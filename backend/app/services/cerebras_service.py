from openai import AsyncOpenAI
from app.core.config import settings
from app.core.prompts import get_system_prompt
from typing import List, Dict, Optional


def get_client() -> AsyncOpenAI:
    """Create Cerebras client using OpenAI-compatible API."""
    if not settings.CEREBRAS_API_KEY:
        raise RuntimeError("CEREBRAS_API_KEY is not configured. Add it to backend/.env.")

    return AsyncOpenAI(
        api_key=settings.CEREBRAS_API_KEY,
        base_url="https://api.cerebras.ai/v1"
    )


async def chat(
    message: str,
    language: str = "ar",
    conversation_history: Optional[List[Dict[str, str]]] = None,
    system_prompt: Optional[str] = None,
) -> str:
    """
    Send a message to Cerebras and get a response.
    
    Args:
        message: User's message
        language: 'ar' for Arabic, 'en' for English
        conversation_history: Previous messages for context
    
    Returns:
        Assistant's response text
    """
    client = get_client()

    system_prompt = system_prompt or get_system_prompt(language, has_context=False)

    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history if available
    if conversation_history:
        messages.extend(conversation_history)

    messages.append({"role": "user", "content": message})

    response = await client.chat.completions.create(
        model=settings.CEREBRAS_MODEL,
        messages=messages,
        temperature=0.3,
        max_tokens=2048,
    )

    return response.choices[0].message.content
