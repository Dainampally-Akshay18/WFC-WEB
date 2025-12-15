from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.notification import (
    NotificationResponse,
    NotificationMarkRead
)
from app.schemas.common import SuccessResponse
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.models.notification import Notification
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=List[NotificationResponse])
async def get_notifications(
    unread_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all notifications for current user
    """
    query = db.query(Notification).filter(
        Notification.user_id == current_user.id
    )
    
    if unread_only:
        query = query.filter(Notification.is_read == False)
    
    notifications = query.order_by(Notification.created_at.desc()).all()
    
    return notifications


@router.get("/unread-count")
async def get_unread_count(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get count of unread notifications
    """
    count = db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).count()
    
    return {"unread_count": count}


@router.put("/{notification_id}/read", response_model=SuccessResponse)
async def mark_notification_read(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark notification as read
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()
    
    if not notification:
        raise NotFoundError("Notification")
    
    # Verify ownership
    if str(notification.user_id) != str(current_user.id):
        raise PermissionDeniedError("Not your notification")
    
    notification.is_read = True
    db.commit()
    
    return {"message": "Notification marked as read", "success": True}


@router.put("/read-all", response_model=SuccessResponse)
async def mark_all_read(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark all notifications as read
    """
    db.query(Notification).filter(
        Notification.user_id == current_user.id,
        Notification.is_read == False
    ).update({"is_read": True})
    
    db.commit()
    
    return {"message": "All notifications marked as read", "success": True}


@router.delete("/{notification_id}", response_model=SuccessResponse)
async def delete_notification(
    notification_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete notification
    """
    notification = db.query(Notification).filter(
        Notification.id == notification_id
    ).first()
    
    if not notification:
        raise NotFoundError("Notification")
    
    # Verify ownership
    if str(notification.user_id) != str(current_user.id):
        raise PermissionDeniedError("Not your notification")
    
    db.delete(notification)
    db.commit()
    
    return {"message": "Notification deleted successfully", "success": True}
