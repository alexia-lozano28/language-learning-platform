import openai
import os
from openai import OpenAI
import json
from app.core.config import OPENAI_API_KEY

client_chatgpt = OpenAI(
    api_key=OPENAI_API_KEY
)

async def call_openai(prompt: str):
    response = client_chatgpt.responses.create(
      model="gpt-5-nano",
      input=prompt,
      store=True,
    )
    
    return response


client = OpenAI(
    base_url="http://localhost:11434/v1",
    api_key="ollama"
)


import requests

def clean_base64(image: str):
    if not image:
        return None
    return image.split(",")[1]  # REMOVE data:image/... prefix

import requests

import json
import requests

async def call_llm(prompt: str, image: str = None):

    image = clean_base64(image) if image else None

    messages = [{
        "role": "user",
        "content": prompt
    }]

    if image:
        messages[0]["images"] = [image]

    payload = {
        "model": "qwen2.5vl",
        "stream": False,
        "messages": messages
    }

    response = requests.post(
        "http://localhost:11434/api/chat",
        json=payload
    )

    raw = response.text.strip()

    try:
        res = json.loads(raw)
    except json.JSONDecodeError:
        res = json.loads(raw.split("\n")[0])

    return res["message"]["content"]