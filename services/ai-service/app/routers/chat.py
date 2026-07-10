from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Any
from ..services.llm_client import llm_client

router = APIRouter(prefix="/internal/chat", tags=["chat"])

class ChatRequest(BaseModel):
    message: str
    conversationHistory: List[Any] = []

class ChatResponse(BaseModel):
    reply: str

@router.post("", response_model=ChatResponse)
async def chat(req: ChatRequest):
    try:
        reply = await llm_client.chat(req.message, req.conversationHistory)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
