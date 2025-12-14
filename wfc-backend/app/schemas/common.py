from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from uuid import UUID


class SuccessResponse(BaseModel):
    """Generic success response"""
    message: str
    success: bool = True


class ErrorResponse(BaseModel):
    """Generic error response"""
    detail: str
    success: bool = False


class PaginationParams(BaseModel):
    """Pagination parameters"""
    page: int = 1
    page_size: int = 20
    
    class Config:
        from_attributes = True


class PaginatedResponse(BaseModel):
    """Generic paginated response"""
    items: list
    total: int
    page: int
    page_size: int
    total_pages: int
    
    class Config:
        from_attributes = True
