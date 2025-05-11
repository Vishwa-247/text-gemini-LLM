
from flask import Blueprint, request, jsonify
from services.openai_service import ask_openai
from services.gemini_service import ask_gemini
from services.claude_service import ask_claude
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
    custom_model_data = data.get('custom_model', None)
    
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
        elif custom_model_data:
            # This is a placeholder for custom model integration
            # In a real implementation, you would use the custom_model_data to make API calls
            response_text = f"Response from custom model: {model}. Custom model integration is in development."
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

@chat_router.route('/chats', methods=['GET'])
def get_chats():
    try:
        # Get all chats for anonymous user (you can add user authentication later)
        chats = mongo_db.get_all_chats()
        return jsonify({"chats": chats})
        
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

@chat_router.route('/chats/<chat_id>', methods=['GET'])
def get_chat_history(chat_id):
    try:
        # Get conversation history
        limit = request.args.get('limit', 50, type=int)
        messages = mongo_db.get_chat_history(chat_id, limit)
        return jsonify({"messages": messages})
        
    except Exception as e:
        print(f"Error: {str(e)}")
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
        print(f"Error: {str(e)}")
        return jsonify({"error": str(e)}), 500

# Route to save custom model configurations
@chat_router.route('/models/custom', methods=['POST'])
def save_custom_model():
    try:
        data = request.json
        model_id = data.get('id')
        model_name = data.get('name')
        model_endpoint = data.get('apiEndpoint')
        
        # In a real implementation, you would store this in the database
        # For now, just return success
        return jsonify({
            "success": True,
            "message": f"Custom model {model_name} saved successfully"
        })
    except Exception as e:
        print(f"Error saving custom model: {str(e)}")
        return jsonify({"error": str(e)}), 500
