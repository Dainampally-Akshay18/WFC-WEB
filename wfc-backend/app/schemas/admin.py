from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID


class AdminCreate(BaseModel):
    """Admin creation schema (for seeding)"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    display_name: str = Field(..., min_length=2, max_length=255)


class AdminUpdate(BaseModel):
    """Admin update schema"""
    display_name: Optional[str] = Field(None, min_length=2, max_length=255)
    is_active: Optional[bool] = None


class AdminResponse(BaseModel):
    """Admin response schema"""
    id: UUID
    email: EmailStr
    display_name: str
    is_active: bool
    last_login: Optional[datetime]
    created_at: datetime
    
    class Config:
        from_attributes = True


class AdminPasswordChange(BaseModel):
    """Admin password change"""
    current_password: str
    new_password: str = Field(..., min_length=8)
