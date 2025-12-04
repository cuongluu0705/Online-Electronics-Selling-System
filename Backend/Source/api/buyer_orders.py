from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database_connection import get_db
from ..schemas.order import PlaceOrderRequest, PlaceOrderResponse, OrderItemOut

router = APIRouter()

def _get_or_create_cart(db: Session, customer_id: int) -> int:
    row = db.execute(text("SELECT CartId FROM Cart WHERE CustomerId=:cid LIMIT 1"), {"cid": customer_id}).mappings().first()
    if row:
        return int(row["CartId"])
    res = db.execute(text("INSERT INTO Cart(CustomerId) VALUES (:cid)"), {"cid": customer_id})
    return int(res.lastrowid)

@router.post("/checkout", response_model=PlaceOrderResponse)
def checkout(
    payload: PlaceOrderRequest,
    db: Session = Depends(get_db),
    x_customer_id: int | None = Header(default=None, alias="X-Customer-Id"),
):
    customer_id = payload.customerId or x_customer_id or 1

    if not payload.items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    try:
        with db.begin():
            cart_id = _get_or_create_cart(db, customer_id)

            items_out: list[OrderItemOut] = []
            subtotal = 0.0

            intended_ship = date.today().toordinal() + 1
            intended_ship = date.fromordinal(intended_ship)

            recipient_contact = f"Phone: {payload.recipientPhone}\nEmail: {payload.customerEmail}\nCustomerPhone: {payload.customerPhone}"
            if payload.note:
                recipient_contact += f"\nNote: {payload.note}"

            res = db.execute(
                text("""
                    INSERT INTO `Order`(CustomerId, CartId, IntendedShipmentDate, RecipientName, RecipientContact, ShipmentAddress, Status)
                    VALUES (:cid, :cartid, :ship, :rname, :rcontact, :addr, 'Pending')
                """),
                {
                    "cid": customer_id,
                    "cartid": cart_id,
                    "ship": intended_ship,
                    "rname": payload.recipientName,
                    "rcontact": recipient_contact,
                    "addr": payload.address,
                }
            )
            order_id = int(res.lastrowid)

            for it in payload.items:
                p = db.execute(
                    text("""
                        SELECT ProductId, ProductName, Price, Quantity, Status
                        FROM Product
                        WHERE ProductId=:pid
                        FOR UPDATE
                    """),
                    {"pid": str(it.productId)},
                ).mappings().first()

                if not p or p["Status"] != "Active":
                    raise HTTPException(status_code=400, detail=f"Product not available: {it.productId}")

                stock = int(p["Quantity"] or 0)
                if stock < it.quantity:
                    raise HTTPException(status_code=400, detail=f"Not enough stock for {p['ProductId']} (remain {stock})")

                unit_price = float(p["Price"] or 0)
                line_total = unit_price * it.quantity
                subtotal += line_total

                db.execute(
                    text("UPDATE Product SET Quantity = Quantity - :q WHERE ProductId=:pid"),
                    {"q": it.quantity, "pid": p["ProductId"]},
                )
                db.execute(
                    text("INSERT INTO OrderContainsProduct(OrderId, ProductId, Quantity) VALUES (:oid, :pid, :q)"),
                    {"oid": order_id, "pid": p["ProductId"], "q": it.quantity},
                )

                items_out.append(
                    OrderItemOut(
                        productId=p["ProductId"],
                        productName=p["ProductName"],
                        unitPrice=unit_price,
                        quantity=it.quantity,
                        lineTotal=line_total,
                    )
                )

            db.execute(text("DELETE FROM CartContainsProduct WHERE CartId=:cartid AND CustomerId=:cid"), {"cartid": cart_id, "cid": customer_id})

        discount = 50.0 if subtotal > 1000 else 0.0
        total = subtotal - discount

        return PlaceOrderResponse(
            id=str(order_id),
            recipientName=payload.recipientName,
            recipientPhone=payload.recipientPhone,
            address=payload.address,
            status="Pending",
            items=items_out,
            subtotal=subtotal,
            discount=discount,
            total=total,
        )

    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Checkout failed: {type(e).__name__}")
