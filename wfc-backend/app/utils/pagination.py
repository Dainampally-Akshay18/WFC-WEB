from typing import List, TypeVar, Generic
from pydantic import BaseModel
from sqlalchemy.orm import Query
from app.core.constants import DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE, MIN_PAGE_SIZE

T = TypeVar('T')


class PaginatedResponse(BaseModel, Generic[T]):
    """Generic paginated response"""
    items: List[T]
    total: int
    page: int
    page_size: int
    total_pages: int
    has_next: bool
    has_previous: bool
    
    class Config:
        from_attributes = True


def paginate(
    query: Query,
    page: int = 1,
    page_size: int = DEFAULT_PAGE_SIZE,
    schema_class = None
) -> dict:
    """
    Paginate SQLAlchemy query
    
    Args:
        query: SQLAlchemy query object
        page: Page number (1-indexed)
        page_size: Number of items per page
        schema_class: Pydantic schema to serialize items (optional)
    
    Returns:
        Dictionary with pagination data
    """
    # Validate page and page_size
    page = max(MIN_PAGE_SIZE, page)
    page_size = min(MAX_PAGE_SIZE, max(MIN_PAGE_SIZE, page_size))
    
    # Get total count
    total = query.count()
    
    # Calculate total pages
    total_pages = (total + page_size - 1) // page_size
    
    # Ensure page is within bounds
    page = min(page, total_pages) if total_pages > 0 else 1
    
    # Get items for current page
    offset = (page - 1) * page_size
    items = query.offset(offset).limit(page_size).all()
    
    # Serialize items if schema provided
    if schema_class:
        items = [schema_class.from_orm(item) for item in items]
    
    return {
        "items": items,
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
        "has_next": page < total_pages,
        "has_previous": page > 1
    }
