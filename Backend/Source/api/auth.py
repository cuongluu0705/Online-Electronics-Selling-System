from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, Field
from typing import Literal, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database_connection import get_db

router = APIRouter()

Role = Literal["buyer", "staff", "admin", "customer"]

class LoginRequest(BaseModel):
    username: str = Field(..., description="Email hoặc Username đăng nhập")
    password: str = Field(..., description="Mật khẩu")
    role: Role = Field(..., description="Vai trò người dùng")

class LoginResponse(BaseModel):
    access_token: str
    role: Role
    userId: int
    username: str
    name: Optional[str] = None

@router.post("/auth/login", response_model=LoginResponse)
async def login(payload: LoginRequest, db: Session = Depends(get_db)):
    expected_passwords = {
        "buyer": "user123",
        "customer": "user123",
        "staff": "staff123",
        "admin": "admin123"
    }

    required_pass = expected_passwords.get(payload.role)

    if payload.password != required_pass:
        raise HTTPException(
            status_code=401, 
            detail=f"Sai mật khẩu demo. Với vai trò {payload.role}, vui lòng dùng: {required_pass}"
        )

    table_name = ""
    if payload.role in ["buyer", "customer"]:
        table_name = "Customer"
    elif payload.role == "staff":
        table_name = "StoreStaff"
    elif payload.role == "admin":
        table_name = "Admin"
    else:
        raise HTTPException(status_code=400, detail="Role không hợp lệ")

    query = text(f"""
        SELECT Id, Username, Name 
        FROM {table_name} 
        WHERE Username = :u OR Email = :u 
        LIMIT 1
    """)
    
    user = db.execute(query, {"u": payload.username}).mappings().first()

    if not user:
        raise HTTPException(status_code=401, detail="Tài khoản (Email/User) không tồn tại trong hệ thống")

    return {
        "access_token": f"token-{user['Id']}-{payload.role}",
        "role": payload.role,
        "userId": user["Id"],
        "username": user["Username"],
        "name": user["Name"]
    }