from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import UserRegister, UserLogin, TokenResponse
from app.schemas.user import UserResponse
from app.core.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    create_refresh_token,
    validate_password_strength
)
from app.core.constants import UserRole, UserStatus
from app.core.exceptions import ConflictError, AuthenticationError, ValidationError
from app.models.user import User
from app.models.branch import Branch
from app.api.deps import get_current_user

router = APIRouter()


@router.post("/signup", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def signup(
    user_data: UserRegister,
    db: Session = Depends(get_db)
):
    """
    Register new user - account will be in pending status until admin approves
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise ConflictError("Email already registered")
    
    # Validate password strength
    is_valid, error_msg = validate_password_strength(user_data.password)
    if not is_valid:
        raise ValidationError(error_msg)
    
    # Verify branch exists
    branch = db.query(Branch).filter(Branch.id == user_data.branch_id).first()
    if not branch:
        raise ValidationError("Invalid branch ID")
    
    # Create user
    new_user = User(
        email=user_data.email,
        full_name=user_data.full_name,
        password_hash=get_password_hash(user_data.password),
        branch_id=user_data.branch_id,
        status=UserStatus.PENDING
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return new_user


@router.post("/login", response_model=TokenResponse)
async def login(
    credentials: UserLogin,
    db: Session = Depends(get_db)
):
    """
    Member login - returns access and refresh tokens
    """
    # Find user by email
    user = db.query(User).filter(User.email == credentials.email).first()
    
    if not user:
        raise AuthenticationError("Invalid email or password")
    
    # Verify password
    if not verify_password(credentials.password, user.password_hash):
        raise AuthenticationError("Invalid email or password")
    
    # Check if user is approved
    if user.status != UserStatus.APPROVED:
        if user.status == UserStatus.PENDING:
            raise AuthenticationError("Account pending approval")
        else:
            raise AuthenticationError("Account has been revoked")
    
    # Create tokens
    token_data = {
        "sub": str(user.id),
        "role": UserRole.MEMBER,
        "branch_id": str(user.branch_id)
    }
    
    access_token = create_access_token(token_data)
    refresh_token = create_refresh_token(token_data)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user)):
    """
    Member logout - client should delete tokens
    """
    # In a production app, you'd add token to blacklist here
    return {"message": "Logged out successfully"}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Get current logged-in user information
    """
    return current_user
