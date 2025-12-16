from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
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
    phone: Optional[str] = None
    address: Optional[str] = None
    profile_image: Optional[str] = None


class UserResponse(UserBase):
    """User response schema"""
    id: UUID
    status: UserStatus
    branch_id: Optional[UUID] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserWithBranch(BaseModel):
    """User response with branch name"""
    user_id: str
    email: EmailStr
    full_name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    status: str
    branch_id: Optional[str] = None
    branch_name: Optional[str] = None
    profile_image: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class UserApproval(BaseModel):
    """User approval/rejection"""
    user_id: UUID
    action: str = Field(..., pattern="^(approve|reject|revoke)$")


class BulkUserAction(BaseModel):
    """Bulk user action schema - accepts both UUID and string"""
    user_ids: List[str]  # Changed from UUID to str
    reason: Optional[str] = None
