
import os
from pymongo import MongoClient
from datetime import datetime

# MongoDB connection - replace with your actual connection string
# For local development, use: "mongodb://localhost:27017/"
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "studymate_db"

# Collections
CHATS_COLLECTION = "chat_boxes"
MESSAGES_COLLECTION = "chat_messages"

class MongoDB:
    def __init__(self):
        self.client = MongoClient(MONGO_URI)
        self.db = self.client[DB_NAME]
        self.chats = self.db[CHATS_COLLECTION]
        self.messages = self.db[MESSAGES_COLLECTION]
    
    def create_chat(self, user_id="anonymous", title="New Chat", model="chatgpt"):
        """Create a new chat and return its ID"""
        chat_data = {
            "user_id": user_id,
            "title": title,
            "model": model,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = self.chats.insert_one(chat_data)
        return str(result.inserted_id)
    
    def save_message(self, chat_id, role, content):
        """Save a message to the chat history"""
        message_data = {
            "chat_id": chat_id,
            "role": role,
            "content": content,
            "timestamp": datetime.utcnow()
        }
        
        self.messages.insert_one(message_data)
        
        # Update chat's last updated timestamp
        self.chats.update_one(
            {"_id": chat_id}, 
            {"$set": {"updated_at": datetime.utcnow()}}
        )
    
    def get_chat_history(self, chat_id, limit=50):
        """Get messages for a specific chat with a limit"""
        messages = list(self.messages.find(
            {"chat_id": chat_id},
            {"_id": 0}  # Exclude MongoDB _id from results
        ).sort("timestamp", 1).limit(limit))  # Sort by timestamp ascending
        
        return messages
    
    def get_all_chats(self, user_id="anonymous", limit=20):
        """Get all chats for a specific user"""
        chats = list(self.chats.find(
            {"user_id": user_id}
        ).sort("updated_at", -1).limit(limit))  # Sort by last updated, descending
        
        return chats
    
    def delete_chat(self, chat_id):
        """Delete a chat and all its messages"""
        # Delete all messages in the chat
        self.messages.delete_many({"chat_id": chat_id})
        
        # Delete the chat itself
        self.chats.delete_one({"_id": chat_id})
        
        return True
