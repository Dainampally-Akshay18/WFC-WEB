from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import decode_token
from app.core.constants import UserRole, UserStatus
from app.models.user import User
from app.models.admin import Admin
from app.core.exceptions import AuthenticationError, PermissionDeniedError


security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current authenticated user.
    Validates JWT token and returns user if approved.
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    # Validate token type
    if payload.get("type") != "access":
        raise AuthenticationError("Invalid token type")
    
    user_id = payload.get("sub")
    role = payload.get("role")
    
    # Verify role is member
    if role != UserRole.MEMBER:
        raise AuthenticationError("Invalid user role")
    
    # Fetch user from database
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise AuthenticationError("User not found")
    
    # Check if user is approved
    if user.status != UserStatus.APPROVED:
        raise PermissionDeniedError("Account pending approval or revoked")
    
    return user


def get_current_admin(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
) -> Admin:
    """
    Get current authenticated admin.
    Validates JWT token and returns admin if active.
    """
    token = credentials.credentials
    payload = decode_token(token)
    
    # Validate token type
    if payload.get("type") != "access":
        raise AuthenticationError("Invalid token type")
    
    admin_id = payload.get("sub")
    role = payload.get("role")
    
    # Verify role is admin
    if role != UserRole.ADMIN:
        raise PermissionDeniedError("Admin access required")
    
    # Fetch admin from database
    admin = db.query(Admin).filter(
        Admin.id == admin_id,
        Admin.is_active == True
    ).first()
    
    if not admin:
        raise AuthenticationError("Admin not found or inactive")
    
    return admin


def get_current_user_optional(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Optional[User]:
    """
    Get current user if authenticated, otherwise None.
    Useful for endpoints that work with/without authentication.
    """
    if not credentials:
        return None
    
    try:
        return get_current_user(credentials, db)
    except:
        return None


def verify_branch_access(
    user: User = Depends(get_current_user),
    resource_branch_id: str = None
) -> bool:
    """
    Verify user has access to branch-specific resource.
    Returns True if user belongs to the same branch.
    """
    if resource_branch_id and str(user.branch_id) != resource_branch_id:
        raise PermissionDeniedError("Access denied to this branch resource")
    return True
