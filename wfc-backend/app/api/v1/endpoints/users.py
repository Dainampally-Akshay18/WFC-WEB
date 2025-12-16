from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional
from app.db.session import get_db
from app.schemas.common import SuccessResponse
from app.core.constants import UserStatus
from app.core.exceptions import NotFoundError, PermissionDeniedError
from app.models.user import User
from app.models.branch import Branch
from app.api.deps import get_current_admin

router = APIRouter()


def user_to_dict(user):
    """Convert User object to dictionary safely"""
    return {
        "user_id": str(user.id),
        "email": user.email,
        "full_name": user.full_name if hasattr(user, 'full_name') else None,
        "phone": user.phone if hasattr(user, 'phone') else None,
        "address": user.address if hasattr(user, 'address') else None,
        "status": user.status,
        "branch_id": str(user.branch_id) if user.branch_id else None,
        "branch_name": user.branch.branch_name if user.branch else None,
        "profile_image": user.profile_image if hasattr(user, 'profile_image') else None,
        "created_at": user.created_at.isoformat() if hasattr(user, 'created_at') and user.created_at else None,
        "updated_at": user.updated_at.isoformat() if hasattr(user, 'updated_at') and user.updated_at else None,
    }


@router.get("/pending", response_model=dict)
async def get_pending_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all pending user registrations (Admin only)"""
    offset = (page - 1) * limit
    total = db.query(User).filter(User.status == UserStatus.PENDING).count()
    
    pending_users = db.query(User).outerjoin(
        Branch, User.branch_id == Branch.id
    ).filter(
        User.status == UserStatus.PENDING
    ).offset(offset).limit(limit).all()
    
    result = [user_to_dict(user) for user in pending_users]
    
    return {
        "users": result,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit if total > 0 else 1
        }
    }


@router.get("", response_model=dict)
async def get_all_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    branch: Optional[str] = Query(None),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get all users with optional filters (Admin only)"""
    offset = (page - 1) * limit
    query = db.query(User).outerjoin(Branch, User.branch_id == Branch.id)
    
    if search:
        search_term = f"%{search}%"
        search_filters = [
            User.email.ilike(search_term),
            User.full_name.ilike(search_term)
        ]
        if hasattr(User, 'phone'):
            search_filters.append(User.phone.ilike(search_term))
        query = query.filter(or_(*search_filters))
    
    if status:
        query = query.filter(User.status == status)
    
    if branch:
        query = query.filter(Branch.branch_name.ilike(f"%{branch}%"))
    
    total = query.count()
    
    if sort_by == "created_at" and hasattr(User, 'created_at'):
        query = query.order_by(User.created_at.desc() if sort_order == "desc" else User.created_at.asc())
    elif sort_by == "email":
        query = query.order_by(User.email.desc() if sort_order == "desc" else User.email.asc())
    elif sort_by in ["full_name", "display_name"]:
        query = query.order_by(User.full_name.desc() if sort_order == "desc" else User.full_name.asc())
    elif sort_by == "status":
        query = query.order_by(User.status.desc() if sort_order == "desc" else User.status.asc())
    
    users = query.offset(offset).limit(limit).all()
    result = [user_to_dict(user) for user in users]
    
    return {
        "users": result,
        "pagination": {
            "page": page,
            "limit": limit,
            "total": total,
            "total_pages": (total + limit - 1) // limit if total > 0 else 1
        }
    }


