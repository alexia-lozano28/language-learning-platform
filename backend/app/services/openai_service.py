import openai
import os
from openai import OpenAI
import json
from app.core.config import OPENAI_API_KEY

client = OpenAI(
    api_key=OPENAI_API_KEY
)

async def call_openai(prompt: str):
    response = client.responses.create(
      model="gpt-5-nano",
      input=prompt,
      store=True,
    )
    
    return response
