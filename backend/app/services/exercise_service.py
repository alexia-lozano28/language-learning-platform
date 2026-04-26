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

    # response = await call_openai(prompt)
    # print(response)
    # output_text = response.output[1].content[0].text

    # # Convertimos a dict para que FastAPI lo devuelva como JSON
    # import json
    # vocab_json = json.loads(output_text)
    vocab_json = [
    { "word": "sich waschen", "answer": "to wash oneself" },
    { "word": "sich freuen", "answer": "to be happy / to look forward to" },
    { "word": "Reflexivpronomen", "answer": "reflexive pronoun" },
    { "word": "Subjekt", "answer": "subject" },
    { "word": "Akkusativ", "answer": "accusative" },
    { "word": "Dativ", "answer": "dative" },
    { "word": "sich merken", "answer": "to remember" },
    { "word": "sich ausruhen", "answer": "to rest / to relax" },
    { "word": "sich beeilen", "answer": "to hurry" },
    { "word": "sich befinden", "answer": "to be located" },
    { "word": "Handelnder", "answer": "agent / doer" },
    { "word": "Betroffener", "answer": "affected person" },
    { "word": "Hauptsatz", "answer": "main clause" },
    { "word": "Nebensatz", "answer": "subordinate clause" },
    { "word": "stehen", "answer": "to stand / to be positioned" },
    { "word": "direkt", "answer": "directly" },
    { "word": "nach", "answer": "after" },
    { "word": "Verb", "answer": "verb" },
    { "word": "ich wasche mich", "answer": "I wash myself" },
    { "word": "ich wasche das Auto", "answer": "I wash the car" }
    ]
    
    return vocab_json

async def generate_fillInTheBlanks_exercises(notes: str):
    prompt = f"""
    Generate fill-in-the-blanks exercises from:
    {notes}

    Return JSON only.
    """

    # response = await call_openai(prompt)
    # output_text = response.output[1].content[0].text

    # # Convertimos a dict para que FastAPI lo devuelva como JSON
    # import json
    # vocab_json = json.loads(output_text)
    # print(vocab_json)
    response =[
    {
        "sentence": "Ich ___ mich jeden Morgen.",
        "answer": "wasche"
    },
    {
        "sentence": "Du ___ dich schnell.",
        "answer": "beeilst"
    },
    {
        "sentence": "Er ___ sich auf das Wochenende.",
        "answer": "freut"
    },
    {
        "sentence": "Wir ___ uns nach der Arbeit.",
        "answer": "ausruhen"
    },
    {
        "sentence": "Ihr ___ euch für die Schule.",
        "answer": "beeilt"
    },
    {
        "sentence": "Sie ___ sich in Berlin.",
        "answer": "befinden"
    },
    {
        "sentence": "Ich merke ___ das Wort.",
        "answer": "mir"
    },
    {
        "sentence": "...weil ich ___ freue.",
        "answer": "mich"
    },
    {
        "sentence": "Im Hauptsatz steht das Reflexivpronomen direkt nach dem ___.",
        "answer": "Verb"
    },
    {
        "sentence": "Im Nebensatz steht es direkt nach dem ___.",
        "answer": "Subjekt"
    }
    ]
    return response