from pydantic import BaseModel, Field
from typing import Literal
from datetime import date

Status = Literal["Active", "Deactivated"]

class ProductOut(BaseModel):
    productId: str
    productName: str
    brand: str | None = None
    price: float | None = None
    color: str | None = None
    quantity: int | None = None
    specification: str | None = None
    warrantyPeriod: int | None = None
    releaseDate: date | None = None
    status: Status | None = None
    imageBaseUrl: str | None = None  

class ProductCreate(BaseModel):
    productId: str = Field(min_length=1, max_length=20)
    productName: str = Field(min_length=1, max_length=150)
    brand: str | None = None
    price: float | None = None
    color: str | None = None
    quantity: int | None = None
    specification: str | None = None
    warrantyPeriod: int | None = None
    releaseDate: date | None = None
    status: Status = "Active"

class ProductUpdate(BaseModel):
    productName: str | None = None
    brand: str | None = None
    price: float | None = None
    color: str | None = None
    quantity: int | None = None
    specification: str | None = None
    warrantyPeriod: int | None = None
    releaseDate: date | None = None
    status: Status | None = None
