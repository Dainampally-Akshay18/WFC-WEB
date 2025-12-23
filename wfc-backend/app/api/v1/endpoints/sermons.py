# app/api/v1/endpoints/sermons.py

from fastapi import APIRouter, Depends, status,Form, File, UploadFile
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from sqlalchemy.orm import Session
from typing import List, Optional

from app.db.session import get_db
from app.schemas.sermon import (
    SermonCreate,
    SermonUpdate,
    SermonResponse,
    SermonWithStats,
    SermonViewCreate,
    SermonLikeToggle,
)
from app.schemas.common import SuccessResponse
from app.core.exceptions import NotFoundError, ValidationError, AuthenticationError
from app.core.security import decode_token
from app.core.constants import UserRole
from app.models.sermon import Sermon
from app.models.sermon_view import SermonView
from app.models.sermon_category import SermonCategory
from app.models.user import User
from app.api.deps import get_current_admin, get_current_user
from app.services.vimeo import upload_video_to_vimeo

router = APIRouter()

security = HTTPBearer()

# =========================================================
# SHARED AUTH (USER OR ADMIN) – READ ACCESS ONLY
# =========================================================

async def get_current_actor(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Allows BOTH:
    - Approved MEMBER
    - Active ADMIN
    Used ONLY for READ operations on sermons.
    """
    payload = decode_token(credentials.credentials)
    if payload.get("type") != "access":
        raise AuthenticationError("Invalid token type")

    role = payload.get("role")
    if role not in (UserRole.MEMBER, UserRole.ADMIN):
        raise AuthenticationError("Invalid role")

    return payload


# =========================================================
# CREATE SERMON (ADMIN ONLY)
# =========================================================

@router.post(
    "",
    response_model=SermonResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_sermon(
    sermon_data: SermonCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin),
):
    """
    Create sermon with Vimeo video metadata (Admin only)
    """
    # Verify category exists
    category = db.query(SermonCategory).filter(
        SermonCategory.id == sermon_data.category_id
    ).first()
    if not category:
        raise ValidationError("Invalid category ID")

    # Check if video_id already exists
    existing = db.query(Sermon).filter(
        Sermon.video_id == sermon_data.video_id
    ).first()
    if existing:
        raise ValidationError("Sermon with this video already exists")

    new_sermon = Sermon(
        title=sermon_data.title,
        description=sermon_data.description,
        category_id=sermon_data.category_id,
        video_id=sermon_data.video_id,
        embed_url=sermon_data.embed_url,
        thumbnail_url=sermon_data.thumbnail_url,
        duration=sermon_data.duration,
        uploaded_by=current_admin.id,
    )

    db.add(new_sermon)
    db.commit()
    db.refresh(new_sermon)

    # TODO: Create notification for all users
    return new_sermon


# =========================================================
# GET ALL SERMONS (USER + ADMIN)
# =========================================================

@router.get("", response_model=List[SermonWithStats])
async def get_all_sermons(
    category_id: Optional[str] = None,
    db: Session = Depends(get_db),
    actor = Depends(get_current_actor),
):
    """
    Get all sermons with view statistics (User + Admin)
    """
    query = db.query(Sermon)
    if category_id:
        query = query.filter(Sermon.category_id == category_id)

    sermons = query.order_by(Sermon.created_at.desc()).all()
    result = []

    for sermon in sermons:
        # Get view stats
        total_views = db.query(SermonView).filter(
            SermonView.sermon_id == sermon.id
        ).count()
        total_likes = db.query(SermonView).filter(
            SermonView.sermon_id == sermon.id,
            SermonView.liked == True,
        ).count()

        # For list views we do not need per-user flags; set them to False
        sermon_dict = SermonWithStats.from_orm(sermon).dict()
        sermon_dict["total_views"] = total_views
        sermon_dict["total_likes"] = total_likes
        sermon_dict["user_has_viewed"] = False
        sermon_dict["user_has_liked"] = False

        result.append(sermon_dict)

    return result


# =========================================================
# GET SERMON BY ID (USER + ADMIN)
# =========================================================

@router.get("/{sermon_id}", response_model=SermonWithStats)
async def get_sermon(
    sermon_id: str,
    db: Session = Depends(get_db),
    actor = Depends(get_current_actor),
):
    """
    Get sermon by ID with statistics (User + Admin)
    """
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise NotFoundError("Sermon")

    total_views = db.query(SermonView).filter(
        SermonView.sermon_id == sermon.id
    ).count()
    total_likes = db.query(SermonView).filter(
        SermonView.sermon_id == sermon.id,
        SermonView.liked == True,
    ).count()

    sermon_dict = SermonWithStats.from_orm(sermon).dict()
    sermon_dict["total_views"] = total_views
    sermon_dict["total_likes"] = total_likes
    sermon_dict["user_has_viewed"] = False
    sermon_dict["user_has_liked"] = False

    return sermon_dict


# =========================================================
# UPDATE SERMON (ADMIN ONLY)
# =========================================================

@router.put("/{sermon_id}", response_model=SermonResponse)
async def update_sermon(
    sermon_id: str,
    sermon_data: SermonUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin),
):
    """
    Update sermon (Admin only)
    """
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise NotFoundError("Sermon")

    # Update fields if provided
    if sermon_data.title:
        sermon.title = sermon_data.title

    if sermon_data.description is not None:
        sermon.description = sermon_data.description

    if sermon_data.category_id:
        # Verify category exists
        category = db.query(SermonCategory).filter(
            SermonCategory.id == sermon_data.category_id
        ).first()
        if not category:
            raise ValidationError("Invalid category ID")
        sermon.category_id = sermon_data.category_id

    db.commit()
    db.refresh(sermon)

    return sermon


# =========================================================
# DELETE SERMON (ADMIN ONLY)
# =========================================================

@router.delete("/{sermon_id}", response_model=SuccessResponse)
async def delete_sermon(
    sermon_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin),
):
    """
    Delete sermon (Admin only)
    Also deletes from Vimeo (handled in service layer)
    """
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise NotFoundError("Sermon")

    video_id = sermon.video_id

    # Delete from database (cascade will delete views)
    db.delete(sermon)
    db.commit()

    # TODO: Delete from Vimeo using video_id
    return {"message": "Sermon deleted successfully", "success": True}


# =========================================================
# MARK SERMON VIEWED (USER ONLY)
# =========================================================

@router.post("/{sermon_id}/view", response_model=SuccessResponse)
async def mark_sermon_viewed(
    sermon_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Mark sermon as viewed by current user (Member only)
    """
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise NotFoundError("Sermon")

    # Check if already viewed
    existing_view = db.query(SermonView).filter(
        SermonView.sermon_id == sermon_id,
        SermonView.user_id == current_user.id,
    ).first()

    if existing_view:
        return {"message": "Sermon already marked as viewed", "success": True}

    # Create view record
    new_view = SermonView(
        sermon_id=sermon_id,
        user_id=current_user.id,
        liked=False,
    )

    db.add(new_view)
    db.commit()

    return {"message": "Sermon marked as viewed", "success": True}


# =========================================================
# TOGGLE SERMON LIKE (USER ONLY)
# =========================================================

@router.post("/{sermon_id}/like", response_model=SuccessResponse)
async def toggle_sermon_like(
    sermon_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Toggle like on sermon (automatically marks as viewed)
    """
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise NotFoundError("Sermon")

    # Check if already viewed
    view = db.query(SermonView).filter(
        SermonView.sermon_id == sermon_id,
        SermonView.user_id == current_user.id,
    ).first()

    if not view:
        # Create view record with like
        view = SermonView(
            sermon_id=sermon_id,
            user_id=current_user.id,
            liked=True,
        )
        db.add(view)
        message = "Sermon liked"
    else:
        # Toggle like
        view.liked = not view.liked
        message = "Sermon liked" if view.liked else "Sermon unliked"

    db.commit()

    return {"message": message, "success": True}


# =========================================================
# SERMON ANALYTICS (ADMIN ONLY)
# =========================================================

@router.get("/{sermon_id}/analytics")
async def get_sermon_analytics(
    sermon_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin),
):
    """
    Get detailed sermon analytics (Admin only)
    Shows who watched, who didn't, likes count
    """
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise NotFoundError("Sermon")

    # Get all approved users
    all_users = db.query(User).filter(User.status == "approved").all()

    # Get users who viewed
    viewed_users = db.query(User).join(SermonView).filter(
        SermonView.sermon_id == sermon_id
    ).all()

    # Get users who liked
    liked_users = db.query(User).join(SermonView).filter(
        SermonView.sermon_id == sermon_id,
        SermonView.liked == True,
    ).all()

    # Calculate who didn't watch
    viewed_user_ids = {user.id for user in viewed_users}
    not_watched = [
        {"id": str(user.id), "name": user.full_name, "email": user.email}
        for user in all_users
        if user.id not in viewed_user_ids
    ]

    return {
        "sermon_id": str(sermon.id),
        "sermon_title": sermon.title,
        "total_views": len(viewed_users),
        "total_likes": len(liked_users),
        "total_users": len(all_users),
        "viewed_by": [
            {"id": str(user.id), "name": user.full_name, "email": user.email}
            for user in viewed_users
        ],
        "liked_by": [
            {"id": str(user.id), "name": user.full_name, "email": user.email}
            for user in liked_users
        ],
        "not_watched_by": not_watched,
    }
@router.post(
    "/upload",
    response_model=SermonResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_sermon_video(
    title: str = Form(...),
    description: str = Form(""),
    category_id: str = Form(...),
    video_file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin),
):
    """
    Upload a sermon video, push to Vimeo, store metadata (Admin only).
    """
    # Validate category
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()
    if not category:
        raise ValidationError("Invalid category ID")

    # Upload to Vimeo and get metadata
    vimeo_meta = await upload_video_to_vimeo(video_file, title, description)
    # Expected shape:
    # {
    #   "video_id": "...",
    #   "embed_url": "...",
    #   "thumbnail_url": "...",
    #   "duration": 123
    # }

    # Create sermon record
    new_sermon = Sermon(
        title=title,
        description=description,
        category_id=category_id,
        video_id=vimeo_meta["video_id"],
        embed_url=vimeo_meta["embed_url"],
        thumbnail_url=vimeo_meta["thumbnail_url"],
        duration=vimeo_meta["duration"],
        uploaded_by=current_admin.id,
    )

    db.add(new_sermon)
    db.commit()
    db.refresh(new_sermon)

    return new_sermon