"""
Seed data script for letter service
Creates letter counters for auto-numbering
"""
import os
from datetime import datetime
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import LetterCounter, Letter

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    """Create tables and seed with default data"""

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if counters exist
        existing_counters = db.query(LetterCounter).count()
        if existing_counters > 0:
            print("Letter database already seeded. Skipping...")
            return

        # Create letter counters for auto-numbering
        current_year = datetime.now().year

        counter_in = LetterCounter(
            type="in",
            year=current_year,
            counter=0
        )
        counter_out = LetterCounter(
            type="out",
            year=current_year,
            counter=0
        )

        db.add(counter_in)
        db.add(counter_out)
        print(f"✓ Created letter counter: incoming (type=in)")
        print(f"✓ Created letter counter: outgoing (type=out)")

        db.flush()

        # Create sample letters
        sample_letters = [
            {
                "number": "001/SRT/IN/2026",
                "type": "in",
                "title": "Surat Permohonan Kerjasama",
                "sender_name": "PT. XYZ Corporation",
                "recipient_name": "Ketua Organisasi",
                "content": "Kami bermaksud untuk menjalin kerjasama strategis...",
                "created_by_id": 3
            },
            {
                "number": "001/SRT/OUT/2026",
                "type": "out",
                "title": "Surat Balasan Permintaan Data",
                "sender_name": "Ketua Organisasi",
                "recipient_name": "Departemen Pendidikan",
                "content": "Sebagai respons atas permintaan data...",
                "created_by_id": 3
            },
        ]

        for letter_data in sample_letters:
            letter = Letter(**letter_data)
            db.add(letter)
            print(f"✓ Created letter: {letter_data['title']}")

        db.commit()
        print("\n✓ Letter database seeding completed!")
        print(f"\nLetter numbering format: XXX/SRT/[IN|OUT]/YYYY")
        print(f"Current year: {current_year}")

    except Exception as e:
        db.rollback()
        print(f"✗ Error seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
