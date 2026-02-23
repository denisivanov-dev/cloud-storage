import re
from typing import Optional


def validate_email(email: str) -> Optional[str]:
    if not email:
        return "Email is required"

    email_regex = r"^[^\s@]+@[^\s@]+\.[^\s@]+$"
    if not re.match(email_regex, email):
        return "Invalid email format"

    return None


def validate_username(username: str) -> Optional[str]:
    if not username:
        return "Nickname is required"

    if len(username) < 3:
        return "Nickname must be at least 3 characters"

    if len(username) > 20:
        return "Nickname must be under 20 characters"

    if not re.match(r"^[a-zA-Z0-9_]+$", username):
        return "Only letters, numbers and underscores allowed"

    return None


def validate_password(password: str) -> Optional[str]:
    if not password:
        return "Password is required"

    if len(password) < 8:
        return "Password must be at least 8 characters"

    if not re.search(r"[A-Z]", password):
        return "Must contain at least one uppercase letter"

    if not re.search(r"[0-9]", password):
        return "Must contain at least one number"

    if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
        return "Must contain at least one special character"

    return None