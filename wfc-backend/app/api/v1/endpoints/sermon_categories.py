from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List

from app.db.session import get_db
from app.schemas.sermon_category import (
    SermonCategoryCreate,
    SermonCategoryUpdate,
    SermonCategoryResponse,
    SermonCategoryWithCount
)
from app.schemas.common import SuccessResponse
from app.core.exceptions import NotFoundError, ConflictError, AuthenticationError
from app.core.security import decode_token
from app.core.constants import UserRole

from app.models.sermon_category import SermonCategory
from app.models.sermon import Sermon
from app.api.deps import get_current_admin

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
    - Approved USER
    - Active ADMIN

    Used ONLY for READ operations
    """
    payload = decode_token(credentials.credentials)

    if payload.get("type") != "access":
        raise AuthenticationError("Invalid token type")

    role = payload.get("role")

    if role not in (UserRole.MEMBER, UserRole.ADMIN):
        raise AuthenticationError("Invalid role")

    return payload


# =========================================================
# CREATE CATEGORY (ADMIN ONLY)
# =========================================================
@router.post("", response_model=SermonCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: SermonCategoryCreate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    existing = db.query(SermonCategory).filter(
        SermonCategory.name == category_data.name
    ).first()

    if existing:
        raise ConflictError("Category with this name already exists")

    new_category = SermonCategory(
        name=category_data.name,
        description=category_data.description
    )

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category


# =========================================================
# GET ALL CATEGORIES (USER + ADMIN)
# =========================================================
@router.get("", response_model=List[SermonCategoryWithCount])
async def get_all_categories(
    db: Session = Depends(get_db),
    actor = Depends(get_current_actor),
):
    categories = db.query(SermonCategory).all()
    result = []

    for category in categories:
        sermon_count = db.query(Sermon).filter(
            Sermon.category_id == category.id
        ).count()

        # Build the response dict manually instead of using from_orm
        category_dict = {
            "id": str(category.id),
            "name": category.name,
            "description": category.description,
            "created_at": category.created_at,
            "updated_at": category.updated_at,
            "sermon_count": sermon_count,
        }

        result.append(category_dict)

    return result


# =========================================================
# GET CATEGORY BY ID (USER + ADMIN)
# =========================================================
@router.get("/{category_id}", response_model=SermonCategoryResponse)
async def get_category(
    category_id: str,
    db: Session = Depends(get_db),
    actor=Depends(get_current_actor)
):
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()

    if not category:
        raise NotFoundError("Category")

    return category


# =========================================================
# UPDATE CATEGORY (ADMIN ONLY)
# =========================================================
@router.put("/{category_id}", response_model=SermonCategoryResponse)
async def update_category(
    category_id: str,
    category_data: SermonCategoryUpdate,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()

    if not category:
        raise NotFoundError("Category")

    if category_data.name:
        existing = db.query(SermonCategory).filter(
            SermonCategory.name == category_data.name,
            SermonCategory.id != category_id
        ).first()

        if existing:
            raise ConflictError("Category with this name already exists")

        category.name = category_data.name

    if category_data.description is not None:
        category.description = category_data.description

    db.commit()
    db.refresh(category)

    return category


# =========================================================
# DELETE CATEGORY (ADMIN ONLY)
# =========================================================
@router.delete("/{category_id}", response_model=SuccessResponse)
async def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_admin=Depends(get_current_admin)
):
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()

    if not category:
        raise NotFoundError("Category")

    sermon_count = db.query(Sermon).filter(
        Sermon.category_id == category_id
    ).count()

    if sermon_count > 0:
        raise ConflictError(
            f"Cannot delete category with {sermon_count} sermons"
        )

    db.delete(category)
    db.commit()

    return {
        "message": "Category deleted successfully",
        "success": True
    }
