from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.prayer import (
    PrayerRequestCreate,
    PrayerRequestUpdate,
    PrayerRequestResponse,
    PrayerRequestWithUser,
    PastorResponse
)
from app.schemas.common import SuccessResponse
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.models.prayer_request import PrayerRequest
from app.models.user import User
from app.models.branch import Branch
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()


@router.post("", response_model=PrayerRequestResponse, status_code=status.HTTP_201_CREATED)
async def create_prayer_request(
    prayer_data: PrayerRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create prayer request (visible to all members)
    """
    new_prayer = PrayerRequest(
        title=prayer_data.title,
        content=prayer_data.content,
        user_id=current_user.id
    )
    
    db.add(new_prayer)
    db.commit()
    db.refresh(new_prayer)
    
    return new_prayer


@router.get("", response_model=List[PrayerRequestWithUser])
async def get_all_prayers(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all prayer requests from all branches (global visibility)
    """
    prayers = db.query(PrayerRequest, User.full_name, Branch.branch_name).join(
        User, PrayerRequest.user_id == User.id
    ).join(
        Branch, User.branch_id == Branch.id
    ).order_by(PrayerRequest.created_at.desc()).all()
    
    result = []
    for prayer, user_name, branch_name in prayers:
        prayer_dict = PrayerRequestWithUser.from_orm(prayer).dict()
        prayer_dict['user_name'] = user_name
        prayer_dict['user_branch'] = branch_name
        result.append(prayer_dict)
    
    return result


@router.get("/{prayer_id}", response_model=PrayerRequestWithUser)
async def get_prayer(
    prayer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get prayer request by ID
    """
    result = db.query(PrayerRequest, User.full_name, Branch.branch_name).join(
        User, PrayerRequest.user_id == User.id
    ).join(
        Branch, User.branch_id == Branch.id
    ).filter(PrayerRequest.id == prayer_id).first()
    
    if not result:
        raise NotFoundError("Prayer request")
    
    prayer, user_name, branch_name = result
    
    prayer_dict = PrayerRequestWithUser.from_orm(prayer).dict()
    prayer_dict['user_name'] = user_name
    prayer_dict['user_branch'] = branch_name
    
    return prayer_dict


@router.put("/{prayer_id}", response_model=PrayerRequestResponse)
async def update_prayer(
    prayer_id: str,
    prayer_data: PrayerRequestUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update prayer request (only creator can update)
    """
    prayer = db.query(PrayerRequest).filter(PrayerRequest.id == prayer_id).first()
    
    if not prayer:
        raise NotFoundError("Prayer request")
    
    # Only creator can update
    if str(prayer.user_id) != str(current_user.id):
        raise PermissionDeniedError("You can only update your own prayer requests")
    
    # Update fields if provided
    if prayer_data.title:
        prayer.title = prayer_data.title
    
    if prayer_data.content:
        prayer.content = prayer_data.content
    
    db.commit()
    db.refresh(prayer)
    
    return prayer


@router.delete("/{prayer_id}", response_model=SuccessResponse)
async def delete_prayer(
    prayer_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete prayer request (only creator can delete)
    """
    prayer = db.query(PrayerRequest).filter(PrayerRequest.id == prayer_id).first()
    
    if not prayer:
        raise NotFoundError("Prayer request")
    
    # Only creator can delete
    if str(prayer.user_id) != str(current_user.id):
        raise PermissionDeniedError("You can only delete your own prayer requests")
    
    db.delete(prayer)
    db.commit()
    
    return {"message": "Prayer request deleted successfully", "success": True}


@router.post("/{prayer_id}/respond", response_model=SuccessResponse)
async def add_pastor_response(
    prayer_id: str,
    response_data: PastorResponse,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Add pastor response to prayer request (Admin only)
    """
    prayer = db.query(PrayerRequest).filter(PrayerRequest.id == prayer_id).first()
    
    if not prayer:
        raise NotFoundError("Prayer request")
    
    prayer.pastor_response = response_data.response
    db.commit()
    
    # TODO: Send notification to prayer requester
    
    return {"message": "Response added successfully", "success": True}
