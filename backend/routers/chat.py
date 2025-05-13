
from flask import Blueprint, request, jsonify
from services.openai_service import ask_openai
from services.gemini_service import ask_gemini
from services.claude_service import ask_claude
from services.grok_service import ask_grok
from database.mongodb import MongoDB
from datetime import datetime
import json

# Initialize MongoDB client
mongo_db = MongoDB()

# Create a blueprint for chat routes
chat_router = Blueprint('chat', __name__, url_prefix='/api')

# In-memory conversation cache (temporary, before saving to MongoDB)
conversations_cache = {}

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

@chat_router.route('/chat', methods=['POST'])
def chat():
    data = request.json
    model = data.get('model', 'chatgpt')
    message = data.get('message', '')
    conversation_id = data.get('conversation_id')
    
    print(f"Received chat request: model={model}, conversation_id={conversation_id}")
    
    try:
        # Create a new conversation if it doesn't exist
        if not conversation_id:
            print("Creating new conversation")
            conversation_id = mongo_db.create_chat(model=model, title=message[:30])
            # Initialize with system message in cache
            conversations_cache[conversation_id] = [system_message]
            # Save system message to MongoDB
            mongo_db.save_message(conversation_id, "system", system_message["content"])
        elif conversation_id not in conversations_cache:
            print(f"Loading existing conversation {conversation_id}")
            # Load conversation history from DB to cache
            messages_db = mongo_db.get_chat_history(conversation_id)
            
            # Convert to the format needed by LLM clients
            conversations_cache[conversation_id] = []
            has_system_message = False
            
            for msg in messages_db:
                conversations_cache[conversation_id].append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
                if msg["role"] == "system":
                    has_system_message = True
            
            # Add system message if not present
            if not has_system_message:
                conversations_cache[conversation_id].insert(0, system_message)
                mongo_db.save_message(conversation_id, "system", system_message["content"])
        
        print(f"Adding user message to conversation cache")
        # Add user message to conversation cache
        conversations_cache[conversation_id].append({
            "role": "user",
            "content": message
        })
        
        # Save user message to MongoDB
        mongo_db.save_message(conversation_id, "user", message)
        
        # Get response based on selected model
        print(f"Getting response from {model}")
        if model == 'chatgpt':
            response_text = ask_openai(conversations_cache[conversation_id])
        elif model == 'gemini':
            response_text = ask_gemini(conversations_cache[conversation_id])
        elif model == 'claude':
            response_text = ask_claude(conversations_cache[conversation_id])
        elif model == 'grok':
            response_text = ask_grok(conversations_cache[conversation_id])
        else:
            return jsonify({"error": f"Unsupported model: {model}"}), 400
        
        # Add assistant response to conversation cache
        conversations_cache[conversation_id].append({
            "role": "assistant",
            "content": response_text
        })
        
        # Save assistant response to MongoDB
        mongo_db.save_message(conversation_id, "assistant", response_text)
        
        print(f"Returning response for conversation {conversation_id}")
        return jsonify({
            "response": response_text,
            "conversation_id": conversation_id
        })
        
    except Exception as e:
        print(f"Error in chat endpoint: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_router.route('/chats', methods=['GET'])
def get_chats():
    try:
        # Get all chats for anonymous user (you can add user authentication later)
        chats = mongo_db.get_all_chats()
        print(f"Retrieved {len(chats)} chats")
        return jsonify({"chats": chats})
        
    except Exception as e:
        print(f"Error getting chats: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_router.route('/chats/<chat_id>', methods=['GET'])
def get_chat_history(chat_id):
    try:
        # Get conversation history
        limit = request.args.get('limit', 100, type=int)
        print(f"Getting chat history for {chat_id}, limit={limit}")
        messages = mongo_db.get_chat_history(chat_id, limit)
        print(f"Retrieved {len(messages)} messages")
        return jsonify({"messages": messages})
        
    except Exception as e:
        print(f"Error getting chat history: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_router.route('/chats/<chat_id>', methods=['DELETE'])
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
        print(f"Error deleting chat: {str(e)}")
        return jsonify({"error": str(e)}), 500
