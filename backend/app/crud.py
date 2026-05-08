from sqlalchemy.orm import Session
from . import models, schemas
from .auth import hash_password

def create_user(db: Session, username: str, password: str):
    hashed = hash_password(password)
    user = models.User(username=username, hashed_password=hashed)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()


def get_messages(db: Session):
    return db.query(models.Message).all()

def create_message(db: Session, message: schemas.MessageCreate, owner_id: int, username: str):
    db_message = models.Message(text=message.text, username=username, owner_id=owner_id)
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
def delete_messages(db: Session):
    db.query(models.Message).delete()
    db.commit()
