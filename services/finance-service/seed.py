"""
Seed data script for finance service
Creates default categories and transactions
"""
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import Category, Transaction

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    """Create tables and seed with default data"""

    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if data exists
        existing_cats = db.query(Category).count()
        if existing_cats > 0:
            print("Finance database already seeded. Skipping...")
            return

        # Create categories
        categories_data = [
            # Income
            {"name": "Membership Fees", "type": "income", "created_by_id": 1},
            {"name": "Donations", "type": "income", "created_by_id": 1},
            {"name": "Event Revenue", "type": "income", "created_by_id": 1},
            {"name": "Investment Returns", "type": "income", "created_by_id": 1},

            # Expenses
            {"name": "Operational", "type": "expense", "created_by_id": 1},
            {"name": "Supplies", "type": "expense", "created_by_id": 1},
            {"name": "Utilities", "type": "expense", "created_by_id": 1},
            {"name": "Event Expenses", "type": "expense", "created_by_id": 1},
            {"name": "Staff Salaries", "type": "expense", "created_by_id": 1},
            {"name": "Marketing", "type": "expense", "created_by_id": 1},
        ]

        categories = []
        for cat_data in categories_data:
            cat = Category(**cat_data)
            db.add(cat)
            categories.append(cat)
            print(f"✓ Created category: {cat_data['name']}")

        db.flush()

        # Create sample transactions
        transactions_data = [
            {"category_id": 1, "amount": 5000.00, "type": "income", "description": "January membership fees", "created_by_id": 2},
            {"category_id": 2, "amount": 1000.00, "type": "income", "description": "Donation from member", "created_by_id": 2},
            {"category_id": 3, "amount": 2500.00, "type": "income", "description": "Workshop event revenue", "created_by_id": 2},

            {"category_id": 5, "amount": 500.00, "type": "expense", "description": "Office rent", "created_by_id": 2},
            {"category_id": 6, "amount": 200.00, "type": "expense", "description": "Printer cartridges and paper", "created_by_id": 2},
            {"category_id": 7, "amount": 150.00, "type": "expense", "description": "Internet and phone bills", "created_by_id": 2},
            {"category_id": 8, "amount": 800.00, "type": "expense", "description": "Workshop materials", "created_by_id": 2},
        ]

        for trans_data in transactions_data:
            trans = Transaction(**trans_data)
            db.add(trans)
            print(f"✓ Created transaction: {trans_data['description']} ({trans_data['amount']})")

        db.commit()
        print("\n✓ Finance database seeding completed!")

    except Exception as e:
        db.rollback()
        print(f"✗ Error seeding: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
