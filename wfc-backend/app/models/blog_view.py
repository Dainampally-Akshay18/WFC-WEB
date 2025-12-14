from sqlalchemy import Column, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
from app.db.base import BaseModel


class BlogView(BaseModel):
    """Tracks blog views"""
    __tablename__ = "blog_views"
    
    viewed_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    
    # Foreign Keys
    blog_id = Column(UUID(as_uuid=True), ForeignKey("blogs.id"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    blog = relationship("Blog", back_populates="views")
    user = relationship("User", back_populates="blog_views")
    
    def __repr__(self):
        return f"<BlogView blog={self.blog_id} user={self.user_id}>"
