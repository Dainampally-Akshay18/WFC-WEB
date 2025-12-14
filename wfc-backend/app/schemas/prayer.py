from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class PrayerRequestCreate(BaseModel):
    """Prayer request creation schema"""
    title: str = Field(..., min_length=3, max_length=255)
    content: str = Field(..., min_length=10)


class PrayerRequestUpdate(BaseModel):
    """Prayer request update schema"""
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    content: Optional[str] = Field(None, min_length=10)


class PrayerRequestResponse(BaseModel):
    """Prayer request response schema"""
    id: UUID
    title: str
    content: str
    pastor_response: Optional[str]
    user_id: UUID
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class PrayerRequestWithUser(PrayerRequestResponse):
    """Prayer request with user info"""
    user_name: str
    user_branch: str


class PastorResponse(BaseModel):
    """Pastor response to prayer request"""
    prayer_id: UUID
    response: str = Field(..., min_length=5)
