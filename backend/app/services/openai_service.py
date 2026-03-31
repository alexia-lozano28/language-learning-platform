import openai
import os
from openai import OpenAI
import json

client = OpenAI(
  api_key=""
)

async def call_openai(prompt: str):
    response = client.responses.create(
      model="gpt-5-nano",
      input=prompt,
      store=True,
    )
    
    return response
