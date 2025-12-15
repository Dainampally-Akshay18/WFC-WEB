from datetime import datetime, timedelta
from typing import Optional
import pytz


def utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.utcnow()


def format_datetime(dt: datetime, format_string: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format datetime to string"""
    return dt.strftime(format_string)


def parse_datetime(date_string: str, format_string: str = "%Y-%m-%d %H:%M:%S") -> Optional[datetime]:
    """Parse string to datetime"""
    try:
        return datetime.strptime(date_string, format_string)
    except ValueError:
        return None


def add_days(dt: datetime, days: int) -> datetime:
    """Add days to datetime"""
    return dt + timedelta(days=days)


def add_hours(dt: datetime, hours: int) -> datetime:
    """Add hours to datetime"""
    return dt + timedelta(hours=hours)


def days_between(start: datetime, end: datetime) -> int:
    """Calculate days between two datetimes"""
    return (end - start).days


def is_past(dt: datetime) -> bool:
    """Check if datetime is in the past"""
    return dt < utc_now()


def is_future(dt: datetime) -> bool:
    """Check if datetime is in the future"""
    return dt > utc_now()


def convert_to_timezone(dt: datetime, timezone_name: str = "Asia/Kolkata") -> datetime:
    """Convert UTC datetime to specific timezone"""
    if dt.tzinfo is None:
        dt = pytz.utc.localize(dt)
    
    target_tz = pytz.timezone(timezone_name)
    return dt.astimezone(target_tz)


def time_ago(dt: datetime) -> str:
    """
    Get human-readable time ago string
    Example: "2 hours ago", "3 days ago"
    """
    now = utc_now()
    diff = now - dt
    
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return "just now"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes} minute{'s' if minutes > 1 else ''} ago"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    elif seconds < 604800:
        days = int(seconds / 86400)
        return f"{days} day{'s' if days > 1 else ''} ago"
    elif seconds < 2592000:
        weeks = int(seconds / 604800)
        return f"{weeks} week{'s' if weeks > 1 else ''} ago"
    elif seconds < 31536000:
        months = int(seconds / 2592000)
        return f"{months} month{'s' if months > 1 else ''} ago"
    else:
        years = int(seconds / 31536000)
        return f"{years} year{'s' if years > 1 else ''} ago"
