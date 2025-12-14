from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.user import UserUpdate, UserResponse
from app.schemas.auth import PasswordChange
from app.schemas.common import SuccessResponse
from app.core.security import verify_password, get_password_hash, validate_password_strength
from app.core.exceptions import ValidationError, AuthenticationError
from app.models.user import User
from app.api.deps import get_current_user

router = APIRouter()


@router.get("", response_model=UserResponse)
async def get_profile(current_user: User = Depends(get_current_user)):
    """
    Get current user's profile
    """
    return current_user


@router.put("", response_model=UserResponse)
async def update_profile(
    profile_data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update current user's profile
    """
    # Update fields if provided
    if profile_data.full_name:
        current_user.full_name = profile_data.full_name
    
    if profile_data.profile_image is not None:
        current_user.profile_image = profile_data.profile_image
    
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.put("/password", response_model=SuccessResponse)
async def change_password(
    password_data: PasswordChange,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Change user password
    """
    # Verify current password
    if not verify_password(password_data.current_password, current_user.password_hash):
        raise AuthenticationError("Current password is incorrect")
    
    # Validate new password strength
    is_valid, error_msg = validate_password_strength(password_data.new_password)
    if not is_valid:
        raise ValidationError(error_msg)
    
    # Update password
    current_user.password_hash = get_password_hash(password_data.new_password)
    db.commit()
    
    return {"message": "Password changed successfully", "success": True}
