from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import get_llm_response

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Endpoint for the ChatBot.
    Receives a message and returns the LLM response.
    """
    if not request.message:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    response_text = get_llm_response(request.message)
    return {"response": response_text}
