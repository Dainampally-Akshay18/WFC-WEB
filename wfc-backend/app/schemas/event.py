from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.core.constants import EventCrossBranchStatus


class EventCreate(BaseModel):
    """Event creation schema"""
    title: str = Field(..., min_length=3, max_length=255)
    description: Optional[str] = None
    event_date: datetime
    location: Optional[str] = Field(None, max_length=255)
    event_image: Optional[str] = None
    branch_id: UUID


class EventUpdate(BaseModel):
    """Event update schema"""
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    description: Optional[str] = None
    event_date: Optional[datetime] = None
    location: Optional[str] = Field(None, max_length=255)
    event_image: Optional[str] = None


class EventResponse(BaseModel):
    """Event response schema"""
    id: UUID
    title: str
    description: Optional[str]
    event_date: datetime
    location: Optional[str]
    event_image: Optional[str]
    branch_id: UUID
    created_by: UUID
    is_cross_branch: bool
    cross_branch_status: EventCrossBranchStatus
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class EventWithBranch(EventResponse):
    """Event with branch name"""
    branch_name: str
    creator_name: str


class EventCrossBranchRequest(BaseModel):
    """Request cross-branch visibility"""
    event_id: UUID


class EventCrossBranchApproval(BaseModel):
    """Approve/reject cross-branch request"""
    event_id: UUID
    action: str = Field(..., pattern="^(approve|reject)$")
