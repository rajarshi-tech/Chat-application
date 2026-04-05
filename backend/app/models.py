from sqlalchemy import Column, Integer, String
from .database import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    text = Column(String(500), nullable=False)