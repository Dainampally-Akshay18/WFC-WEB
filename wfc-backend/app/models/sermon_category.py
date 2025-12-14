from sqlalchemy import Column, String, Text
from sqlalchemy.orm import relationship
from app.db.base import BaseModel


class SermonCategory(BaseModel):
    """Sermon category model"""
    __tablename__ = "sermon_categories"
    
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    
    # Relationships
    sermons = relationship("Sermon", back_populates="category", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<SermonCategory {self.name}>"
