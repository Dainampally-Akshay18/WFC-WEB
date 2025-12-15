from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.vimeo import (
    VimeoUploadRequest,
    VimeoUploadResponse,
    VimeoVideoDetails,
    VimeoDeleteRequest
)
from app.schemas.common import SuccessResponse
from app.core.exceptions import VimeoServiceError
from app.api.deps import get_current_admin
import vimeo
from app.core.config import settings

router = APIRouter()

# Initialize Vimeo client
vimeo_client = vimeo.VimeoClient(
    token=settings.VIMEO_ACCESS_TOKEN,
    key=settings.VIMEO_CLIENT_ID,
    secret=settings.VIMEO_CLIENT_SECRET
)


@router.post("/upload-url", response_model=VimeoUploadResponse)
async def get_upload_url(
    upload_request: VimeoUploadRequest,
    current_admin = Depends(get_current_admin)
):
    """
    Get Vimeo upload URL for video upload (Admin only)
    Returns tus upload endpoint for frontend to upload video directly
    """
    try:
        # Create video placeholder on Vimeo
        response = vimeo_client.upload(
            None,  # No file, just getting upload link
            data={
                'name': upload_request.file_name,
                'upload': {
                    'approach': 'tus',
                    'size': upload_request.file_size
                }
            }
        )
        
        # Extract upload link and video URI
        upload_link = response.get('upload', {}).get('upload_link')
        video_uri = response.get('uri')
        video_id = video_uri.split('/')[-1]
        
        # Generate embed URL
        embed_url = f"https://player.vimeo.com/video/{video_id}"
        
        return {
            "upload_link": upload_link,
            "video_id": video_id,
            "embed_url": embed_url
        }
    
    except Exception as e:
        raise VimeoServiceError(f"Failed to get upload URL: {str(e)}")


@router.get("/videos/{video_id}", response_model=VimeoVideoDetails)
async def get_video_details(
    video_id: str,
    current_admin = Depends(get_current_admin)
):
    """
    Get video details from Vimeo (Admin only)
    """
    try:
        response = vimeo_client.get(f'/videos/{video_id}')
        
        if response.status_code != 200:
            raise VimeoServiceError("Video not found on Vimeo")
        
        data = response.json()
        
        # Extract thumbnail
        thumbnail_url = None
        if data.get('pictures') and data['pictures'].get('sizes'):
            thumbnail_url = data['pictures']['sizes'][-1]['link']
        
        # Extract duration
        duration = data.get('duration')
        duration_str = f"{duration // 60}:{duration % 60:02d}" if duration else None
        
        return {
            "video_id": video_id,
            "embed_url": f"https://player.vimeo.com/video/{video_id}",
            "thumbnail_url": thumbnail_url,
            "duration": duration_str,
            "status": data.get('status', 'unknown')
        }
    
    except Exception as e:
        raise VimeoServiceError(f"Failed to get video details: {str(e)}")


@router.delete("/videos/{video_id}", response_model=SuccessResponse)
async def delete_video(
    video_id: str,
    current_admin = Depends(get_current_admin)
):
    """
    Delete video from Vimeo (Admin only)
    """
    try:
        response = vimeo_client.delete(f'/videos/{video_id}')
        
        if response.status_code not in [200, 204]:
            raise VimeoServiceError("Failed to delete video from Vimeo")
        
        return {"message": f"Video {video_id} deleted from Vimeo", "success": True}
    
    except Exception as e:
        raise VimeoServiceError(f"Failed to delete video: {str(e)}")
