from datetime import datetime, timezone

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.refresh_token import RefreshToken


class RefreshTokenRepository:

    @staticmethod
    async def insert_token(
        db: AsyncSession, jti: str,
        user_id: int, expires_at: datetime,
        last_used_at: datetime,
    ) -> None:

        new_token = RefreshToken(
            jti=jti, user_id=user_id,
            expires_at=expires_at,
            last_used_at=last_used_at
        )

        db.add(new_token)
        await db.commit()


    @staticmethod
    async def get_by_jti(
        db: AsyncSession, jti: str,
    ) -> RefreshToken | None:

        result = await db.execute(
            select(RefreshToken).where(RefreshToken.jti == jti)
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def update_last_used(
        db: AsyncSession, jti: str,
        last_used_at: datetime,
    ) -> None:

        await db.execute(
            update(RefreshToken)
            .where(RefreshToken.jti == jti)
            .values(last_used_at=last_used_at)
        )

        await db.commit()