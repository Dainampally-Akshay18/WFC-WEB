from sqlalchemy import Column, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.db.base import BaseModel


class SermonView(BaseModel):
    """Tracks sermon views and likes"""
    __tablename__ = "sermon_views"
    
    viewed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    liked = Column(Boolean, default=False, nullable=False)
    
    # Foreign Keys
    sermon_id = Column(UUID(as_uuid=True), ForeignKey("sermons.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    sermon = relationship("Sermon", back_populates="views")
    user = relationship("User", back_populates="sermon_views")
    
    def __repr__(self):
        return f"<SermonView sermon={self.sermon_id} user={self.user_id}>"
