from fastapi import APIRouter, Depends, status
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
from app.core.exceptions import NotFoundError, ConflictError
from app.models.sermon_category import SermonCategory
from app.models.sermon import Sermon
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()


@router.post("", response_model=SermonCategoryResponse, status_code=status.HTTP_201_CREATED)
async def create_category(
    category_data: SermonCategoryCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Create sermon category (Admin only)
    """
    # Check if category already exists
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


@router.get("", response_model=List[SermonCategoryWithCount])
async def get_all_categories(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get all sermon categories with sermon count
    """
    categories = db.query(SermonCategory).all()
    
    result = []
    for category in categories:
        sermon_count = db.query(Sermon).filter(
            Sermon.category_id == category.id
        ).count()
        
        category_dict = SermonCategoryWithCount.from_orm(category).dict()
        category_dict['sermon_count'] = sermon_count
        result.append(category_dict)
    
    return result


@router.get("/{category_id}", response_model=SermonCategoryResponse)
async def get_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Get category by ID
    """
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()
    
    if not category:
        raise NotFoundError("Category")
    
    return category


@router.put("/{category_id}", response_model=SermonCategoryResponse)
async def update_category(
    category_id: str,
    category_data: SermonCategoryUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Update sermon category (Admin only)
    """
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()
    
    if not category:
        raise NotFoundError("Category")
    
    # Update fields if provided
    if category_data.name:
        # Check if new name conflicts
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


@router.delete("/{category_id}", response_model=SuccessResponse)
async def delete_category(
    category_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Delete sermon category (Admin only)
    Only allowed if no sermons use this category
    """
    category = db.query(SermonCategory).filter(
        SermonCategory.id == category_id
    ).first()
    
    if not category:
        raise NotFoundError("Category")
    
    # Check if category is in use
    sermon_count = db.query(Sermon).filter(
        Sermon.category_id == category_id
    ).count()
    
    if sermon_count > 0:
        raise ConflictError(f"Cannot delete category with {sermon_count} sermons")
    
    db.delete(category)
    db.commit()
    
    return {"message": "Category deleted successfully", "success": True}
