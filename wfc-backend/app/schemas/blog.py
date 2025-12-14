from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.core.constants import BlogStatus


class BlogCreate(BaseModel):
    """Blog creation schema"""
    title: str = Field(..., min_length=3, max_length=255)
    content: str = Field(..., min_length=10)
    status: BlogStatus = BlogStatus.DRAFT
    featured_image: Optional[str] = None


class BlogUpdate(BaseModel):
    """Blog update schema"""
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    content: Optional[str] = Field(None, min_length=10)
    status: Optional[BlogStatus] = None
    featured_image: Optional[str] = None


class BlogResponse(BaseModel):
    """Blog response schema"""
    id: UUID
    title: str
    content: str
    status: BlogStatus
    featured_image: Optional[str]
    created_by: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class BlogWithStats(BlogResponse):
    """Blog with view statistics"""
    total_views: int
    user_has_viewed: bool = False


class BlogViewCreate(BaseModel):
    """Mark blog as viewed"""
    blog_id: UUID