@router.post("/{user_id}/approve", response_model=SuccessResponse)
async def approve_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Approve user - works for PENDING and REVOKED users (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    # Allow approving both PENDING and REVOKED users
    if user.status == UserStatus.APPROVED:
        return {"message": f"User {user.email} is already approved", "success": True}
    
    if user.status not in [UserStatus.PENDING, UserStatus.REVOKED]:
        raise PermissionDeniedError(f"Cannot approve user with status: {user.status}")
    
    old_status = user.status
    user.status = UserStatus.APPROVED
    db.commit()
    db.refresh(user)
    
    message = f"User {user.email} approved successfully"
    if old_status == UserStatus.REVOKED:
        message = f"User {user.email} access restored successfully"
    
    print(f"✅ {message} (was: {old_status})")
    
    return {"message": message, "success": True}


@router.post("/{user_id}/reject", response_model=SuccessResponse)
async def reject_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Reject user - marks as REVOKED instead of deleting (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    if user.status == UserStatus.REVOKED:
        return {"message": "User is already revoked", "success": True}
    
    old_status = user.status
    user.status = UserStatus.REVOKED
    db.commit()
    db.refresh(user)
    
    print(f"🔴 Revoked {user.email} (was: {old_status})")
    
    return {"message": f"User {user.email} access revoked successfully", "success": True}


@router.post("/{user_id}/revoke", response_model=SuccessResponse)
async def revoke_user(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Revoke user access (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    if user.status == UserStatus.REVOKED:
        return {"message": "User is already revoked", "success": True}
    
    old_status = user.status
    user.status = UserStatus.REVOKED
    db.commit()
    db.refresh(user)
    
    print(f"🔴 Revoked {user.email} (was: {old_status})")
    
    return {"message": f"User {user.email} access revoked successfully", "success": True}


@router.post("/bulk-approve", response_model=dict)
async def bulk_approve_users(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Bulk approve multiple users - works for PENDING and REVOKED users (Admin only)"""
    user_ids = payload.get("user_ids", [])
    
    print(f"🟢 Bulk Approve - Received payload: {payload}")
    
    # Handle nested dict from frontend
    if isinstance(user_ids, dict):
        print("⚠️  user_ids is a dict, extracting...")
        if 'userIds' in user_ids:
            user_ids = user_ids['userIds']
            print(f"🔄 Extracted: {user_ids}")
        else:
            return {
                "message": "Invalid payload structure",
                "success": False,
                "approved_count": 0
            }
    
    if not user_ids or not isinstance(user_ids, list):
        print(f"❌ Invalid user_ids: {user_ids}")
        return {
            "message": "Invalid user_ids provided - must be a non-empty array",
            "success": False,
            "approved_count": 0
        }
    
    # Ensure all IDs are strings
    user_ids_str = [str(uid) for uid in user_ids]
    print(f"🟢 Searching for users: {user_ids_str}")
    
    # ✅ CRITICAL FIX: Query PENDING OR REVOKED users
    users = db.query(User).filter(
        User.id.in_(user_ids_str),
        or_(User.status == UserStatus.PENDING, User.status == UserStatus.REVOKED)
    ).all()
    
    print(f"🟢 Found {len(users)} users (pending/revoked) to approve")
    
    if len(users) == 0:
        print(f"⚠️  No pending or revoked users found. Checking all statuses...")
        # Debug: Check what status they actually have
        all_users = db.query(User).filter(User.id.in_(user_ids_str)).all()
        for u in all_users:
            print(f"   User {u.email} has status: {u.status}")
    
    # Approve each user
    approved_count = 0
    restored_count = 0
    for user in users:
        old_status = user.status
        user.status = UserStatus.APPROVED
        
        if old_status == UserStatus.REVOKED:
            restored_count += 1
            print(f"♻️  Restored: {user.email} (was: {old_status})")
        else:
            print(f"✅ Approved: {user.email} (was: {old_status})")
        
        approved_count += 1
    
    # Commit transaction
    try:
        db.commit()
        print(f"🟢 COMMITTED: {approved_count} users approved ({restored_count} restored)")
    except Exception as e:
        db.rollback()
        print(f"❌ COMMIT FAILED: {str(e)}")
        return {
            "message": f"Database error: {str(e)}",
            "success": False,
            "approved_count": 0
        }
    
    message = f"{approved_count} user(s) approved successfully"
    if restored_count > 0:
        message = f"{approved_count} user(s) approved ({restored_count} restored from revoked)"
    
    return {
        "message": message,
        "success": True,
        "approved_count": approved_count
    }


@router.post("/bulk-reject", response_model=dict)
async def bulk_reject_users(
    payload: dict = Body(...),
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Bulk reject/revoke multiple users - marks as REVOKED (Admin only)"""
    user_ids = payload.get("user_ids", [])
    
    print(f"🔴 FULL PAYLOAD RECEIVED: {payload}")
    print(f"🔴 user_ids TYPE: {type(user_ids)}")
    print(f"🔴 user_ids VALUE: {user_ids}")
    
    # Handle nested dict from frontend
    if isinstance(user_ids, dict):
        print("⚠️  ERROR: user_ids is a dict, not a list!")
        if 'userIds' in user_ids:
            user_ids = user_ids['userIds']
            print(f"🔄 Extracted from nested dict: {user_ids}")
        else:
            return {
                "message": "Invalid payload structure. Expected user_ids to be an array.",
                "success": False,
                "rejected_count": 0
            }
    
    if not user_ids or not isinstance(user_ids, list):
        print(f"❌ VALIDATION FAILED: user_ids={user_ids}, is_list={isinstance(user_ids, list)}")
        return {
            "message": "Invalid user_ids provided - must be a non-empty array",
            "success": False,
            "rejected_count": 0
        }
    
    # Ensure all IDs are strings
    user_ids_str = [str(uid) for uid in user_ids]
    print(f"🔴 Searching for users with IDs: {user_ids_str}")
    
    # Fetch users regardless of current status
    users = db.query(User).filter(
        User.id.in_(user_ids_str)
    ).all()
    
    print(f"🔴 Found {len(users)} users to revoke")
    
    if len(users) == 0:
        print("⚠️  No users found with those IDs!")
        return {
            "message": "No users found with the provided IDs",
            "success": False,
            "rejected_count": 0
        }
    
    # Change status to REVOKED instead of deleting
    rejected_count = 0
    for user in users:
        old_status = user.status
        
        # Skip if already revoked
        if user.status == UserStatus.REVOKED:
            print(f"⚠️  Skipping {user.email} - already revoked")
            continue
        
        # Set to REVOKED to preserve data
        user.status = UserStatus.REVOKED
        rejected_count += 1
        print(f"🔄 Changed {user.email}: {old_status} → REVOKED")
    
    # Commit the transaction
    try:
        db.commit()
        print(f"✅ SUCCESSFULLY COMMITTED: {rejected_count} users revoked")
    except Exception as e:
        db.rollback()
        print(f"❌ COMMIT FAILED: {str(e)}")
        return {
            "message": f"Database error: {str(e)}",
            "success": False,
            "rejected_count": 0
        }
    
    return {
        "message": f"{rejected_count} user(s) revoked successfully",
        "success": True,
        "rejected_count": rejected_count
    }


@router.get("/{user_id}", response_model=dict)
async def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get user details by ID (Admin only)"""
    user = db.query(User).outerjoin(
        Branch, User.branch_id == Branch.id
    ).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    return user_to_dict(user)


@router.get("/{user_id}/activity", response_model=list)
async def get_user_activity(
    user_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """Get user activity history (Admin only)"""
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise NotFoundError("User")
    
    activities = []
    
    if hasattr(user, 'created_at') and user.created_at:
        activities.append({
            "action": "User registered",
            "timestamp": user.created_at.isoformat()
        })
    
    if hasattr(user, 'updated_at') and user.updated_at:
        activities.append({
            "action": f"Status updated to {user.status}",
            "timestamp": user.updated_at.isoformat()
        })
    
    return activities
