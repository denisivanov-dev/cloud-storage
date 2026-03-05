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

        return result.scalars().first()
    

    @staticmethod
    async def get_by_username(
        db: AsyncSession, username: str,
    ) -> Optional[User]:

        result = await db.execute(
            select(User).where(User.username == username)
        )

        return result.scalars().first()


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