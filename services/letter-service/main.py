from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime
from dotenv import load_dotenv
import os

from database import engine, get_db, Base
from models import Letter, LetterCounter
from schemas import (
    LetterCreate,
    LetterUpdate,
    LetterResponse,
    LetterNumberResponse,
)
from auth_client import verify_token

load_dotenv()

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Letter Service", version="1.0.0")

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


def check_sekretaris_role(user: dict):
    if user.get("role") != "Sekretaris":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only Sekretaris can perform this action",
        )


# ==================== HELPER FUNCTIONS ====================

def generate_letter_number(letter_type: str, db: Session) -> str:
    """
    Generate letter number format: 001/SRT/IN/2024
    letter_type: "in" or "out"
    """
    current_year = datetime.now().year
    
    # Get or create counter
    counter = db.query(LetterCounter).filter(
        LetterCounter.type == letter_type,
        LetterCounter.year == current_year,
    ).first()
    
    if not counter:
        counter = LetterCounter(type=letter_type, year=current_year, counter=0)
        db.add(counter)
    
    counter.counter += 1
    db.commit()
    
    # Format: 001/SRT/IN/2024 or 001/SRT/OUT/2024
    type_code = "IN" if letter_type == "in" else "OUT"
    number = f"{counter.counter:03d}/SRT/{type_code}/{current_year}"
    
    return number


# ==================== HEALTH CHECK ====================

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "letter-service"}


# ==================== LETTERS ====================

@app.get("/letters", response_model=list[LetterResponse])
async def get_letters(token: str = None, db: Session = Depends(get_db)):
    user = await get_current_user(token)
    
    letters = db.query(Letter).all()
    return [LetterResponse.from_orm(letter) for letter in letters]


@app.get("/letters/{letter_id}", response_model=LetterResponse)
async def get_letter(
    letter_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    
    letter = db.query(Letter).filter(Letter.id == letter_id).first()
    if not letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Letter not found",
        )
    
    return LetterResponse.from_orm(letter)


@app.post("/letters", response_model=LetterResponse)
async def create_letter(
    letter_data: LetterCreate,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_sekretaris_role(user)
    
    # Generate letter number
    letter_number = generate_letter_number(letter_data.type, db)
    
    new_letter = Letter(
        number=letter_number,
        type=letter_data.type,
        title=letter_data.title,
        content=letter_data.content,
        sender_name=letter_data.sender_name,
        recipient_name=letter_data.recipient_name,
        file_path=letter_data.file_path,
        created_by_id=user.get("id"),
    )
    db.add(new_letter)
    db.commit()
    db.refresh(new_letter)
    
    return LetterResponse.from_orm(new_letter)


@app.put("/letters/{letter_id}", response_model=LetterResponse)
async def update_letter(
    letter_id: int,
    letter_data: LetterUpdate,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_sekretaris_role(user)
    
    letter = db.query(Letter).filter(Letter.id == letter_id).first()
    if not letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Letter not found",
        )
    
    update_dict = letter_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(letter, field, value)
    
    db.commit()
    db.refresh(letter)
    
    return LetterResponse.from_orm(letter)


@app.delete("/letters/{letter_id}")
async def delete_letter(
    letter_id: int,
    token: str = None,
    db: Session = Depends(get_db),
):
    user = await get_current_user(token)
    check_sekretaris_role(user)
    
    letter = db.query(Letter).filter(Letter.id == letter_id).first()
    if not letter:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Letter not found",
        )
    
    db.delete(letter)
    db.commit()
    
    return {"message": "Letter deleted successfully"}


# ==================== LETTER NUMBERING ====================

@app.get("/letters/next-number", response_model=LetterNumberResponse)
async def get_next_number(
    type: str = "in",
    token: str = None,
    db: Session = Depends(get_db),
):
    """
    Preview the next letter number without creating it
    type: "in" or "out"
    """
    user = await get_current_user(token)
    
    current_year = datetime.now().year
    
    counter = db.query(LetterCounter).filter(
        LetterCounter.type == type,
        LetterCounter.year == current_year,
    ).first()
    
    next_counter = (counter.counter + 1 if counter else 1)
    type_code = "IN" if type == "in" else "OUT"
    number = f"{next_counter:03d}/SRT/{type_code}/{current_year}"
    
    return LetterNumberResponse(number=number, type=type)
