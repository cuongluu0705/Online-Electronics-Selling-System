# File này chứa các method liên quan đến handle Database Connection

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi import Depends

# Thay đoạn trong DatabaseURL: 12345 bằng password của MySQL của máy local, tên database sẽ là oss_demo
DATABASE_URL = "mysql+pymysql://root:123456@localhost:3306/oss_demo"

engine = create_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_recycle=1800,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()