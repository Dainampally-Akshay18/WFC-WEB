#!/usr/bin/env python3
"""
Seed initial admin account
Run this once to create the first pastor/admin account
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.admin import Admin
from app.core.security import get_password_hash


def seed_admin():
    """Create initial admin account"""
    db: Session = SessionLocal()
    
    try:
        # Check if admin already exists
        existing_admin = db.query(Admin).first()
        
        if existing_admin:
            print("⚠️  Admin account already exists!")
            print(f"Email: {existing_admin.email}")
            return
        
        # Get admin details from user
        print("\n=== Create First Admin Account ===\n")
        
        email = input("Admin Email: ").strip()
        display_name = input("Display Name: ").strip()
        password = input("Password (min 8 chars): ").strip()
        
        if len(password) < 8:
            print("❌ Password must be at least 8 characters")
            return
        
        # Create admin
        admin = Admin(
            email=email,
            display_name=display_name,
            password_hash=get_password_hash(password),
            is_active=True
        )
        
        db.add(admin)
        db.commit()
        db.refresh(admin)
        
        print(f"\n✅ Admin account created successfully!")
        print(f"Email: {admin.email}")
        print(f"Name: {admin.display_name}")
        print(f"ID: {admin.id}")
        
    except Exception as e:
        print(f"❌ Error creating admin: {str(e)}")
        db.rollback()
    
    finally:
        db.close()


if __name__ == "__main__":
    seed_admin()
