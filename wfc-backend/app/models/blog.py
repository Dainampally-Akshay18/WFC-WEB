from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import BaseModel
from app.core.constants import BlogStatus


class Blog(BaseModel):
    """Blog model - Pastor's Pen"""
    __tablename__ = "blogs"
    
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    status = Column(String(50), default=BlogStatus.DRAFT, nullable=False)
    featured_image = Column(String(500), nullable=True)
    
    # Foreign Keys
    created_by = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)
    
    # Relationships
    created_by_admin = relationship("Admin", back_populates="blogs")
    views = relationship("BlogView", back_populates="blog", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Blog {self.title} - {self.status}>"
