from sqlalchemy.ext.asyncio import AsyncSession

from app.schemas.folder import FolderCreate
from app.repository.folder_repository import FolderRepository

from app.core.errors.folder_error import (
    FolderNameEmptyError,
    FolderNameTooLongError,
    FolderAlreadyExistsError,
)


async def create_folder(
    db: AsyncSession, data: FolderCreate,
    user_id: int
):
    name = data.name.strip()

    if not name:
        raise FolderNameEmptyError()

    if len(name) > 255:
        raise FolderNameTooLongError()


    existing = await FolderRepository.get_folder_by_name(
        db=db,
        name=name,
        parent_id=data.parent_id,
        owner_id=user_id,
    )

    if existing:
        raise FolderAlreadyExistsError()


    folder = await FolderRepository.create_folder(
        db=db,
        name=name,
        parent_id=data.parent_id,
        owner_id=user_id,
    )

    return folder


async def get_folder_page(
    db: AsyncSession,
    user_id: int,
    parent_id: int | None
):
    folders = await FolderRepository.get_by_user_and_parent(
        db,
        user_id,
        parent_id
    )


    breadcrumb = []

    if parent_id is not None:
        breadcrumb = await FolderRepository.get_breadcrumb(
            db,
            parent_id,
            user_id
        )


    return {
        "breadcrumb": breadcrumb,
        "folders": folders
    }