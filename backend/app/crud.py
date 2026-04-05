from sqlalchemy.orm import Session
from . import models, schemas

def get_messages(db: Session):
    return db.query(models.Item).all()

def create_message(db: Session, message: schemas.MessageCreate):
    db_message = models.Item(**message.model_dump())
    db.add(db_message)
    db.commit()
    db.refresh(db_message)
    return db_message
def delete_message(db: Session):
    db.query(models.Item).delete()
    db.commit()