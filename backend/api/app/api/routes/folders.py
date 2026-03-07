from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db, get_current_user
from app.db.models.user import User

from app.schemas import folder as folder_schemas
from app.services.folder_service import create_folder, get_folder_page

from app.core.errors.folder_error import (
    FolderNameEmptyError,
    FolderNameTooLongError,
    FolderAlreadyExistsError
)

router = APIRouter(tags=["folders"])


@router.post("/", response_model=folder_schemas.FolderOut, status_code=201)
async def create_folder_route(
    data: folder_schemas.FolderCreate,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        folder = await create_folder(db, data, user.id)

    except FolderNameEmptyError:
        raise HTTPException(status_code=400, detail="Folder name cannot be empty")

    except FolderNameTooLongError:
        raise HTTPException(status_code=400, detail="Folder name too long")

    except FolderAlreadyExistsError:
        raise HTTPException(status_code=409, detail="Folder already exists")

    return folder


@router.get("/", response_model=folder_schemas.FolderPage)
async def get_folders_route(
    parent_id: int | None = None,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    page = await get_folder_page(db, user.id, parent_id)
    return page