from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.constants import UserStatus, EventCrossBranchStatus
from app.models.user import User
from app.models.sermon import Sermon
from app.models.blog import Blog
from app.models.event import Event
from app.models.prayer_request import PrayerRequest
from app.api.deps import get_current_admin

router = APIRouter()


@router.get("/stats")
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get overview statistics for admin dashboard
    """
    # User statistics
    total_users = db.query(User).count()
    pending_users = db.query(User).filter(User.status == UserStatus.PENDING).count()
    approved_users = db.query(User).filter(User.status == UserStatus.APPROVED).count()
    revoked_users = db.query(User).filter(User.status == UserStatus.REVOKED).count()
    
    # Content statistics
    total_sermons = db.query(Sermon).count()
    total_blogs = db.query(Blog).count()
    total_events = db.query(Event).count()
    total_prayers = db.query(PrayerRequest).count()
    
    # Pending actions
    pending_cross_branch = db.query(Event).filter(
        Event.cross_branch_status == EventCrossBranchStatus.PENDING
    ).count()
    
    return {
        "users": {
            "total": total_users,
            "pending": pending_users,
            "approved": approved_users,
            "revoked": revoked_users
        },
        "content": {
            "sermons": total_sermons,
            "blogs": total_blogs,
            "events": total_events,
            "prayers": total_prayers
        },
        "pending_actions": {
            "user_approvals": pending_users,
            "cross_branch_requests": pending_cross_branch
        }
    }


@router.get("/recent-activity")
async def get_recent_activity(
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get recent activity across the platform
    """
    # Recent user registrations
    recent_users = db.query(User).order_by(User.created_at.desc()).limit(limit).all()
    
    # Recent sermons
    recent_sermons = db.query(Sermon).order_by(Sermon.created_at.desc()).limit(limit).all()
    
    # Recent events
    recent_events = db.query(Event).order_by(Event.created_at.desc()).limit(limit).all()
    
    # Recent prayer requests
    recent_prayers = db.query(PrayerRequest).order_by(
        PrayerRequest.created_at.desc()
    ).limit(limit).all()
    
    return {
        "recent_users": [
            {
                "id": str(user.id),
                "name": user.full_name,
                "email": user.email,
                "status": user.status,
                "created_at": user.created_at.isoformat()
            }
            for user in recent_users
        ],
        "recent_sermons": [
            {
                "id": str(sermon.id),
                "title": sermon.title,
                "created_at": sermon.created_at.isoformat()
            }
            for sermon in recent_sermons
        ],
        "recent_events": [
            {
                "id": str(event.id),
                "title": event.title,
                "event_date": event.event_date.isoformat(),
                "created_at": event.created_at.isoformat()
            }
            for event in recent_events
        ],
        "recent_prayers": [
            {
                "id": str(prayer.id),
                "title": prayer.title,
                "created_at": prayer.created_at.isoformat()
            }
            for prayer in recent_prayers
        ]
    }
