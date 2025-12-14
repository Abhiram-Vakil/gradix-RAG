from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.chroma_db import query_knowledge_base
from services.llm_service import generate_ideal_answer, grade_with_rubric

router = APIRouter()

class GradingRequest(BaseModel):
    question: str
    student_answer: str
    rubric: str

@router.post("/grade")
async def grade_answer_endpoint(request: GradingRequest):
    """
    Endpoint to grade an answer.
    1. Retrieval: Fetch syllabus context.
    2. Ideal Answer: Generate using context.
    3. Grading: Compare Student vs Ideal vs Rubric.
    """
    if not request.question or not request.student_answer:
         raise HTTPException(status_code=400, detail="Question and Student Answer are required.")

    print(f"📝 Received grading request for: {request.question[:50]}...")

    # 1. Fetch Context
    context_results = query_knowledge_base(request.question, n_results=3)
    context_chunks = []
    if context_results and context_results['documents']:
        context_chunks = context_results['documents'][0]
        print(f"📚 Retrieved {len(context_chunks)} chunks for context.")

    if not context_chunks:
        # Fallback if no context found? Or just proceed with empty context (LLM might hallucinate or use general knowledge)
        print("⚠️ No relevant context found in Knowledge Base.")
    
    # 2. Generate Ideal Answer
    print("🤖 Generating ideal answer...")
    ideal_answer = generate_ideal_answer(request.question, context_chunks)

    # 3. Grade with Rubric
    print("⚖️ Grading student answer...")
    grading_result = grade_with_rubric(
        request.question, 
        request.student_answer, 
        ideal_answer, 
        request.rubric
    )

    return {
        "status": "completed",
        "grading_result": grading_result,
        "ideal_answer": ideal_answer, # Optional: return this so user can see it
        "context_used": len(context_chunks) > 0
    }
