from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from datetime import datetime
from app.db.session import get_db
from app.schemas.auth import AdminLogin, TokenResponse
from app.schemas.admin import AdminCreate, AdminResponse
from app.schemas.common import SuccessResponse
from app.core.security import (
    verify_password,
    create_access_token,
    create_refresh_token,
    get_password_hash,
    validate_password_strength
)
from app.core.constants import UserRole
from app.core.exceptions import AuthenticationError, ConflictError, ValidationError
from app.models.admin import Admin
from app.api.deps import get_current_admin

router = APIRouter()


@router.post("/create", response_model=AdminResponse, status_code=status.HTTP_201_CREATED)
async def create_admin(
    admin_data: AdminCreate,
    db: Session = Depends(get_db)
):
    """
    Create admin account (Pastor).
    WARNING: This should be protected or disabled after initial setup.
    In production, add authentication or disable this endpoint.
    """
    # Check if admin with email already exists
    existing_admin = db.query(Admin).filter(Admin.email == admin_data.email).first()
    if existing_admin:
        raise ConflictError("Admin with this email already exists")
    
    # Validate password strength
    is_valid, error_msg = validate_password_strength(admin_data.password)
    if not is_valid:
        raise ValidationError(error_msg)
    
    # Create admin
    new_admin = Admin(
        email=admin_data.email,
        password_hash=get_password_hash(admin_data.password),
        display_name=admin_data.display_name,
        is_active=True
    )
    
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    
    return new_admin


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


@router.put("/password", response_model=SuccessResponse)
async def change_admin_password(
    password_data: AdminLogin,  # Reusing for simplicity, or create AdminPasswordChange
    current_admin: Admin = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    """
    Change admin password
    """
    from app.schemas.auth import PasswordChange
    
    # Validate password strength
    is_valid, error_msg = validate_password_strength(password_data.password)
    if not is_valid:
        raise ValidationError(error_msg)
    
    # Update password
    current_admin.password_hash = get_password_hash(password_data.password)
    db.commit()
    
    return {"message": "Admin password changed successfully", "success": True}
