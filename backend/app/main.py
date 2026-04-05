from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud
from .database import engine, get_db

# Create tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def default():
    return { "message" : "backend running" }


@app.get("/messages", response_model=list[schemas.MessageResponse])
def read_items(db: Session = Depends(get_db)):
    return crud.get_messages(db)

@app.post("/messages", response_model=schemas.MessageResponse)
def add_item(item: schemas.MessageCreate, db: Session = Depends(get_db)):
    return crud.create_message(db, item)

@app.delete("/messages")
def delete_messages(db: Session = Depends(get_db)):
    crud.delete_message(db)
    return {"message": "All messages deleted"}