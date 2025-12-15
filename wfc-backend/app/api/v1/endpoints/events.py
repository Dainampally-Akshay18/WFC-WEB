from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.session import get_db
from app.schemas.event import (
    EventCreate,
    EventUpdate,
    EventResponse,
    EventWithBranch,
    EventCrossBranchRequest,
    EventCrossBranchApproval
)
from app.schemas.common import SuccessResponse
from app.core.constants import EventCrossBranchStatus
from app.core.exceptions import NotFoundError, PermissionDeniedError, ValidationError
from app.models.event import Event
from app.models.branch import Branch
from app.models.user import User
from app.api.deps import get_current_admin, get_current_user

router = APIRouter()


@router.post("", response_model=EventResponse, status_code=status.HTTP_201_CREATED)
async def create_event(
    event_data: EventCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create event for user's branch
    """
    # Verify branch exists
    branch = db.query(Branch).filter(Branch.id == event_data.branch_id).first()
    if not branch:
        raise ValidationError("Invalid branch ID")
    
    # User can only create events for their own branch
    if str(current_user.branch_id) != str(event_data.branch_id):
        raise PermissionDeniedError("You can only create events for your own branch")
    
    new_event = Event(
        title=event_data.title,
        description=event_data.description,
        event_date=event_data.event_date,
        location=event_data.location,
        event_image=event_data.event_image,
        branch_id=event_data.branch_id,
        created_by=current_user.id,
        is_cross_branch=False,
        cross_branch_status=EventCrossBranchStatus.NONE
    )
    
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    
    return new_event


@router.get("", response_model=List[EventWithBranch])
async def get_events(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get events visible to current user:
    - Their branch events
    - Approved cross-branch events
    """
    # Get user's branch events
    branch_events = db.query(Event, Branch.branch_name, User.full_name).join(
        Branch, Event.branch_id == Branch.id
    ).join(
        User, Event.created_by == User.id
    ).filter(
        Event.branch_id == current_user.branch_id
    ).all()
    
    # Get approved cross-branch events from other branches
    cross_branch_events = db.query(Event, Branch.branch_name, User.full_name).join(
        Branch, Event.branch_id == Branch.id
    ).join(
        User, Event.created_by == User.id
    ).filter(
        Event.branch_id != current_user.branch_id,
        Event.is_cross_branch == True,
        Event.cross_branch_status == EventCrossBranchStatus.APPROVED
    ).all()
    
    # Combine results
    all_events = branch_events + cross_branch_events
    
    result = []
    for event, branch_name, creator_name in all_events:
        event_dict = EventWithBranch.from_orm(event).dict()
        event_dict['branch_name'] = branch_name
        event_dict['creator_name'] = creator_name
        result.append(event_dict)
    
    # Sort by event date
    result.sort(key=lambda x: x['event_date'])
    
    return result


@router.get("/admin/all", response_model=List[EventWithBranch])
async def get_all_events_admin(
    branch_id: str = None,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get all events from all branches (Admin only)
    """
    query = db.query(Event, Branch.branch_name, User.full_name).join(
        Branch, Event.branch_id == Branch.id
    ).join(
        User, Event.created_by == User.id
    )
    
    if branch_id:
        query = query.filter(Event.branch_id == branch_id)
    
    events = query.order_by(Event.event_date).all()
    
    result = []
    for event, branch_name, creator_name in events:
        event_dict = EventWithBranch.from_orm(event).dict()
        event_dict['branch_name'] = branch_name
        event_dict['creator_name'] = creator_name
        result.append(event_dict)
    
    return result


@router.get("/{event_id}", response_model=EventWithBranch)
async def get_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Get event by ID (only if user has access)
    """
    result = db.query(Event, Branch.branch_name, User.full_name).join(
        Branch, Event.branch_id == Branch.id
    ).join(
        User, Event.created_by == User.id
    ).filter(Event.id == event_id).first()
    
    if not result:
        raise NotFoundError("Event")
    
    event, branch_name, creator_name = result
    
    # Check access
    is_same_branch = str(event.branch_id) == str(current_user.branch_id)
    is_approved_cross_branch = (
        event.is_cross_branch and 
        event.cross_branch_status == EventCrossBranchStatus.APPROVED
    )
    
    if not (is_same_branch or is_approved_cross_branch):
        raise PermissionDeniedError("You don't have access to this event")
    
    event_dict = EventWithBranch.from_orm(event).dict()
    event_dict['branch_name'] = branch_name
    event_dict['creator_name'] = creator_name
    
    return event_dict


@router.put("/{event_id}", response_model=EventResponse)
async def update_event(
    event_id: str,
    event_data: EventUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Update event (only event creator can update)
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise NotFoundError("Event")
    
    # Only creator can update
    if str(event.created_by) != str(current_user.id):
        raise PermissionDeniedError("Only event creator can update this event")
    
    # Update fields if provided
    if event_data.title:
        event.title = event_data.title
    
    if event_data.description is not None:
        event.description = event_data.description
    
    if event_data.event_date:
        event.event_date = event_data.event_date
    
    if event_data.location is not None:
        event.location = event_data.location
    
    if event_data.event_image is not None:
        event.event_image = event_data.event_image
    
    db.commit()
    db.refresh(event)
    
    return event


@router.delete("/{event_id}", response_model=SuccessResponse)
async def delete_event(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Delete event (only event creator can delete)
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise NotFoundError("Event")
    
    # Only creator can delete
    if str(event.created_by) != str(current_user.id):
        raise PermissionDeniedError("Only event creator can delete this event")
    
    db.delete(event)
    db.commit()
    
    return {"message": "Event deleted successfully", "success": True}


@router.put("/{event_id}/request-cross-branch", response_model=SuccessResponse)
async def request_cross_branch(
    event_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Request cross-branch visibility for event
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise NotFoundError("Event")
    
    # Only creator can request
    if str(event.created_by) != str(current_user.id):
        raise PermissionDeniedError("Only event creator can request cross-branch visibility")
    
    # Check if already requested or approved
    if event.cross_branch_status != EventCrossBranchStatus.NONE:
        raise ValidationError(f"Event already has cross-branch status: {event.cross_branch_status}")
    
    event.is_cross_branch = True
    event.cross_branch_status = EventCrossBranchStatus.PENDING
    
    db.commit()
    
    # TODO: Send notification to admin
    
    return {"message": "Cross-branch request submitted", "success": True}


@router.put("/{event_id}/approve-cross-branch", response_model=SuccessResponse)
async def approve_cross_branch(
    event_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Approve cross-branch event request (Admin only)
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise NotFoundError("Event")
    
    if event.cross_branch_status != EventCrossBranchStatus.PENDING:
        raise ValidationError("Event is not pending cross-branch approval")
    
    event.cross_branch_status = EventCrossBranchStatus.APPROVED
    db.commit()
    
    # TODO: Send notification to event creator
    
    return {"message": "Cross-branch event approved", "success": True}


@router.put("/{event_id}/reject-cross-branch", response_model=SuccessResponse)
async def reject_cross_branch(
    event_id: str,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Reject cross-branch event request (Admin only)
    """
    event = db.query(Event).filter(Event.id == event_id).first()
    
    if not event:
        raise NotFoundError("Event")
    
    if event.cross_branch_status != EventCrossBranchStatus.PENDING:
        raise ValidationError("Event is not pending cross-branch approval")
    
    event.is_cross_branch = False
    event.cross_branch_status = EventCrossBranchStatus.REJECTED
    db.commit()
    
    # TODO: Send notification to event creator
    
    return {"message": "Cross-branch event rejected", "success": True}


@router.get("/admin/pending-cross-branch", response_model=List[EventWithBranch])
async def get_pending_cross_branch_requests(
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_admin)
):
    """
    Get all pending cross-branch event requests (Admin only)
    """
    events = db.query(Event, Branch.branch_name, User.full_name).join(
        Branch, Event.branch_id == Branch.id
    ).join(
        User, Event.created_by == User.id
    ).filter(
        Event.cross_branch_status == EventCrossBranchStatus.PENDING
    ).all()
    
    result = []
    for event, branch_name, creator_name in events:
        event_dict = EventWithBranch.from_orm(event).dict()
        event_dict['branch_name'] = branch_name
        event_dict['creator_name'] = creator_name
        result.append(event_dict)
    
    return result
