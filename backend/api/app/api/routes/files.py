from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.deps import get_db, get_current_user
from app.db.models.user import User

from app.schemas import file as file_schemas
from app.services.file_service import (
    create_file, get_files_page, 
    get_file, update_file_status
)

from app.core.errors.file_error import (
    FileNameEmptyError, FileNameTooLongError,
    FileAlreadyExistsError, FileNotFoundError
)

router = APIRouter(tags=["files"])


@router.post("/", response_model=file_schemas.FileCreateOut, status_code=201)
async def create_file_route(
    data: file_schemas.FileCreate, db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        file = await create_file(
            db=db, name=data.name,
            folder_id=data.folder_id, user_id=user.id,
        )
    except FileNameEmptyError:
        raise HTTPException(status_code=400, detail="File name cannot be empty")
    except FileNameTooLongError:
        raise HTTPException(status_code=400, detail="File name too long")
    except FileAlreadyExistsError:
        raise HTTPException(status_code=409, detail="File already exists")


    return file


@router.get("/")
async def get_files_route(
    parent_id: int | None = None, db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    return await get_files_page(db, user.id, parent_id)


@router.get("/{file_id}", response_model=file_schemas.FileOut)
async def get_file_route(
    file_id: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    try:
        file = await get_file(
            db=db, file_id=file_id,
            user_id=user.id,
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

    return file


@router.patch("/status")
async def update_file_status_route(
    data: file_schemas.FileStatusUpdate, db: AsyncSession = Depends(get_db),
):
    try:
        file = await update_file_status(
            db=db, storage_key=data.storage_key,
            size=data.size, content_type=data.content_type,
        )
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

    return {"status": "ok"}