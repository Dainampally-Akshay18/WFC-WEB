from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    admin_auth,
    users,
    sermons,
    sermon_categories,
    blogs,
    events,
    prayers,
    notifications,
    profile,
    vimeo,
    dashboard
)

api_router = APIRouter()

# Authentication routes
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication - Members"]
)

api_router.include_router(
    admin_auth.router,
    prefix="/admin",
    tags=["Authentication - Admin"]
)

# User management routes
api_router.include_router(
    users.router,
    prefix="/users",
    tags=["User Management"]
)

# Profile routes
api_router.include_router(
    profile.router,
    prefix="/profile",
    tags=["User Profile"]
)

# Sermon routes
api_router.include_router(
    sermon_categories.router,
    prefix="/sermon-categories",
    tags=["Sermon Categories"]
)

api_router.include_router(
    sermons.router,
    prefix="/sermons",
    tags=["Sermons"]
)

# Blog routes
api_router.include_router(
    blogs.router,
    prefix="/blogs",
    tags=["Blogs - Pastor's Pen"]
)

# Event routes
api_router.include_router(
    events.router,
    prefix="/events",
    tags=["Events"]
)

# Prayer request routes
api_router.include_router(
    prayers.router,
    prefix="/prayers",
    tags=["Prayer Requests"]
)

# Notification routes
api_router.include_router(
    notifications.router,
    prefix="/notifications",
    tags=["Notifications"]
)

# Vimeo integration routes
api_router.include_router(
    vimeo.router,
    prefix="/vimeo",
    tags=["Vimeo Integration"]
)

# Admin dashboard routes
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Admin Dashboard"]
)
