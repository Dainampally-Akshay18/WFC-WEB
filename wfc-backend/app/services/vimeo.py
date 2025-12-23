# app/services/vimeo.py

import httpx
from fastapi import UploadFile
from app.core.config import settings

VIMEO_UPLOAD_URL = "https://api.vimeo.com/me/videos"

async def upload_video_to_vimeo(
    file: UploadFile,
    title: str,
    description: str,
) -> dict:
    """
    Upload a video file to Vimeo and return metadata.
    """
    headers = {
        "Authorization": f"bearer {settings.VIMEO_ACCESS_TOKEN}",
        "Accept": "application/vnd.vimeo.*+json;version=3.4",
    }

    async with httpx.AsyncClient(timeout=600) as client:
        files = {
            "file_data": (file.filename, await file.read(), file.content_type),
        }
        data = {
            "name": title,
            "description": description,
        }

        resp = await client.post(VIMEO_UPLOAD_URL, headers=headers, files=files, data=data)
        resp.raise_for_status()
        payload = resp.json()

    # Extract metadata (adapt to actual Vimeo response)
    video_uri = payload.get("uri", "")  # e.g. "/videos/123456789"
    video_id = video_uri.split("/")[-1] if video_uri else None
    embed_url = f"https://player.vimeo.com/video/{video_id}" if video_id else None
    pictures = payload.get("pictures", {})
    sizes = pictures.get("sizes", []) if pictures else []
    thumbnail_url = sizes[-1]["link"] if sizes else None
    duration = payload.get("duration", 0)

    return {
        "video_id": video_id,
        "embed_url": embed_url,
        "thumbnail_url": thumbnail_url,
        "duration": duration or 0,
    }
