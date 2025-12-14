from sqlalchemy.orm import Session
from app.db.base import Base
from app.db.session import engine
from app.models import *  # Import all models
from app.core.constants import BRANCH_1_NAME, BRANCH_2_NAME


def init_db() -> None:
    """Initialize database - create all tables"""
    Base.metadata.create_all(bind=engine)


def seed_branches(db: Session) -> None:
    """Seed initial branch data"""
    from app.models.branch import Branch
    
    # Check if branches already exist
    existing_branches = db.query(Branch).count()
    if existing_branches > 0:
        print("Branches already seeded")
        return
    
    # Create branches
    branch1 = Branch(branch_name=BRANCH_1_NAME)
    branch2 = Branch(branch_name=BRANCH_2_NAME)
    
    db.add(branch1)
    db.add(branch2)
    db.commit()
    
    print(f"✅ Created branches: {BRANCH_1_NAME}, {BRANCH_2_NAME}")
