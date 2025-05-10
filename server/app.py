
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from bson import ObjectId
import json

# Import LLM clients
from llm_clients.openai_client import ask_openai
from llm_clients.gemini_client import ask_gemini
from llm_clients.claude_client import ask_claude

# Import MongoDB client
from db.mongo_client import MongoDB

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize MongoDB client
mongo_db = MongoDB()

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

# In-memory conversation cache (temporary, before saving to MongoDB)
conversations_cache = {}

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return json.JSONEncoder.default(self, obj)

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model', 'chatgpt')
    message = data.get('message', '')
    conversation_id = data.get('conversation_id')
    
    try:
        # Create a new conversation if it doesn't exist
        if not conversation_id:
            conversation_id = mongo_db.create_chat(model=model, title=message[:30])
            # Initialize with system message in cache
            conversations_cache[conversation_id] = [system_message]
        elif conversation_id not in conversations_cache:
            # Load conversation history from DB to cache
            messages_db = mongo_db.get_chat_history(conversation_id)
            
            # Convert to the format needed by LLM clients
            conversations_cache[conversation_id] = [system_message]  # Always start with system message
            for msg in messages_db:
                conversations_cache[conversation_id].append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Add user message to conversation cache
        conversations_cache[conversation_id].append({
            "role": "user",
            "content": message
        })
        
        # Save user message to MongoDB
        mongo_db.save_message(conversation_id, "user", message)
        
        # Get response based on selected model
        if model == 'chatgpt':
            response_text = ask_openai(conversations_cache[conversation_id])
        elif model == 'gemini':
            response_text = ask_gemini(conversations_cache[conversation_id])
        elif model == 'claude':
            response_text = ask_claude(conversations_cache[conversation_id])
        else:
            return jsonify({"error": "Unsupported model"}), 400
        
        # Add assistant response to conversation cache
        conversations_cache[conversation_id].append({
            "role": "assistant",
            "content": response_text
        })
        
        # Save assistant response to MongoDB
        mongo_db.save_message(conversation_id, "assistant", response_text)
        
        return jsonify({
            "response": response_text,
            "conversation_id": conversation_id
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chats', methods=['GET'])
def get_chats():
    try:
        # Get all chats for anonymous user (you can add user authentication later)
        chats = mongo_db.get_all_chats()
        
        # Convert ObjectId to string
        chats_json = json.loads(JSONEncoder().encode(chats))
        
        return jsonify({
            "chats": chats_json
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chats/<chat_id>', methods=['GET'])
def get_chat_history(chat_id):
    try:
        # Get conversation history
        limit = request.args.get('limit', 50, type=int)
        messages = mongo_db.get_chat_history(chat_id, limit)
        
        # Convert ObjectId to string
        messages_json = json.loads(JSONEncoder().encode(messages))
        
        return jsonify({
            "messages": messages_json
        })
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/chats/<chat_id>', methods=['DELETE'])
def delete_chat(chat_id):
    try:
        success = mongo_db.delete_chat(chat_id)
        
        if success:
            # Remove from cache if exists
            if chat_id in conversations_cache:
                del conversations_cache[chat_id]
            
            return jsonify({
                "success": True,
                "message": "Chat deleted successfully"
            })
        else:
            return jsonify({
                "success": False,
                "message": "Failed to delete chat"
            }), 500
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
