from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import func
from decimal import Decimal
from dotenv import load_dotenv
import os

from database import engine, get_db, Base
from models import Category, Transaction
from schemas import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
    TransactionCreate,
    TransactionUpdate,
    TransactionResponse,
    CashflowResponse,
)
from auth_client import verify_token

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Finance Service", version="1.0.0")

# CORS
allowed_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Helper to get current user from token
async def get_current_user(token: str = None):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authorization token",
        )
    
    user = await verify_token(token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )
    
    return user


def check_bendahara_role(user: dict):
    if user.get("role") != "Bendahara":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Bendahara can perform this action",
        )


# ==================== HEALTH CHECK ====================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "finance-service"}


# ==================== CATEGORIES ====================

@app.get("/categories", response_model=list[CategoryResponse])
async def get_categories(token: str = None, db: Session = Depends(get_db)):
    user = await get_current_user(token)
    
    categories = db.query(Category).all()
    return [CategoryResponse.from_orm(cat) for cat in categories]


@app.post("/categories", response_model=CategoryResponse)
async def create_category(
    category_data: CategoryCreate,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_bendahara_role(user)
    
    new_category = Category(
        name=category_data.name,
        type=category_data.type,
        created_by_id=user.get("id"),
    )
    db.add(new_category)
    db.commit()
    db.refresh(new_category)
    
    return CategoryResponse.from_orm(new_category)


@app.put("/categories/{category_id}", response_model=CategoryResponse)
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_bendahara_role(user)
    
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    update_dict = category_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    
    return CategoryResponse.from_orm(category)


@app.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_bendahara_role(user)
    
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    db.delete(category)
    db.commit()
    
    return {"message": "Category deleted successfully"}


# ==================== TRANSACTIONS ====================

@app.get("/transactions", response_model=list[TransactionResponse])
async def get_transactions(token: str = None, db: Session = Depends(get_db)):
    user = await get_current_user(token)
    
    transactions = db.query(Transaction).all()
    return [TransactionResponse.from_orm(t) for t in transactions]


@app.get("/transactions/{transaction_id}", response_model=TransactionResponse)
async def get_transaction(
    transaction_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    
    return TransactionResponse.from_orm(transaction)


@app.post("/transactions", response_model=TransactionResponse)
async def create_transaction(
    transaction_data: TransactionCreate,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_bendahara_role(user)
    
    # Verify category exists
    category = db.query(Category).filter(Category.id == transaction_data.category_id).first()
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )
    
    new_transaction = Transaction(
        category_id=transaction_data.category_id,
        amount=transaction_data.amount,
        description=transaction_data.description,
        type=transaction_data.type,
        created_by_id=user.get("id"),
    )
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    
    return TransactionResponse.from_orm(new_transaction)


@app.put("/transactions/{transaction_id}", response_model=TransactionResponse)
async def update_transaction(
    transaction_id: int,
    transaction_data: TransactionUpdate,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_bendahara_role(user)
    
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    
    update_dict = transaction_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(transaction, field, value)
    
    db.commit()
    db.refresh(transaction)
    
    return TransactionResponse.from_orm(transaction)


@app.delete("/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_bendahara_role(user)
    
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found",
        )
    
    db.delete(transaction)
    db.commit()
    
    return {"message": "Transaction deleted successfully"}


# ==================== CASHFLOW ====================

@app.get("/cashflow", response_model=CashflowResponse)
async def get_cashflow(token: str = None, db: Session = Depends(get_db)):
    user = await get_current_user(token)
    
    total_income = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == "income"
    ).scalar() or Decimal(0)
    
    total_expense = db.query(func.sum(Transaction.amount)).filter(
        Transaction.type == "expense"
    ).scalar() or Decimal(0)
    
    balance = total_income - total_expense
    
    return CashflowResponse(
        balance=balance,
        total_income=total_income,
        total_expense=total_expense,
    )
