from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.db.base import BaseModel


class Admin(BaseModel):
    """Admin model - represents pastors/administrators"""
    __tablename__ = "admins"
    
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    display_name = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    sermons = relationship("Sermon", back_populates="uploaded_by_admin", cascade="all, delete-orphan")
    blogs = relationship("Blog", back_populates="created_by_admin", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="admin", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Admin {self.email}>"
