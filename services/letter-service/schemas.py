from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class LetterBase(BaseModel):
    type: str  # "in" or "out"
    title: str
    content: Optional[str] = None
    sender_name: Optional[str] = None
    recipient_name: Optional[str] = None
    file_path: Optional[str] = None


class LetterCreate(LetterBase):
    pass


class LetterUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    content: Optional[str] = None
    sender_name: Optional[str] = None
    recipient_name: Optional[str] = None
    file_path: Optional[str] = None
    signature_path: Optional[str] = None


class LetterResponse(LetterBase):
    id: int
    number: str
    signature_path: Optional[str] = None
    created_by_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class LetterNumberResponse(BaseModel):
    number: str
    type: str
