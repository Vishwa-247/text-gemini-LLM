
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
