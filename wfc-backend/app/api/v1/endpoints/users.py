from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.user import UserResponse, UserWithBranch
from app.schemas.common import SuccessResponse
from app.core.constants import UserStatus
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.models.user import User
from app.models.branch import Branch
from app.api.deps import get_current_admin

router = APIRouter()


@router.get("/pending", response_model=List[UserWithBranch])
async def get_pending_users(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get all pending user registrations (Admin only)
    """
    pending_users = db.query(User, Branch.branch_name).join(
        Branch, User.branch_id == Branch.id
    ).filter(
        User.status == UserStatus.PENDING
    ).all()
    
    result = []
    for user, branch_name in pending_users:
        user_dict = UserWithBranch.from_orm(user).dict()
        user_dict['branch_name'] = branch_name
        result.append(user_dict)
    
    return result


@router.get("", response_model=List[UserWithBranch])
async def get_all_users(
    status: str = None,
    branch_id: str = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get all users with optional filters (Admin only)
    """
    query = db.query(User, Branch.branch_name).join(
        Branch, User.branch_id == Branch.id
    )
    
    # Apply filters
    if status:
        query = query.filter(User.status == status)
    if branch_id:
        query = query.filter(User.branch_id == branch_id)
    
    users = query.all()
    
    result = []
    for user, branch_name in users:
        user_dict = UserWithBranch.from_orm(user).dict()
        user_dict['branch_name'] = branch_name
        result.append(user_dict)
    
    return result


@router.put("/{user_id}/approve", response_model=SuccessResponse)
async def approve_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Approve pending user registration (Admin only)
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    if user.status != UserStatus.PENDING:
        raise PermissionDeniedError("User is not in pending status")
    
    user.status = UserStatus.APPROVED
    db.commit()
    
    # TODO: Send notification to user
    
    return {"message": f"User {user.email} approved successfully", "success": True}


@router.put("/{user_id}/reject", response_model=SuccessResponse)
async def reject_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Reject pending user registration (Admin only)
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    if user.status != UserStatus.PENDING:
        raise PermissionDeniedError("User is not in pending status")
    
    # Delete the user
    db.delete(user)
    db.commit()
    
    return {"message": f"User registration rejected", "success": True}


@router.put("/{user_id}/revoke", response_model=SuccessResponse)
async def revoke_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Revoke user access (Admin only)
    """
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    if user.status != UserStatus.APPROVED:
        raise PermissionDeniedError("Can only revoke approved users")
    
    user.status = UserStatus.REVOKED
    db.commit()
    
    return {"message": f"User {user.email} access revoked", "success": True}


@router.get("/{user_id}", response_model=UserWithBranch)
async def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get user details by ID (Admin only)
    """
    result = db.query(User, Branch.branch_name).join(
        Branch, User.branch_id == Branch.id
    ).filter(User.id == user_id).first()
    
    if not result:
        raise NotFoundError("User")
    
    user, branch_name = result
    user_dict = UserWithBranch.from_orm(user).dict()
    user_dict['branch_name'] = branch_name
    
    return user_dict
