from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import BaseModel


class PrayerRequest(BaseModel):
    """Prayer request model - global visibility"""
    __tablename__ = "prayer_requests"
    
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    pastor_response = Column(Text, nullable=True)
    
    # Foreign Keys
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    user = relationship("User", back_populates="prayer_requests")
    
    def __repr__(self):
        return f"<PrayerRequest {self.title}>"
