from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession


async def handle_user_integrity_error(e: IntegrityError, db: AsyncSession):
    await db.rollback()

    constraint = getattr(e.orig.diag, "constraint_name", "")

    if constraint == "uq_users_email":
        raise HTTPException(
            status_code=400,
            detail={"email": "Email already registered"},
        )

    if constraint == "uq_users_username":
        raise HTTPException(
            status_code=400,
            detail={"username": "Username already taken"},
        )

    if constraint == "uq_users_google_id":
        raise HTTPException(
            status_code=400,
            detail={"form": "Google account already linked"},
        )

    raise HTTPException(
        status_code=400,
        detail={"form": "Database constraint error"},
    )