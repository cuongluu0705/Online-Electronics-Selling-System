from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from pathlib import Path

from Backend.Source.database_connection import get_db
from Backend.Source.schemas.product import ProductOut, ProductCreate, ProductUpdate

router = APIRouter(prefix="/staff/products", tags=["staff-products"])

class ProductStatusPayload(BaseModel):
    status: str

def get_product_image_url(product_id: str) -> str:
    base_dir = Path(__file__).resolve().parent.parent.parent / "database" / "product_images"
    product_dir = base_dir / product_id
    for ext in [".jpg", ".png", ".jpeg", ".webp"]:
        if (product_dir / f"1{ext}").exists():
            return f"/product_images/{product_id}/1{ext}"
    return None

def k_to_col(k: str) -> str:
    mapping = {
        "productName": "ProductName", 
        "warrantyPeriod": "WarrantyPeriod", 
        "releaseDate": "ReleaseDate",
        "specification": "Specification" 
    }
    if k in mapping: return mapping[k]
    return k[0].upper() + k[1:]

@router.get("", response_model=list[ProductOut])
def staff_list_products(
    q: str | None = Query(default=None, description="search"),
    include_deactivated: bool = True,
    db: Session = Depends(get_db),
):
    sql = "SELECT * FROM Product WHERE 1=1"
    params = {}
    if not include_deactivated: sql += " AND Status='Active'"
    if q:
        sql += " AND (ProductId LIKE :q OR ProductName LIKE :q)"
        params["q"] = f"%{q}%"
    sql += " ORDER BY ProductName ASC"

    rows = db.execute(text(sql), params).mappings().all()
    return [
        ProductOut(
            productId=r["ProductId"],
            productName=r["ProductName"],
            brand=r["Brand"],
            price=float(r["Price"] or 0),
            color=r["Color"],
            quantity=r["Quantity"],
            specification=r["Specification"],
            warrantyPeriod=r["WarrantyPeriod"],
            releaseDate=r["ReleaseDate"],
            status=r["Status"],
            imageBaseUrl=get_product_image_url(r["ProductId"]),
        ) for r in rows
    ]

@router.post("", response_model=ProductOut)
def staff_create_product(payload: ProductCreate, db: Session = Depends(get_db)):
    print(f"👉 ADD REQUEST: {payload}") 
    try:
        exists = db.execute(text("SELECT 1 FROM Product WHERE ProductId=:pid"), {"pid": payload.productId}).first()
        if exists: raise HTTPException(status_code=400, detail=f"ID '{payload.productId}' already exists")
        
        db.execute(
            text("""
                INSERT INTO Product(ProductId, ProductName, Brand, Price, Color, Quantity, Specification, WarrantyPeriod, ReleaseDate, Status) 
                VALUES (:pid, :name, :brand, :price, :color, :qty, :spec, :wp, :rd, :st)
            """),
            {
                "pid": payload.productId, 
                "name": payload.productName, 
                "brand": payload.brand, 
                "price": payload.price, 
                "color": payload.color, 
                "qty": payload.quantity, 
                "spec": payload.specification, 
                "wp": payload.warrantyPeriod, 
                "rd": payload.releaseDate, 
                "st": payload.status
            }
        )
        db.commit()
        print("✅ ADD SUCCESS")
    except Exception as e:
        db.rollback()
        print(f"❌ ADD ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return ProductOut(
        productId=payload.productId,
        productName=payload.productName,
        brand=payload.brand,
        price=payload.price,
        color=payload.color,
        quantity=payload.quantity,
        specification=payload.specification,
        warrantyPeriod=payload.warrantyPeriod,
        releaseDate=payload.releaseDate,
        status=payload.status,
        imageBaseUrl=None 
    )

@router.put("/{product_id}", response_model=ProductOut)
def staff_update_product(product_id: str, payload: ProductUpdate, db: Session = Depends(get_db)):
    print(f"👉 UPDATE REQUEST for {product_id}: {payload}") 
   
    fields = payload.model_dump(exclude_none=True)
    
    if not fields:
        print("⚠️ NO FIELDS TO UPDATE")
    else:
        set_clause = ", ".join([f"{k_to_col(k)}=:{k}" for k in fields.keys()])
        params = {**fields, "pid": product_id}
        
        sql = f"UPDATE Product SET {set_clause} WHERE ProductId=:pid"
        print(f"📝 EXECUTING SQL: {sql}") 
        
        try:
            db.execute(text(sql), params)
            db.commit()
            print("✅ UPDATE SUCCESS")
        except Exception as e:
            db.rollback()
            print(f"❌ UPDATE ERROR: {e}")
            raise HTTPException(status_code=500, detail=str(e))

    updated = db.execute(text("SELECT * FROM Product WHERE ProductId=:pid"), {"pid": product_id}).mappings().first()
    if not updated: raise HTTPException(status_code=404, detail="Product not found")
    
    return ProductOut(
        productId=updated["ProductId"],
        productName=updated["ProductName"],
        brand=updated["Brand"],
        price=float(updated["Price"] or 0),
        color=updated["Color"],
        quantity=updated["Quantity"],
        specification=updated["Specification"],
        warrantyPeriod=updated["WarrantyPeriod"],
        releaseDate=updated["ReleaseDate"],
        status=updated["Status"],
        imageBaseUrl=get_product_image_url(updated["ProductId"]),
    )

@router.put("/{product_id}/update_product_status")
def update_product_status(product_id: str, payload: ProductStatusPayload, db: Session = Depends(get_db)):
    print(f"👉 STATUS REQUEST for {product_id}: {payload}")
    raw = (payload.status or "").strip().lower()
    
    if raw == "active": db_status = "Active"
    elif raw in ("inactive", "deactivated"): db_status = "Deactivated"
    else: raise HTTPException(status_code=400, detail="Invalid status")
    
    try:
        res = db.execute(text("UPDATE Product SET Status=:st WHERE ProductId=:pid"), {"st": db_status, "pid": product_id})
        if res.rowcount == 0: raise HTTPException(status_code=404, detail="Not found")
        db.commit()
        print("✅ STATUS UPDATE SUCCESS")
    except Exception as e:
        db.rollback()
        print(f"❌ STATUS ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"success": True, "productId": product_id, "status": db_status}