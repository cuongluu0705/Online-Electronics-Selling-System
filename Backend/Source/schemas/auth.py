from pydantic import BaseModel, Field
from typing import Literal

Role = Literal["customer", "staff", "admin"]

class LoginRequest(BaseModel):
    role: Role
    username: str = Field(min_length=1)
    password: str = Field(min_length=1)

class LoginResponse(BaseModel):
    role: Role
    id: int
    username: str
    name: str | None = None
