from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Literal, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text
import bcrypt  

from ..database_connection import get_db

router = APIRouter()

Role = Literal["buyer", "staff", "admin", "customer"]

class LoginRequest(BaseModel):
    username: str = Field(..., description="Email or Username")
    password: str = Field(..., description="Password")
    role: Role = Field(..., description="User Role")

class RegisterRequest(BaseModel):
    name: str
    email: str
    phone: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    role: Role
    userId: int
    username: str
    name: Optional[str] = None

def verify_password(plain_password: str, hashed_password: str) -> bool:

    password_bytes = plain_password.encode('utf-8')
    hash_bytes = hashed_password.encode('utf-8')

    try:
        return bcrypt.checkpw(password_bytes, hash_bytes)
    except Exception as e:
        print(f"Bcrypt Check Error: {e}")

        return plain_password == hashed_password

def clean_hash(hash_str: str) -> str:
    if not hash_str:
        return ""
    return hash_str.strip() 

@router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    table_name = ""
    if payload.role == "buyer" or payload.role == "customer":
        table_name = "Customer"
    elif payload.role == "staff":
        table_name = "StoreStaff"
    elif payload.role == "admin":
        table_name = "Admin"
    else:
        raise HTTPException(status_code=400, detail="Invalid role specified")

    query = text(f"SELECT Id, Username, Password, Name, Email FROM {table_name} WHERE Username = :u OR Email = :u LIMIT 1")
    
    try:
        user = db.execute(query, {"u": payload.username}).mappings().first()
    except Exception as e:
        print(f"DB Error: {e}")
        raise HTTPException(status_code=500, detail="Database query error")

    if not user:
        raise HTTPException(status_code=401, detail="Account not found")

    db_password = clean_hash(user["Password"])
  
    print(f"DEBUG: Checking role {payload.role} in table {table_name}")

    if not verify_password(payload.password, db_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password.")

    return {
        "access_token": f"token-{user['Id']}-{payload.role}",
        "role": payload.role,
        "userId": user["Id"],
        "username": user["Username"],
        "name": user["Name"]
    }

@router.post("/auth/register")
async def register(payload: RegisterRequest, db: Session = Depends(get_db)):
    exists = db.execute(
        text("SELECT 1 FROM Customer WHERE Email = :e OR Username = :u"), 
        {"e": payload.email, "u": payload.email}
    ).first()
    
    if exists:
        raise HTTPException(status_code=400, detail="Email already exists!")

    hashed_bytes = bcrypt.hashpw(payload.password.encode('utf-8'), bcrypt.gensalt())
    hashed_password = hashed_bytes.decode('utf-8')

    try:
        db.execute(
            text("""
                INSERT INTO Customer(Username, Password, Name, Email, PhoneNumber) 
                VALUES (:u, :p, :n, :e, :ph)
            """),
            {
                "u": payload.email, 
                "p": hashed_password,
                "n": payload.name,
                "e": payload.email,
                "ph": payload.phone
            }
        )
        db.commit()
    except Exception as e:
        db.rollback()
        print(f"Register Error: {e}")
        raise HTTPException(status_code=500, detail="Failed to create account")

    return {"message": "Registration successful"}