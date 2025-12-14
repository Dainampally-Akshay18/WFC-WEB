from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import BaseModel


class Sermon(BaseModel):
    """Sermon model - stores sermon video metadata"""
    __tablename__ = "sermons"
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    video_id = Column(String(100), nullable=False, unique=True)  # Vimeo video ID
    embed_url = Column(String(500), nullable=False)  # Vimeo embed URL
    thumbnail_url = Column(String(500), nullable=True)  # Vimeo thumbnail
    duration = Column(String(50), nullable=True)  # Video duration
    
    # Foreign Keys
    category_id = Column(UUID(as_uuid=True), ForeignKey("sermon_categories.id"), nullable=False)
    uploaded_by = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)
    
    # Relationships
    category = relationship("SermonCategory", back_populates="sermons")
    uploaded_by_admin = relationship("Admin", back_populates="sermons")
    views = relationship("SermonView", back_populates="sermon", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Sermon {self.title}>"
