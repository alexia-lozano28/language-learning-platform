from fastapi import APIRouter
from app.models.request_models import NotesRequest
from app.services.exercise_service import generate_fillInTheBlanks_exercises

router = APIRouter()

@router.post("/generate-fill-in-the-blanks")
async def generate_fillInTheBlanks(data: NotesRequest):
    print("executing generate fill in the blanks")
    response = await generate_fillInTheBlanks_exercises(data.notes)
    print(response)
    return response