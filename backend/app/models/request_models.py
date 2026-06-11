from pydantic import BaseModel
from typing import Optional

class NotesRequest(BaseModel):
    notes: str
    image: Optional[str] = None