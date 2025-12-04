from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import text
from pathlib import Path

from ..database_connection import get_db
from ..schemas.product import ProductOut

router = APIRouter()

def get_product_image_url(product_id: str) -> str:

    base_dir = Path(__file__).resolve().parent.parent.parent / "database" / "product_images"
    product_dir = base_dir / product_id

    for ext in [".jpg", ".png", ".jpeg", ".webp"]:
        if (product_dir / f"1{ext}").exists():
            return f"/product_images/{product_id}/1{ext}"
    
    return None 

@router.get("", response_model=list[ProductOut])
def list_products(
    q: str | None = Query(default=None, description="search by id/name/brand"),
    db: Session = Depends(get_db),
):
    sql = """
        SELECT ProductId, ProductName, Brand, Price, Color, Quantity, Specification, WarrantyPeriod, ReleaseDate, Status
        FROM Product
        WHERE Status='Active'
    """
    params = {}
    if q:
        sql += " AND (ProductId LIKE :q OR ProductName LIKE :q OR Brand LIKE :q)"
        params["q"] = f"%{q}%"
    sql += " ORDER BY ReleaseDate DESC, ProductName ASC"

    rows = db.execute(text(sql), params).mappings().all()
    return [
        ProductOut(
            productId=r["ProductId"],
            productName=r["ProductName"],
            brand=r["Brand"],
            price=float(r["Price"]) if r["Price"] is not None else None,
            color=r["Color"],
            quantity=r["Quantity"],
            specification=r["Specification"],
            warrantyPeriod=r["WarrantyPeriod"],
            releaseDate=r["ReleaseDate"],
            status=r["Status"],
            imageBaseUrl=get_product_image_url(r["ProductId"]),
        )
        for r in rows
    ]

@router.get("/{product_id}", response_model=ProductOut)
def get_product(product_id: str, db: Session = Depends(get_db)):
    row = db.execute(
        text("""
            SELECT ProductId, ProductName, Brand, Price, Color, Quantity, Specification, WarrantyPeriod, ReleaseDate, Status
            FROM Product WHERE ProductId=:pid LIMIT 1
        """),
        {"pid": product_id},
    ).mappings().first()
    if not row:
        return ProductOut(productId=product_id, productName="(not found)")

    return ProductOut(
        productId=row["ProductId"],
        productName=row["ProductName"],
        brand=row["Brand"],
        price=float(row["Price"]) if row["Price"] is not None else None,
        color=row["Color"],
        quantity=row["Quantity"],
        specification=row["Specification"],
        warrantyPeriod=row["WarrantyPeriod"],
        releaseDate=row["ReleaseDate"],
        status=row["Status"],
        imageBaseUrl=get_product_image_url(row["ProductId"]),
    )