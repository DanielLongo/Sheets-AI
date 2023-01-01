from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import train

app = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
    "https://localhost:3000",
    "http://localhost:8080",
    "http://sheets-ai-flame.vercel.app/",
    "https://sheets-ai-flame.vercel.app/",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(train.router, prefix="/train")

