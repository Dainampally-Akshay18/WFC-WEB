from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class SermonCategoryCreate(BaseModel):
    """Sermon category creation"""
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None


class SermonCategoryUpdate(BaseModel):
    """Sermon category update"""
    name: Optional[str] = Field(None, min_length=2, max_length=100)
    description: Optional[str] = None


class SermonCategoryResponse(BaseModel):
    """Sermon category response"""
    id: UUID
    name: str
    description: Optional[str]
    created_at: datetime
    
    class Config:
        from_attributes = True


class SermonCategoryWithCount(SermonCategoryResponse):
    """Category with sermon count"""
    sermon_count: int
