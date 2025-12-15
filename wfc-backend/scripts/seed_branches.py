#!/usr/bin/env python3
"""
Seed branch data
Creates Branch 1 and Branch 2
"""
import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from sqlalchemy.orm import Session
from app.db.session import SessionLocal
from app.models.branch import Branch
from app.core.constants import BRANCH_1_NAME, BRANCH_2_NAME


def seed_branches():
    """Create initial branches"""
    db: Session = SessionLocal()
    
    try:
        # Check if branches already exist
        existing_count = db.query(Branch).count()
        
        if existing_count > 0:
            print("⚠️  Branches already exist!")
            branches = db.query(Branch).all()
            for branch in branches:
                print(f"  - {branch.branch_name} (ID: {branch.id})")
            return
        
        # Create branches
        branch1 = Branch(branch_name=BRANCH_1_NAME)
        branch2 = Branch(branch_name=BRANCH_2_NAME)
        
        db.add(branch1)
        db.add(branch2)
        db.commit()
        db.refresh(branch1)
        db.refresh(branch2)
        
        print("✅ Branches created successfully!")
        print(f"  - {branch1.branch_name} (ID: {branch1.id})")
        print(f"  - {branch2.branch_name} (ID: {branch2.id})")
        
    except Exception as e:
        print(f"❌ Error creating branches: {str(e)}")
        db.rollback()
    
    finally:
        db.close()


if __name__ == "__main__":
    seed_branches()
