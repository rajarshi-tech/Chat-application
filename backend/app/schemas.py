from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class MessageCreate(BaseModel):
    username: str
    text: str

class MessageResponse(MessageCreate):
    id: int

    class Config:
        from_attributes = True