from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal


class CategoryBase(BaseModel):
    name: str
    type: str  # "income" or "expense"


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None


class CategoryResponse(CategoryBase):
    id: int
    created_by_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TransactionBase(BaseModel):
    category_id: int
    amount: Decimal
    description: Optional[str] = None
    type: str  # "income" or "expense"


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    category_id: Optional[int] = None
    amount: Optional[Decimal] = None
    description: Optional[str] = None
    type: Optional[str] = None


class TransactionResponse(TransactionBase):
    id: int
    created_by_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CashflowResponse(BaseModel):
    balance: Decimal
    total_income: Decimal
    total_expense: Decimal
