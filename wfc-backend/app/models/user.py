from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import BaseModel
from app.core.constants import UserStatus


class User(BaseModel):
    """User model - represents church members"""
    __tablename__ = "users"
    
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    status = Column(String(50), default=UserStatus.PENDING, nullable=False, index=True)
    profile_image = Column(String(500), nullable=True)
    
    # Foreign Keys
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=False)
    
    # Relationships
    branch = relationship("Branch", back_populates="users")
    sermon_views = relationship("SermonView", back_populates="user", cascade="all, delete-orphan")
    blog_views = relationship("BlogView", back_populates="user", cascade="all, delete-orphan")
    prayer_requests = relationship("PrayerRequest", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    created_events = relationship("Event", back_populates="creator", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User {self.email} - {self.status}>"
