from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class SermonCreate(BaseModel):
    """Sermon creation schema"""
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    category_id: UUID
    video_id: str
    embed_url: str
    thumbnail_url: Optional[str] = None
    duration: Optional[str] = None


class SermonUpdate(BaseModel):
    """Sermon update schema"""
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    category_id: Optional[UUID] = None


class SermonResponse(BaseModel):
    """Sermon response schema"""
    id: UUID
    title: str
    description: Optional[str]
    video_id: str
    embed_url: str
    thumbnail_url: Optional[str]
    duration: Optional[str]
    category_id: UUID
    uploaded_by: UUID
    created_at: datetime
    
    class Config:
        from_attributes = True


class SermonWithStats(SermonResponse):
    """Sermon with view statistics"""
    total_views: int
    total_likes: int
    user_has_viewed: bool = False
    user_has_liked: bool = False


class SermonViewCreate(BaseModel):
    """Mark sermon as viewed"""
    sermon_id: UUID


class SermonLikeToggle(BaseModel):
    """Toggle sermon like"""
    sermon_id: UUID
