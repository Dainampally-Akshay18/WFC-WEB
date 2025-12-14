from enum import Enum


class UserStatus(str, Enum):
    """User account status"""
    PENDING = "pending"
    APPROVED = "approved"
    REVOKED = "revoked"


class UserRole(str, Enum):
    """User role types"""
    ADMIN = "admin"
    MEMBER = "member"


class EventCrossBranchStatus(str, Enum):
    """Cross-branch event approval status"""
    NONE = "none"
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"


class NotificationType(str, Enum):
    """Notification types"""
    SERMON_UPLOADED = "sermon_uploaded"
    BLOG_PUBLISHED = "blog_published"
    EVENT_APPROVED = "event_approved"
    USER_APPROVED = "user_approved"
    PRAYER_RESPONSE = "prayer_response"
    CROSS_BRANCH_REQUEST = "cross_branch_request"


class MediaType(str, Enum):
    """Media asset types"""
    PROFILE = "profile"
    EVENT = "event"
    BLOG = "blog"


class BlogStatus(str, Enum):
    """Blog publication status"""
    DRAFT = "draft"
    PUBLISHED = "published"


# Pagination defaults
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100
MIN_PAGE_SIZE = 1

# Branch names (will be seeded in database)
BRANCH_1_NAME = "Branch 1"
BRANCH_2_NAME = "Branch 2"

# Sermon categories (examples)
DEFAULT_SERMON_CATEGORIES = [
    "Sunday Service",
    "Bible Study",
    "Youth Service",
    "Special Event",
    "Prayer Meeting"
]
