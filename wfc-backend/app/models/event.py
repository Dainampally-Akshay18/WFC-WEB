from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import BaseModel
from app.core.constants import EventCrossBranchStatus


class Event(BaseModel):
    """Event model - branch and cross-branch events"""
    __tablename__ = "events"
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    event_date = Column(DateTime, nullable=False)
    location = Column(String(255), nullable=True)
    event_image = Column(String(500), nullable=True)
    
    is_cross_branch = Column(Boolean, default=False, nullable=False)
    cross_branch_status = Column(
        String(50), 
        default=EventCrossBranchStatus.NONE, 
        nullable=False
    )
    
    # Foreign Keys
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id"), nullable=False)
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Relationships
    branch = relationship("Branch", back_populates="events")
    creator = relationship("User", back_populates="created_events")
    
    def __repr__(self):
        return f"<Event {self.title} - Branch: {self.branch_id}>"
