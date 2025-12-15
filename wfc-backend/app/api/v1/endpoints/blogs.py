from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.blog import (
    BlogCreate,
    BlogUpdate,
    BlogResponse,
    BlogWithStats,
    BlogViewCreate
)
from app.schemas.common import SuccessResponse
from app.core.constants import BlogStatus
from app.core.exceptions import NotFoundError
from app.models.blog import Blog
from app.models.blog_view import BlogView
from app.models.user import User
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()


@router.post("", response_model=BlogResponse, status_code=status.HTTP_201_CREATED)
async def create_blog(
    blog_data: BlogCreate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Create blog post (Admin only)
    """
    new_blog = Blog(
        title=blog_data.title,
        content=blog_data.content,
        status=blog_data.status,
        featured_image=blog_data.featured_image,
        created_by=current_admin.id
    )
    
    db.add(new_blog)
    db.commit()
    db.refresh(new_blog)
    
    # TODO: If published, send notification to all users
    
    return new_blog


@router.get("", response_model=List[BlogWithStats])
async def get_all_blogs(
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get all published blogs (members see only published)
    """
    query = db.query(Blog).filter(Blog.status == BlogStatus.PUBLISHED)
    
    blogs = query.order_by(Blog.created_at.desc()).all()
    
    result = []
    for blog in blogs:
        # Get view count
        total_views = db.query(BlogView).filter(
            BlogView.blog_id == blog.id
        ).count()
        
        # Check if current user viewed
        user_view = db.query(BlogView).filter(
            BlogView.blog_id == blog.id,
            BlogView.user_id == current_user.id
        ).first()
        
        blog_dict = BlogWithStats.from_orm(blog).dict()
        blog_dict['total_views'] = total_views
        blog_dict['user_has_viewed'] = user_view is not None
        
        result.append(blog_dict)
    
    return result


@router.get("/admin/all", response_model=List[BlogResponse])
async def get_all_blogs_admin(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get all blogs including drafts (Admin only)
    """
    blogs = db.query(Blog).order_by(Blog.created_at.desc()).all()
    return blogs


@router.get("/{blog_id}", response_model=BlogWithStats)
async def get_blog(
    blog_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get blog by ID
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise NotFoundError("Blog")
    
    # Members can only view published blogs
    if blog.status != BlogStatus.PUBLISHED:
        raise NotFoundError("Blog")
    
    # Get view count
    total_views = db.query(BlogView).filter(
        BlogView.blog_id == blog.id
    ).count()
    
    # Check if current user viewed
    user_view = db.query(BlogView).filter(
        BlogView.blog_id == blog.id,
        BlogView.user_id == current_user.id
    ).first()
    
    blog_dict = BlogWithStats.from_orm(blog).dict()
    blog_dict['total_views'] = total_views
    blog_dict['user_has_viewed'] = user_view is not None
    
    return blog_dict


@router.put("/{blog_id}", response_model=BlogResponse)
async def update_blog(
    blog_id: str,
    blog_data: BlogUpdate,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Update blog (Admin only)
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise NotFoundError("Blog")
    
    # Update fields if provided
    if blog_data.title:
        blog.title = blog_data.title
    
    if blog_data.content:
        blog.content = blog_data.content
    
    if blog_data.status:
        blog.status = blog_data.status
    
    if blog_data.featured_image is not None:
        blog.featured_image = blog_data.featured_image
    
    db.commit()
    db.refresh(blog)
    
    return blog


@router.delete("/{blog_id}", response_model=SuccessResponse)
async def delete_blog(
    blog_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Delete blog (Admin only)
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise NotFoundError("Blog")
    
    db.delete(blog)
    db.commit()
    
    return {"message": "Blog deleted successfully", "success": True}


@router.post("/{blog_id}/view", response_model=SuccessResponse)
async def mark_blog_viewed(
    blog_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Mark blog as viewed by current user
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise NotFoundError("Blog")
    
    # Check if already viewed
    existing_view = db.query(BlogView).filter(
        BlogView.blog_id == blog_id,
        BlogView.user_id == current_user.id
    ).first()
    
    if existing_view:
        return {"message": "Blog already marked as viewed", "success": True}
    
    # Create view record
    new_view = BlogView(
        blog_id=blog_id,
        user_id=current_user.id
    )
    
    db.add(new_view)
    db.commit()
    
    return {"message": "Blog marked as viewed", "success": True}


@router.get("/{blog_id}/readers")
async def get_blog_readers(
    blog_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get list of users who read the blog (Admin only)
    """
    blog = db.query(Blog).filter(Blog.id == blog_id).first()
    
    if not blog:
        raise NotFoundError("Blog")
    
    # Get readers
    readers = db.query(User).join(BlogView).filter(
        BlogView.blog_id == blog_id
    ).all()
    
    return {
        "blog_id": str(blog.id),
        "blog_title": blog.title,
        "total_readers": len(readers),
        "readers": [
            {"id": str(user.id), "name": user.full_name, "email": user.email}
            for user in readers
        ]
    }
