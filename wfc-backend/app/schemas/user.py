from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.core.constants import UserStatus


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    full_name: str = Field(..., min_length=2, max_length=255)


class UserCreate(UserBase):
    """User creation schema"""
    password: str = Field(..., min_length=8)
    branch_id: UUID


class UserUpdate(BaseModel):
    """User update schema"""
    full_name: Optional[str] = Field(None, min_length=2, max_length=255)
    profile_image: Optional[str] = None


class UserResponse(UserBase):
    """User response schema"""
    id: UUID
    status: UserStatus
    branch_id: UUID
    profile_image: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True


class UserWithBranch(UserResponse):
    """User response with branch name"""
    branch_name: str


class UserApproval(BaseModel):
    """User approval/rejection"""
    user_id: UUID
    action: str = Field(..., pattern="^(approve|reject|revoke)$")
