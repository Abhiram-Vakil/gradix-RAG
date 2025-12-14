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

if __name__ == "__main__":
    # Simple test
    print("Testing connection to Groq...")
    response = get_llm_response("Hello, can you help me structure my project?")