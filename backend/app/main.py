from fastapi import FastAPI
from app.api.routes import vocab
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()
# Permitir requests desde React (localhost:3000)
origins = [
    "http://localhost:3000",
    # puedes añadir otros dominios si es necesario
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # quién puede hacer requests
    allow_credentials=True,
    allow_methods=["*"],            # GET, POST, OPTIONS, etc
    allow_headers=["*"],            # headers permitidos
)

app.include_router(vocab.router, prefix="/api")

