import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import inspect, text
from sqlalchemy.orm import Session

from . import models, schemas, crud, auth
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)


def ensure_message_schema():
    columns = {
        column["name"]
        for column in inspect(engine).get_columns(models.Message.__tablename__)
    }

    if "owner_id" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE messages ADD COLUMN owner_id INTEGER"))


ensure_message_schema()

app = FastAPI()

DEPLOYED_FRONTEND_URL = "https://chat-application-c5en.vercel.app"
LOCAL_FRONTEND_URLS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
]


def get_allowed_origins():
    configured_origins = os.getenv("CORS_ORIGINS") or os.getenv("FRONTEND_URL")

    if configured_origins:
        return [
            origin.strip().rstrip("/")
            for origin in configured_origins.split(",")
            if origin.strip()
        ]

    return [DEPLOYED_FRONTEND_URL, *LOCAL_FRONTEND_URLS]


app.add_middleware(
    CORSMiddleware,
    allow_origins=get_allowed_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def default():
    return { "message" : "backend running" }

@app.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="User exists")

    return crud.create_user(db, user.username, user.password)


@app.post("/login", response_model=schemas.Token)
def login(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, user.username)

    if not db_user or not auth.verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": db_user.username})
    return {"access_token": token, "token_type": "bearer"}



@app.get("/messages", response_model=list[schemas.MessageResponse])
def read_items(db: Session = Depends(get_db)):
    return crud.get_messages(db)

@app.post("/messages", response_model=schemas.MessageResponse)
def add_item(item: schemas.MessageCreate, db: Session = Depends(get_db), current_user = Depends(auth.get_current_user)):
    return crud.create_message(db, item, current_user.id, current_user.username)

@app.delete("/messages")
def delete_messages(db: Session = Depends(get_db)):
    crud.delete_messages(db)
    return {"message": "All messages deleted"}
