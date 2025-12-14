from sqlalchemy import Column, String, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import BaseModel
from app.core.constants import MediaType


class MediaAsset(BaseModel):
    """Media asset model - tracks uploaded images"""
    __tablename__ = "media_assets"
    
    url = Column(String(500), nullable=False)
    media_type = Column(String(50), nullable=False)  # profile, event, blog
    file_name = Column(String(255), nullable=True)
    cloudinary_public_id = Column(String(255), nullable=True)  # For deletion
    
    # Foreign Keys (nullable - could be user or admin)
    uploaded_by_user = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    uploaded_by_admin = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=True)
    
    def __repr__(self):
        return f"<MediaAsset {self.media_type} - {self.file_name}>"
