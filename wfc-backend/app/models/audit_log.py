from sqlalchemy import Column, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base import BaseModel


class AuditLog(BaseModel):
    """Audit log model - tracks admin actions"""
    __tablename__ = "audit_logs"
    
    action = Column(String(100), nullable=False)  # e.g., "user_approved", "sermon_deleted"
    resource = Column(String(100), nullable=False)  # e.g., "user", "sermon"
    resource_id = Column(String(100), nullable=True)  # ID of affected resource
    details = Column(Text, nullable=True)  # Human-readable description
    payload = Column(JSONB, nullable=True)  # Additional metadata
    
    # Foreign Keys
    admin_id = Column(UUID(as_uuid=True), ForeignKey("admins.id"), nullable=False)
    
    # Relationships
    admin = relationship("Admin", back_populates="audit_logs")
    
    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource}>"
