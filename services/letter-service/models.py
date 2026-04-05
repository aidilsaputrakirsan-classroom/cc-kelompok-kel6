from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.sql import func
from database import Base


class Letter(Base):
    __tablename__ = "letters"

    id = Column(Integer, primary_key=True, index=True)
    number = Column(String(255), unique=True, nullable=False)
    type = Column(String(50), nullable=False)  # "in" or "out"
    title = Column(String(255), nullable=False)
    content = Column(Text)
    sender_name = Column(String(255))
    recipient_name = Column(String(255))
    file_path = Column(String(255))
    signature_path = Column(String(255))
    created_by_id = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class LetterCounter(Base):
    __tablename__ = "letter_counters"

    type = Column(String(50), primary_key=True)  # "in" or "out"
    year = Column(Integer, nullable=False)
    counter = Column(Integer, default=0)
