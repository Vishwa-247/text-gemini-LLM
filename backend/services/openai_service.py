
import openai
import os

# API key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "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")
OPENAI_MODEL = "gpt-4o-mini"

# Configure the client
openai.api_key = OPENAI_API_KEY

def ask_openai(messages):
    response = openai.ChatCompletion.create(
        model=OPENAI_MODEL,
        messages=messages
    )
    return response.choices[0].message['content']
