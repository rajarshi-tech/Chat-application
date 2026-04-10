import base64
import hashlib
import hmac
import os
from datetime import datetime, timedelta

from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from sqlalchemy.orm import Session

from . import crud, models
from .database import get_db

SECRET_KEY = "123456789"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
PASSWORD_HASH_NAME = "pbkdf2_sha256"
PASSWORD_ITERATIONS = 100_000
PASSWORD_SALT_BYTES = 16

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str):
    salt = os.urandom(PASSWORD_SALT_BYTES)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        PASSWORD_ITERATIONS,
    )
    encoded_salt = base64.urlsafe_b64encode(salt).decode("utf-8")
    encoded_digest = base64.urlsafe_b64encode(digest).decode("utf-8")
    return f"{PASSWORD_HASH_NAME}${PASSWORD_ITERATIONS}${encoded_salt}${encoded_digest}"

def verify_password(plain, hashed):
    try:
        hash_name, iterations, encoded_salt, encoded_digest = hashed.split("$", 3)
    except ValueError:
        return False

    if hash_name != PASSWORD_HASH_NAME:
        return False

    salt = base64.urlsafe_b64decode(encoded_salt.encode("utf-8"))
    expected_digest = base64.urlsafe_b64decode(encoded_digest.encode("utf-8"))
    computed_digest = hashlib.pbkdf2_hmac(
        "sha256",
        plain.encode("utf-8"),
        salt,
        int(iterations),
    )
    return hmac.compare_digest(computed_digest, expected_digest)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    username = ""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = crud.get_user_by_username(db, username) # type: ignore
    if user is None:
        raise HTTPException(status_code=401, detail="User not found")

    return user
