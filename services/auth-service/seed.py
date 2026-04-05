"""
Seed data script for auth service
Creates default users for testing all roles
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base
from models import User
from auth import hash_password

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Create engine and session
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def seed_database():
    """Create tables and seed with default users"""

    # Create all tables
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()

    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Database already seeded. Skipping...")
            return

        # Create default users for each role
        users_data = [
            {
                "username": "ketua",
                "email": "ketua@org.com",
                "password": "password123",
                "role": "Ketua",
                "is_active": True
            },
            {
                "username": "bendahara",
                "email": "bendahara@org.com",
                "password": "password123",
                "role": "Bendahara",
                "is_active": True
            },
            {
                "username": "sekretaris",
                "email": "sekretaris@org.com",
                "password": "password123",
                "role": "Sekretaris",
                "is_active": True
            },
            {
                "username": "anggota",
                "email": "anggota@org.com",
                "password": "password123",
                "role": "Anggota",
                "is_active": True
            },
            {
                "username": "anggota2",
                "email": "anggota2@org.com",
                "password": "password123",
                "role": "Anggota",
                "is_active": True
            }
        ]

        for user_data in users_data:
            user = User(
                username=user_data["username"],
                email=user_data["email"],
                hashed_password=hash_password(user_data["password"]),
                role=user_data["role"],
                is_active=user_data["is_active"]
            )
            db.add(user)
            print(f"✓ Created user: {user_data['username']} ({user_data['role']})")

        db.commit()
        print("\n✓ Database seeding completed!")
        print("\nTest Accounts:")
        print("─" * 50)
        print("Username: ketua        | Password: password123 | Role: Ketua")
        print("Username: bendahara    | Password: password123 | Role: Bendahara")
        print("Username: sekretaris   | Password: password123 | Role: Sekretaris")
        print("Username: anggota      | Password: password123 | Role: Anggota")
        print("Username: anggota2     | Password: password123 | Role: Anggota")
        print("─" * 50)

    except Exception as e:
        db.rollback()
        print(f"✗ Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
