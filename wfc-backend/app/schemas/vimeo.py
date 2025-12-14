from pydantic import BaseModel, Field
from typing import Optional


class VimeoUploadRequest(BaseModel):
    """Request Vimeo upload URL"""
    file_size: int = Field(..., gt=0, description="File size in bytes")
    file_name: str = Field(..., min_length=1, max_length=255)


class VimeoUploadResponse(BaseModel):
    """Vimeo upload URL response"""
    upload_link: str
    video_id: str
    embed_url: str


class VimeoVideoDetails(BaseModel):
    """Vimeo video details"""
    video_id: str
    embed_url: str
    thumbnail_url: Optional[str]
    duration: Optional[str]
    status: str  # available, uploading, processing


class VimeoDeleteRequest(BaseModel):
    """Delete Vimeo video"""
    video_id: str
