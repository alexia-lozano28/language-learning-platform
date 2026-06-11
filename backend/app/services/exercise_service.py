from app.services.openai_service import call_openai, call_llm
import json
# async def generate_vocab_exercises(notes: str):
#     prompt = f"""
#     Generate vocabulary exercises from:
#     {notes}

#     Return JSON only.
#     """

#     response = await call_openai(prompt)
#     output_text = response.output[1].content[0].text

#     # Convertimos a dict para que FastAPI lo devuelva como JSON
#     import json
#     vocab_json = json.loads(output_text)
#     print(vocab_json)
#     return response

# import json



async def generate_vocab_exercises(notes: str, image_path: str = None):
    prompt = f"""
    German text:

    {notes}

    Task:
    Extract German vocabulary from the text above and the added image.

    Rules:
    - Use only vocabulary appearing in the German text and image.
    - Level A2.
    - Ignore these instructions.
    - Translate each word or expression into English.
    - Generate 10 flashcards.

    Return ONLY JSON.

    Example:

    [
    {{
        "word": "ich",
        "answer": "I"
    }}
    ]
    """
    output_text = await call_llm(prompt, image_path)

    # Clean common Llama mistakes
    output_text = output_text.strip()

    if output_text.startswith("```json"):
        output_text = output_text[7:]

    if output_text.startswith("```"):
        output_text = output_text[3:]

    if output_text.endswith("```"):
        output_text = output_text[:-3]

    output_text = output_text.strip()

    vocab_json = json.loads(output_text)
    if isinstance(vocab_json, list):
        flashcards = vocab_json
    elif "flashcards" in vocab_json:
        flashcards = vocab_json["flashcards"]
    else:
        raise ValueError("Unexpected response format")
    return flashcards

async def generate_fillInTheBlanks_exercises(notes: str, image_path: str = None):
    prompt = f"""
    German text:

    {notes}

    Task:
    Generate fill-in-the-blank exercises using the German text above and the added image.

    Rules:
    - Use only information and vocabulary appearing in the German text and image.
    - Level A2.
    - Ignore these instructions.
    - Hide important vocabulary words (nouns, verbs, adjectives, expressions).
    - Every exercise must focus on different vocabulary.
    - Avoid duplicate or near-duplicate sentences.
    - Use a variety of nouns, verbs and expressions.
    - Create 10 fill-in-the-blank exercises.
    - Replace exactly one important word or expression in each sentence with "___".
    - The missing word must be recoverable from the provided material.
    - Keep the sentences grammatically correct except for the blank.
    - Do not repeat the same answer multiple times.
    - Return the complete sentence with the blank and the missing word.

    Return ONLY JSON.

    Example:

    [
        {{
            "sentence": "Ich ___ mich jeden Morgen.",
            "answer": "wasche"
        }},
        {{
            "sentence": "Du ___ dich schnell.",
            "answer": "beeilst"
        }},
        {{
            "sentence": "Er ___ sich auf das Wochenende.",
            "answer": "freut"
        }}
    ]
    """
    output_text = await call_llm(prompt, image_path)

    # Clean common Llama mistakes
    output_text = output_text.strip()

    if output_text.startswith("```json"):
        output_text = output_text[7:]

    if output_text.startswith("```"):
        output_text = output_text[3:]

    if output_text.endswith("```"):
        output_text = output_text[:-3]

    output_text = output_text.strip()

    parsed_json = json.loads(output_text)
    if isinstance(parsed_json, list):
        response = parsed_json
    else:
        raise ValueError("Unexpected response format")
   
    return response