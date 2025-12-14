from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from uuid import UUID
from app.core.constants import NotificationType


class NotificationCreate(BaseModel):
    """Notification creation schema (internal use)"""
    user_id: UUID
    message: str
    notification_type: NotificationType


class NotificationResponse(BaseModel):
    """Notification response schema"""
    id: UUID
    message: str
    notification_type: NotificationType
    is_read: bool
    created_at: datetime
    
    class Config:
        from_attributes = True


class NotificationMarkRead(BaseModel):
    """Mark notification as read"""
    notification_id: UUID


class NotificationMarkAllRead(BaseModel):
    """Mark all notifications as read"""
    user_id: UUID
