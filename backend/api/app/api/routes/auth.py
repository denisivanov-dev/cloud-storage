from fastapi import APIRouter, Depends, Response, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas import auth as auth_schemas
from app.services import auth_service
from app.db.deps import get_db
from app.core.config import settings
from app.core.cookies import set_refresh_cookie
from app.core.errors.auth_errors import ValidationError, InvalidCredentialsError

router = APIRouter(tags=["auth"])

@router.post("/login", response_model=auth_schemas.TokenResponse)
async def login(
    data: auth_schemas.LoginRequest, response: Response,
    db: AsyncSession = Depends(get_db),
):
    try:
        access_token, refresh_token = await auth_service.login_user(data, db)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.errors)
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=401, detail=e.errors)

    set_refresh_cookie(response, refresh_token)

    return auth_schemas.TokenResponse(access_token=access_token)


@router.post("/register", response_model=auth_schemas.TokenResponse)
async def register(
    data: auth_schemas.RegisterRequest, response: Response,
    db: AsyncSession = Depends(get_db),
):
    try:
        access_token, refresh_token = await auth_service.register_user(data, db)
    except ValidationError as e:
        raise HTTPException(status_code=400, detail=e.errors)

    set_refresh_cookie(response, refresh_token)

    return auth_schemas.TokenResponse(access_token=access_token)


@router.post("/refresh", response_model=auth_schemas.TokenResponse)
async def refresh(
    request: Request, response: Response,
    db: AsyncSession = Depends(get_db),
):
    refresh_token = request.cookies.get("refresh_token")

    if not refresh_token:
        raise HTTPException(status_code=401, detail="Refresh token missing")

    try:
        access_token = await auth_service.refresh_access_token(
            refresh_token, db,
        )
    except InvalidCredentialsError as e:
        raise HTTPException(status_code=401, detail=e.errors)

    return auth_schemas.TokenResponse(access_token=access_token)