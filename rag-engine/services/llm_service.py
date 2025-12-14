import os
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

# Initialize Groq client
# Ensure you have GROQ_API_KEY in your .env file
client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

def get_llm_response(prompt: str, context: list[str] = None, model: str = "llama-3.3-70b-versatile"):
    """
    Sends a prompt to Groq API and returns the response text.
    Uses Llama 3.3 70B by default (current recommended model).
    """
    
    system_message = "You are a helpful assistant."
    user_content = prompt

    if context:
        context_str = "\n".join(context)
        system_message = "You are a helpful assistant. Use the following context to answer the user's question. If the answer is not in the context, say so."
        user_content = f"Context:\n{context_str}\n\nQuestion: {prompt}"

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": system_message,
                },
                {
                    "role": "user",
                    "content": user_content,
                }
            ],
            model=model,
            temperature=0.3, # Low temperature for more factual grading
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"Error communicating with Groq: {str(e)}"

def generate_ideal_answer(question: str, context: list[str], model: str = "llama-3.3-70b-versatile") -> str:
    """
    Generates an ideal answer based on the syllabus context.
    """
    context_str = "\n\n".join(context)
    prompt = f"Based on the syllabus context, provide a comprehensive answer to the question.\n\nCONTEXT: {context_str}\nQUESTION: {question}\nProvide a clear, complete answer:"
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": prompt}
            ],
            model=model,
            temperature=0.2,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        print(f"❌ Error generating ideal answer: {e}")
        return "Error generating ideal answer"

def grade_with_rubric(question: str, student_answer: str, ideal_answer: str, rubric: str, model: str = "llama-3.3-70b-versatile") -> dict:
    """
    Grades the student answer against the ideal answer and rubric.
    Returns a JSON object.
    """
    grading_prompt = f"Grade this student answer using the rubric. Return only valid JSON.\n\nQUESTION: {question}\nIDEAL ANSWER: {ideal_answer}\nSTUDENT ANSWER: {student_answer}\nRUBRIC: {rubric}\n\nReturn JSON with: total_marks_awarded, total_possible_marks, percentage, component_breakdown (list of objects with component, marks_awarded, max_marks, feedback), overall_feedback, marks_lost_because (list of strings), improvement_suggestions (list of strings). Ensure the JSON is valid."

    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "user", "content": grading_prompt}
            ],
            model=model,
            temperature=0.1, # Very low temp for consistent grading
            response_format={"type": "json_object"}
        )
        import json
        return json.loads(chat_completion.choices[0].message.content)
    except Exception as e:
        print(f"❌ Error grading: {e}")
        return {"error": str(e), "status": "error"}

if __name__ == "__main__":
    # Simple test
    print("Testing connection to Groq...")
    response = get_llm_response("Hello, can you help me structure my project?")