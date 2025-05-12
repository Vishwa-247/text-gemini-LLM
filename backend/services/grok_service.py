
import os
import requests
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

# API key from environment variables
GROK_API_KEY = os.getenv("GROK_API_KEY")

def ask_grok(messages):
    """
    Send a request to Grok API with the given messages.
    """
    try:
        # Format messages for Grok API
        formatted_messages = []
        for msg in messages:
            if msg["role"] in ["user", "assistant", "system"]:
                formatted_messages.append({
                    "role": msg["role"],
                    "content": msg["content"]
                })
        
        # Set up the API request
        headers = {
            "Authorization": f"Bearer {GROK_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "messages": formatted_messages,
            "temperature": 0.7,
            "max_tokens": 1000
        }
        
        # Since the actual Grok API endpoint might differ, this is a placeholder
        # In a real implementation, you would use the correct endpoint
        response = requests.post(
            "https://api.grok.x/v1/chat/completions",
            headers=headers,
            json=data
        )
        
        # Check if the request was successful
        if response.status_code == 200:
            result = response.json()
            return result["choices"][0]["message"]["content"]
        else:
            return f"Error from Grok API: {response.status_code} - {response.text}"
    
    except Exception as e:
        return f"Failed to connect to Grok API: {str(e)}"
