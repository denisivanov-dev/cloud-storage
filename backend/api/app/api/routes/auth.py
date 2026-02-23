from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import auth as auth_schemas
from app.services import auth_service
from app.db.deps import get_db

router = APIRouter(tags=["auth"])


@router.post("/register", response_model=auth_schemas.RegisterResponse)
async def register(
    data: auth_schemas.RegisterRequest,
    db: AsyncSession = Depends(get_db),
):
    return await auth_service.register_user(data, db)