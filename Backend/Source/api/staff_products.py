from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import text
from pathlib import Path
import shutil
from typing import Optional

from Backend.Source.database_connection import get_db
from Backend.Source.schemas.product import ProductOut, ProductCreate, ProductUpdate

router = APIRouter(prefix="/staff/products", tags=["staff-products"])

BASE_DIR = Path(__file__).resolve().parent.parent.parent
IMAGE_DIR = BASE_DIR / "database" / "product_images"
IMAGE_DIR.mkdir(parents=True, exist_ok=True)

class ProductStatusPayload(BaseModel):
    status: str

def get_product_image_url(product_id: str) -> Optional[str]:
 
    product_sub_folder = IMAGE_DIR / product_id
    if product_sub_folder.exists() and product_sub_folder.is_dir():
        for ext in [".jpg", ".png", ".jpeg", ".webp"]:
            if (product_sub_folder / f"1{ext}").exists():
                return f"/product_images/{product_id}/1{ext}"
            if (product_sub_folder / f"{product_id}{ext}").exists():
                return f"/product_images/{product_id}/{product_id}{ext}"

    for ext in [".jpg", ".png", ".jpeg", ".webp"]:
        file_name = f"{product_id}{ext}"
        if (IMAGE_DIR / file_name).exists():
             return f"/product_images/{file_name}"
             
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

@router.post("")
def staff_create_product(
    productId: str = Form(...),
    productName: str = Form(...),
    brand: str = Form(...),
    price: float = Form(...),
    quantity: int = Form(...),
    specification: str = Form(None),
    status: str = Form("Active"),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    print(f"👉 ADD REQUEST: {productId} - {productName}") 
    try:
        exists = db.execute(text("SELECT 1 FROM Product WHERE ProductId=:pid"), {"pid": productId}).first()
        if exists: raise HTTPException(status_code=400, detail=f"ID '{productId}' already exists")
  
        if image:
            product_folder = IMAGE_DIR / productId
            product_folder.mkdir(parents=True, exist_ok=True)

            file_ext = image.filename.split(".")[-1]

            file_path = product_folder / f"1.{file_ext}"
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)

        db.execute(
            text("""
                INSERT INTO Product(ProductId, ProductName, Brand, Price, Color, Quantity, Specification, WarrantyPeriod, ReleaseDate, Status) 
                VALUES (:pid, :name, :brand, :price, 'Black', :qty, :spec, 12, CURDATE(), :st)
            """),
            {
                "pid": productId, 
                "name": productName, 
                "brand": brand, 
                "price": price, 
                "qty": quantity, 
                "spec": specification, 
                "st": status
            }
        )
        db.commit()
        print("✅ ADD SUCCESS")
    except Exception as e:
        db.rollback()
        print(f"❌ ADD ERROR: {e}")
        raise HTTPException(status_code=500, detail=str(e))

    return {"message": "Success"}

@router.put("/{product_id}", response_model=ProductOut)
def staff_update_product(
    product_id: str,
    productName: Optional[str] = Form(None),
    brand: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    quantity: Optional[int] = Form(None),
    specification: Optional[str] = Form(None),
    status: Optional[str] = Form(None),
    image: UploadFile = File(None), 
    db: Session = Depends(get_db)
):
    print(f"👉 UPDATE REQUEST for {product_id}")

    update_data = {
        "ProductName": productName,
        "Brand": brand,
        "Price": price,
        "Quantity": quantity,
        "Specification": specification,
        "Status": status
    }
    update_fields = {k: v for k, v in update_data.items() if v is not None}

    if update_fields:
        set_clause = ", ".join([f"{k}=:{k}" for k in update_fields.keys()])
        params = {**update_fields, "pid": product_id}
        sql = f"UPDATE Product SET {set_clause} WHERE ProductId=:pid"
        
        try:
            db.execute(text(sql), params)
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=str(e))

    if image:
        try:

            product_folder = IMAGE_DIR / product_id
            product_folder.mkdir(parents=True, exist_ok=True)

            for existing_file in product_folder.glob("1.*"):
                existing_file.unlink()

            file_ext = image.filename.split(".")[-1]
            file_path = product_folder / f"1.{file_ext}"
            
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
                
            print(f"✅ IMAGE UPDATED for {product_id}")
        except Exception as e:
            print(f"❌ IMAGE UPDATE ERROR: {e}")

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
    raw = (payload.status or "").strip().lower()
    if raw == "active": db_status = "Active"
    elif raw in ("inactive", "deactivated"): db_status = "Deactivated"
    else: raise HTTPException(status_code=400, detail="Invalid status")
    
    try:
        res = db.execute(text("UPDATE Product SET Status=:st WHERE ProductId=:pid"), {"st": db_status, "pid": product_id})
        if res.rowcount == 0: raise HTTPException(status_code=404, detail="Not found")
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    return {"success": True, "productId": product_id, "status": db_status}