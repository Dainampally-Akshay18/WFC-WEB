#!/usr/bin/env python3
"""
Populate database with test data
WARNING: Use only in development!
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.user import User
from app.models.branch import Branch
from app.models.sermon_category import SermonCategory
from app.core.security import get_password_hash
from app.core.constants import UserStatus, DEFAULT_SERMON_CATEGORIES


def populate_test_data():
    """Create test data for development"""
    db: Session = SessionLocal()
    
    try:
        print("\n=== Populating Test Data ===\n")
        
        # Get branches
        branches = db.query(Branch).all()
        if len(branches) < 2:
            print("❌ Please run seed_branches.py first")
            return
        
        branch1, branch2 = branches[0], branches[1]
        
        # Create test users
        test_users = [
            {
                "email": "john.branch1@test.com",
                "full_name": "John Doe",
                "branch_id": branch1.id,
                "status": UserStatus.APPROVED
            },
            {
                "email": "jane.branch1@test.com",
                "full_name": "Jane Smith",
                "branch_id": branch1.id,
                "status": UserStatus.APPROVED
            },
            {
                "email": "bob.branch2@test.com",
                "full_name": "Bob Wilson",
                "branch_id": branch2.id,
                "status": UserStatus.APPROVED
            },
            {
                "email": "alice.branch2@test.com",
                "full_name": "Alice Brown",
                "branch_id": branch2.id,
                "status": UserStatus.PENDING
            }
        ]
        
        created_users = 0
        for user_data in test_users:
            # Check if user exists
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if existing:
                print(f"⏭️  User {user_data['email']} already exists")
                continue
            
            user = User(
                email=user_data["email"],
                full_name=user_data["full_name"],
                password_hash=get_password_hash("Password123!"),
                branch_id=user_data["branch_id"],
                status=user_data["status"]
            )
            
            db.add(user)
            created_users += 1
        
        db.commit()
        print(f"✅ Created {created_users} test users")
        
        # Create sermon categories
        created_categories = 0
        for category_name in DEFAULT_SERMON_CATEGORIES:
            existing = db.query(SermonCategory).filter(
                SermonCategory.name == category_name
            ).first()
            
            if existing:
                continue
            
            category = SermonCategory(
                name=category_name,
                description=f"Sermons related to {category_name}"
            )
            
            db.add(category)
            created_categories += 1
        
        db.commit()
        print(f"✅ Created {created_categories} sermon categories")
        
        print("\n=== Test Data Summary ===")
        print(f"Total Users: {db.query(User).count()}")
        print(f"Total Categories: {db.query(SermonCategory).count()}")
        print("\n💡 Test user password: Password123!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        db.rollback()
    
    finally:
        db.close()


if __name__ == "__main__":
    populate_test_data()
