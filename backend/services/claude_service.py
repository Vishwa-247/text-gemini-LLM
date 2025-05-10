
import anthropic
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# API key from environment variables
ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-3-sonnet-20240229")

def ask_claude(messages):
    # Create the client
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    
    system_msg = messages[0]["content"]
    
    # Convert messages to the format Claude expects
    # Claude can handle full conversation history
    claude_messages = []
    for msg in messages[1:]:  # Skip system message
        if msg["role"] == "user" or msg["role"] == "assistant":
            claude_messages.append({"role": msg["role"], "content": msg["content"]})
    
    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        max_tokens=1000,
        temperature=0.7,
        system=system_msg,
        messages=claude_messages
    )
    
    return response.content[0].text
