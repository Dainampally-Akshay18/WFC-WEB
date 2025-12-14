from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.session import get_db
from app.schemas.auth import AdminLogin, TokenResponse
from app.schemas.admin import AdminResponse
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token
)
from app.core.constants import UserRole
from app.core.exceptions import AuthenticationError
from app.models.admin import Admin
from app.api.deps import get_current_admin

router = APIRouter()


@router.post("/login", response_model=TokenResponse)
async def admin_login(
    credentials: AdminLogin,
    db: Session = Depends(get_db)
):
    """
    Admin/Pastor login - returns access and refresh tokens
    """
    # Find admin by email
    admin = db.query(Admin).filter(Admin.email == credentials.email).first()
    
    if not admin:
        raise AuthenticationError("Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, admin.password_hash):
        raise AuthenticationError("Invalid email or password")
    
    # Check if admin is active
    if not admin.is_active:
        raise AuthenticationError("Admin account is inactive")
    
    # Update last login
    admin.last_login = datetime.utcnow()
    db.commit()
    
    # Create tokens
    token_data = {
        "sub": str(admin.id),
        "role": UserRole.ADMIN
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/logout")
async def admin_logout(current_admin: Admin = Depends(get_current_admin)):
    """
    Admin logout - client should delete tokens
    """
    return {"message": "Admin logged out successfully"}


@router.get("/me", response_model=AdminResponse)
async def get_current_admin_info(current_admin: Admin = Depends(get_current_admin)):
    """
    Get current logged-in admin information
    """
    return current_admin
