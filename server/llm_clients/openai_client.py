
import openai

# Hardcoded API key for development
OPENAI_API_KEY = "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"
OPENAI_MODEL = "gpt-4o-mini"

def ask_openai(messages):
    openai.api_key = OPENAI_API_KEY
    
    response = openai.ChatCompletion.create(
        model=OPENAI_MODEL,
        messages=[{"role": msg["role"], "content": msg["content"]} for msg in messages],
        temperature=0.7
    )
    
    return response.choices[0].message['content']
