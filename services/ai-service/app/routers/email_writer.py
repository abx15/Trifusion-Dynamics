from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from ..services.llm_client import llm_client

router = APIRouter(prefix="/internal/email-writer", tags=["email"])

class EmailRequest(BaseModel):
    context: str
    tone: str = "professional"

class EmailResponse(BaseModel):
    subject: str
    body: str

@router.post("", response_model=EmailResponse)
async def write_email(req: EmailRequest):
    try:
        result = await llm_client.write_email(req.context, req.tone)
        return EmailResponse(
            subject=result.get("subject", ""),
            body=result.get("body", "")
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
