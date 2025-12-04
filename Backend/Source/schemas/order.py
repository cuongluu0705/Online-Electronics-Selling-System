from pydantic import BaseModel, Field
from typing import List

class OrderItemIn(BaseModel):
    productId: str 
    quantity: int = Field(ge=1)

class PlaceOrderRequest(BaseModel):
    customerName: str
    customerEmail: str
    customerPhone: str
    recipientName: str
    recipientPhone: str
    address: str
    note: str | None = None
    items: List[OrderItemIn]

    customerId: int | None = None

class OrderItemOut(BaseModel):
    productId: str
    productName: str
    unitPrice: float
    quantity: int
    lineTotal: float

class PlaceOrderResponse(BaseModel):
    id: str
    recipientName: str
    recipientPhone: str
    address: str
    status: str
    items: List[OrderItemOut]
    subtotal: float
    discount: float
    total: float
