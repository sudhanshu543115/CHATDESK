from fastapi import FastAPI

from app.config.db import engine, Base
from app.models.user_model import User

app = FastAPI()

Base.metadata.create_all(bind=engine)

@app.get("/")
async def root():
    return {"message": "Backend Running"}