from pydantic import BaseModel

class MessageCreate(BaseModel):
    username: str
    text: str

class MessageResponse(MessageCreate):
    id: int

    class Config:
        from_attributes = True