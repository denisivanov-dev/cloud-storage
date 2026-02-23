from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException, status

from app.schemas import auth
from app.db.models.user import User
from app.core.security import hash_password
from app.core.validators.auth_validators import (
    validate_email,
    validate_username,
    validate_password
)

from app.repository.user_repository import UserRepository


async def register_user(
    data: auth.RegisterRequest,
    db: AsyncSession,
):
    email_error = validate_email(data.email)
    username_error = validate_username(data.username)
    password_error = validate_password(data.password)

    if email_error or username_error or password_error:
        errors = {}

        if email_error:
            errors["email"] = email_error

        if username_error:
            errors["password"] = username_error

        if password_error:
            errors["password"] = password_error

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=errors,
        )
    

    existing_user = await UserRepository.get_by_email(db, data.email)
    if existing_user is not None:
        raise HTTPException(
            status_code=400,
            detail="User already exists",
        )
    
    hashed_password = hash_password(data.password)
    
    await UserRepository.create_user(
        db, email=data.email,
        username=data.username, hashed_password=hashed_password,
    )

    return {"message": "User created successfully"}

    

    




