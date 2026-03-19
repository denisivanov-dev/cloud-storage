from datetime import datetime, timezone

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.schemas import auth
from app.core import security
from app.core.validators.auth_validators import (
    validate_username,
    validate_password
)
from app.core.errors.db_errors import handle_user_integrity_error
from app.core.errors.auth_errors import ValidationError, InvalidCredentialsError
from app.repository.user_repository import UserRepository
from app.repository.refresh_token_repository import RefreshTokenRepository


async def _store_refresh_token(refresh_token: str, db: AsyncSession):
    payload = security.decode_token(refresh_token)

    now = datetime.now(timezone.utc)

    jti = payload["jti"]
    user_id = int(payload["sub"])
    expires_at = datetime.fromtimestamp(payload["exp"], tz=timezone.utc)

    await RefreshTokenRepository.insert_token(
        db, jti=jti,
        user_id=user_id, expires_at=expires_at,
        last_used_at=now,
    )


async def login_user(data: auth.LoginRequest, db: AsyncSession):
    email = data.email.strip().lower()
    
    if not data.password:
        raise ValidationError({"password": "Password is required"})

    user = await UserRepository.get_by_email(db, email)

    if not user:
        raise InvalidCredentialsError({"email": "User does not exist"})

    if not security.verify_password(data.password, user.hashed_password):
        raise InvalidCredentialsError({"password": "Invalid password"})

    access_token = security.create_access_token(user.id)
    refresh_token = security.create_refresh_token(user.id)

    await _store_refresh_token(refresh_token, db)

    return access_token, refresh_token


async def register_user(data: auth.RegisterRequest, db: AsyncSession):
    email = data.email.strip().lower()
    username = data.username.strip().lower()

    username_error = validate_username(username)
    password_error = validate_password(data.password)

    if username_error or password_error:
        errors = {}
        if username_error:
            errors["username"] = username_error
        if password_error:
            errors["password"] = password_error
        raise ValidationError(errors)

    if await UserRepository.get_by_email(db, email):
        raise ValidationError({"email": "Email already registered"})

    if await UserRepository.get_by_username(db, username):
        raise ValidationError({"username": "Username already taken"})

    hashed_password = security.hash_password(data.password)

    try:
        user = await UserRepository.create_user(
            db, email=email,
            username=username, hashed_password=hashed_password,
        )
    except IntegrityError as e:
        await handle_user_integrity_error(e, db)

    access_token = security.create_access_token(user.id)
    refresh_token = security.create_refresh_token(user.id)

    await _store_refresh_token(refresh_token, db)

    return access_token, refresh_token


async def refresh_access_token(refresh_token: str, db: AsyncSession):
    payload = security.decode_token(refresh_token)

    jti = payload["jti"]
    user_id = int(payload["sub"])

    db_token = await RefreshTokenRepository.get_by_jti(db, jti)

    if not db_token:
        raise InvalidCredentialsError({"refresh": "Invalid refresh token"})
    
    now = datetime.now(timezone.utc)

    if db_token.expires_at < now:
        raise InvalidCredentialsError({"refresh": "Refresh token expired"})

    if db_token.revoked:
        raise InvalidCredentialsError({"refresh": "Refresh token revoked"})

    await RefreshTokenRepository.update_last_used(db, jti, now)

    new_access = security.create_access_token(user_id)

    return new_access