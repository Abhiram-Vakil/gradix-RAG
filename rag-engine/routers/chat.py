from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.llm_service import get_llm_response

from services.chroma_db import query_knowledge_base

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
    
    # 1. Retrieve Context
    context_results = query_knowledge_base(request.message)
    context_chunks = []
    
    if context_results and context_results['documents']:
        # Chroma returns a list of lists (one for each query)
        context_chunks = context_results['documents'][0]
        print(f"📚 Retrieved {len(context_chunks)} chunks for context.")
    
    # 2. Generate Response with Context
    response_text = get_llm_response(request.message, context=context_chunks)
    
    return {
        "response": response_text,
        "sources": context_results['metadatas'][0] if context_results and context_results['metadatas'] else []
    }
