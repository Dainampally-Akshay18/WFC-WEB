from typing import Optional, Dict, Any
import json


def format_file_size(size_bytes: int) -> str:
    """Format bytes to human-readable size"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} PB"


def format_currency(amount: float, currency: str = "INR") -> str:
    """Format amount as currency"""
    if currency == "INR":
        return f"₹{amount:,.2f}"
    elif currency == "USD":
        return f"${amount:,.2f}"
    else:
        return f"{amount:,.2f} {currency}"


def format_phone(phone: str, country_code: str = "+91") -> str:
    """Format phone number"""
    # Remove all non-numeric characters
    digits = ''.join(filter(str.isdigit, phone))
    
    if len(digits) == 10:
        return f"{country_code} {digits[:5]} {digits[5:]}"
    
    return phone


def format_name(first_name: str, last_name: Optional[str] = None) -> str:
    """Format full name"""
    if last_name:
        return f"{first_name.strip()} {last_name.strip()}"
    return first_name.strip()


def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate text to max_length with suffix"""
    if len(text) <= max_length:
        return text
    
    return text[:max_length - len(suffix)].rstrip() + suffix


def json_safe(obj: Any) -> str:
    """Convert object to JSON-safe string"""
    try:
        return json.dumps(obj, default=str, indent=2)
    except Exception as e:
        return str(obj)


def mask_email(email: str) -> str:
    """Mask email for privacy (e.g., j***@example.com)"""
    if '@' not in email:
        return email
    
    local, domain = email.split('@')
    
    if len(local) <= 2:
        masked_local = local[0] + '*'
    else:
        masked_local = local[0] + '*' * (len(local) - 2) + local[-1]
    
    return f"{masked_local}@{domain}"


def format_percentage(value: float, decimal_places: int = 2) -> str:
    """Format number as percentage"""
    return f"{value:.{decimal_places}f}%"
