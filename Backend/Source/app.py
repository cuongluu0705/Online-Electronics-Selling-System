from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .api.auth import router as auth_router
from .api.buyer_products import router as buyer_products_router
from .api.buyer_orders import router as buyer_orders_router
from .api.staff_products import router as staff_products_router

app = FastAPI()

origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],  
    allow_headers=["*"],  
    allow_credentials=True,
)

# Static product images:
# Backend/database/product_images/<ProductId>/*
BASE_DIR = Path(__file__).resolve().parent  # .../Backend/Source
images_dir = (BASE_DIR.parent / "database" / "product_images").resolve()

images_dir.mkdir(parents=True, exist_ok=True) 

if images_dir.exists():
    app.mount("/product_images", StaticFiles(directory=str(images_dir)), name="product_images")

@app.get("/health")
def health():
    return {"status": "ok"}

# api
app.include_router(auth_router)

app.include_router(buyer_products_router, prefix="/buyer/products", tags=["buyer-products"])

app.include_router(buyer_orders_router, prefix="/buyer/orders", tags=["buyer-orders"])

app.include_router(staff_products_router)