from fastapi import APIRouter
from app.models.request_models import NotesRequest
from app.services.exercise_service import generate_vocab_exercises, generate_vocab_exercises_type1, generate_fillInTheBlanks_exercises

router = APIRouter()

@router.post("/flashcards")
async def generate_flashcards(data: NotesRequest):
    print("executing generate flashcards")
    response = await generate_vocab_exercises_type1(data.notes)
    print(response)
    return response


