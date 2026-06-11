from fastapi import APIRouter
from app.models.request_models import NotesRequest
from app.services.exercise_service import generate_vocab_exercises, generate_fillInTheBlanks_exercises

router = APIRouter()

@router.post("/flashcards")
async def generate_flashcards(data: NotesRequest):
    print("executing generate flashcards")
    print("Image received:", data.image is not None)
    if data.image:
        print("Image length:", len(data.image))
    # response = await generate_vocab_exercises_type1(data.notes) this is from the forced version of responses
    response = await generate_vocab_exercises(data.notes, data.image)
    print("the answer",response)
    return response

