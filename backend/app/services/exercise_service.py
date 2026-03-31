from app.services.openai_service import call_openai

async def generate_vocab_exercises(notes: str):
    prompt = f"""
    Generate vocabulary exercises from:
    {notes}

    Return JSON only.
    """

    response = await call_openai(prompt)
    output_text = response.output[1].content[0].text

    # Convertimos a dict para que FastAPI lo devuelva como JSON
    import json
    vocab_json = json.loads(output_text)
    print(vocab_json)
    return response

async def generate_vocab_exercises_type1(notes: str):
    prompt = f"""
    Generate vocabulary exercises from the following notes:
    {notes}
    where you take single words from these notes randomly and up to 20 words, and return it in a JSON format where one key is the original value
    and the other key is called anwser where you can find its translation, so I can create an exercise where the input of the student will be compared with the transaltion (answer)
    Return JSON only.
    """

    response = await call_openai(prompt)
    print(response)
    output_text = response.output[1].content[0].text

    # Convertimos a dict para que FastAPI lo devuelva como JSON
    import json
    vocab_json = json.loads(output_text)
    return vocab_json

async def generate_vocab_exercises_type2(notes: str):
    prompt = f"""
    Generate vocabulary exercises from:
    {notes}

    Return JSON only.
    """

    response = await call_openai(prompt)
    output_text = response.output[1].content[0].text

    # Convertimos a dict para que FastAPI lo devuelva como JSON
    import json
    vocab_json = json.loads(output_text)
    print(vocab_json)
    return response