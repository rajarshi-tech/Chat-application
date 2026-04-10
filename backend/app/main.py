from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import models, schemas, crud, auth
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

@app.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="User exists")

    return crud.create_user(db, user.username, user.password)


@app.post("/login")
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
    return crud.create_message(db, item, current_user.id)

@app.delete("/messages")
def delete_messages(db: Session = Depends(get_db)):
    crud.delete_messages(db)
    return {"message": "All messages deleted"}