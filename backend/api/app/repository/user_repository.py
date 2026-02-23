from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import Optional

from app.db.models.user import User


class UserRepository:

    @staticmethod
    async def get_by_email(
        db: AsyncSession, email: str,
    ) -> Optional[User]:

        result = await db.execute(
            select(User).where(User.email == email)
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def create_user(
        db: AsyncSession, *, username: str,
        email: str, hashed_password: str,
    ) -> User:

        new_user = User(
            email=email,
            username=username,
            hashed_password=hashed_password,
        )

        db.add(new_user)

        await db.commit()
        await db.refresh(new_user)

        return new_user