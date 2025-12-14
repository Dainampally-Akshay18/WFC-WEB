from sqlalchemy import Column, String
from sqlalchemy.orm import relationship
from app.db.base import BaseModel


class Branch(BaseModel):
    """Branch model - represents church branches"""
    __tablename__ = "branches"
    
    branch_name = Column(String(100), unique=True, nullable=False, index=True)
    
    # Relationships
    users = relationship("User", back_populates="branch", cascade="all, delete-orphan")
    events = relationship("Event", back_populates="branch", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Branch {self.branch_name}>"
