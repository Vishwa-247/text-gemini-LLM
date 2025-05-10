
import google.generativeai as genai
import os

# API key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyCr5e_YREkbM8OXc5XL550wJf8ArohFT_Q")
GEMINI_MODEL = "gemini-1.5-pro"

# Configure the Gemini API
genai.configure(api_key=GEMINI_API_KEY)

def ask_gemini(messages):
    # Create the model instance
    model = genai.GenerativeModel(GEMINI_MODEL)
    
    # Start a new chat
    chat = model.start_chat()

    # Replay the full conversation to maintain context
    for msg in messages:
        role = msg["role"]
        content = msg["content"]
        if role == "user":
            chat.send_message(content)
        elif role == "assistant":
            # Gemini doesn't have a way to feed assistant messages, but we'll send them anyway for context
            chat.send_message(content)

    # Only send the *last user message* again for actual reply
    user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
    response = chat.send_message(user_msg)

    return response.text
