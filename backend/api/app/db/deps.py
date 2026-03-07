from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import SessionLocal
from app.core import security
from app.repository.user_repository import UserRepository

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


async def get_db() -> AsyncSession:
    async with SessionLocal() as session:
        yield session


async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db),
):
    payload = security.decode_token(token)

    if payload is None:
        raise HTTPException(401, "Invalid token")

    user_id = payload.get("sub")

    if not user_id:
        raise HTTPException(401, "Invalid token")


    user = await UserRepository.get_by_id(db, int(user_id))

    if not user:
        raise HTTPException(401, "User not found")

    return user