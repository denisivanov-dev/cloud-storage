from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db, get_current_user
from app.db.models.user import User

from app.schemas import folder as folder_schemas
from app.services.folder_service import (
    create_folder, get_folder_page,
    rename_folder, delete_folder,
    move_folder, move_folders_bulk
)

from app.core.errors.folder_error import (
    FolderNameEmptyError, FolderNameTooLongError,
    FolderAlreadyExistsError, FolderNotFoundError,
    CannotMoveFolderIntoItselfError, CannotMoveFolderIntoChildError
)

router = APIRouter(tags=["folders"])


@router.post("/", response_model=folder_schemas.FolderOut, status_code=201)
async def create_folder_route(
    data: folder_schemas.FolderCreate, db: AsyncSession = Depends(get_db),
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
    parent_id: int | None = None, db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    page = await get_folder_page(db, user.id, parent_id)
    return page


@router.patch("/{folder_id}", response_model=folder_schemas.FolderOut)
async def rename_folder_route(
    folder_id: int, data: folder_schemas.FolderRename,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    try:
        folder = await rename_folder(
            db=db, folder_id=folder_id,
            name=data.name, user_id=user.id,
        )
    except FolderNameEmptyError:
        raise HTTPException(status_code=400, detail="Folder name cannot be empty")
    except FolderNameTooLongError:
        raise HTTPException(status_code=400, detail="Folder name too long")
    except FolderAlreadyExistsError:
        raise HTTPException(status_code=409, detail="Folder already exists")
    except FolderNotFoundError:
        raise HTTPException(status_code=404, detail="Folder not found")

    return folder


@router.delete("/{folder_id}")
async def delete_folder_route(
    folder_id: int, db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        await delete_folder(
            db=db, folder_id=folder_id,
            user_id=user.id,
        )
    except FolderNotFoundError:
        raise HTTPException(status_code=404, detail="Folder not found")

    return {"ok": True}


@router.patch("/{folder_id}/move", response_model=folder_schemas.FolderOut)
async def move_folder_route(
    folder_id: int, data: folder_schemas.FolderMove,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    try:
        folder = await move_folder(
            db=db, folder_id=folder_id,
            parent_id=data.parent_id, user_id=user.id,
        )
    except FolderNotFoundError:
        raise HTTPException(status_code=404, detail="Folder not found")
    except CannotMoveFolderIntoItselfError:
        raise HTTPException(status_code=400, detail="Cannot move folder into itself")
    except CannotMoveFolderIntoChildError:
        raise HTTPException(status_code=400, detail="Cannot move folder into its child")
    except FolderAlreadyExistsError:
        raise HTTPException(status_code=409, detail="Folder already exists")

    return folder


@router.post("/move-bulk", response_model=list[folder_schemas.FolderOut])
async def move_folders_bulk_route(
    data: folder_schemas.FolderMoveBulk, db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        folders = await move_folders_bulk(
            db=db,
            folder_ids=data.ids,
            parent_id=data.parent_id,
            user_id=user.id,
        )
    except FolderNotFoundError:
        raise HTTPException(status_code=404, detail="Folder not found")
    except CannotMoveFolderIntoItselfError:
        raise HTTPException(status_code=400, detail="Cannot move folder into itself")
    except CannotMoveFolderIntoChildError:
        raise HTTPException(status_code=400, detail="Cannot move folder into its child")
    except FolderAlreadyExistsError:
        raise HTTPException(status_code=409, detail="Folder already exists")

    return folders