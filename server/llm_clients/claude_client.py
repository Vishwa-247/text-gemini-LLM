
import anthropic

# Hardcoded API key for development
ANTHROPIC_API_KEY = "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"
ANTHROPIC_MODEL = "claude-3-sonnet-20240229"

def ask_claude(messages):
    # Create the client
    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    
    # Get system message and user message
    system_msg = messages[0]["content"]
    
    # Build conversation history for context
    history = []
    for msg in messages[1:]:  # Skip system message
        if msg["role"] in ["user", "assistant"]:
            history.append({
                "role": msg["role"],
                "content": msg["content"]
            })
    
    # If history is empty, get at least the last user message
    if not history:
        user_msg = next((m["content"] for m in reversed(messages) if m["role"] == "user"), "")
        history = [{"role": "user", "content": user_msg}]
    
    # Send request to Claude
    response = client.messages.create(
        model=ANTHROPIC_MODEL,
        system=system_msg,
        messages=history,
        max_tokens=1024,
        temperature=0.7
    )
    
    return response.content[0].text
