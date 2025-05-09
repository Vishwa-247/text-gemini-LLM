
from flask import Flask, request, jsonify
from flask_cors import CORS
import os

# Import LLM clients
from llm_clients.openai_client import ask_openai
from llm_clients.gemini_client import ask_gemini
from llm_clients.claude_client import ask_claude

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Hardcoded API keys (for development only)
OPENAI_API_KEY = "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"
GEMINI_API_KEY = "AIzaSyCr5e_YREkbM8OXc5XL550wJf8ArohFT_Q"
ANTHROPIC_API_KEY = "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"

# System message for AI
system_message = {
    "role": "system",
    "content": (
        "You are Studymate-AI, an expert career coach. "
        "You help users explore career options, choose the right skills, build strong resumes, "
        "prepare for interviews, and plan their professional growth. "
        "Give clear, friendly, and actionable advice tailored to the user's goals. "
        "Explain in simple English, like for a 2nd-grade student."
    )
}

# In-memory conversation history (in production, use a database)
conversations = {}

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model', 'chatgpt')
    message = data.get('message', '')
    conversation_id = data.get('conversation_id', 'default')
    
    # Create or get conversation history
    if conversation_id not in conversations:
        conversations[conversation_id] = [system_message]
    
    # Add user message to conversation
    conversations[conversation_id].append({
        "role": "user",
        "content": message
    })
    
    try:
        # Get response based on selected model
        if model == 'chatgpt':
            response_text = ask_openai(conversations[conversation_id])
        elif model == 'gemini':
            response_text = ask_gemini(conversations[conversation_id])
        elif model == 'claude':
            response_text = ask_claude(conversations[conversation_id])
        else:
            return jsonify({"error": "Unsupported model"}), 400
        
        # Add assistant response to conversation history
        conversations[conversation_id].append({
            "role": "assistant",
            "content": response_text
        })
        
        return jsonify({
            "response": response_text,
            "conversation_id": conversation_id
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
