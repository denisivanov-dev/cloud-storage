from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError

from app.schemas.folder import FolderCreate, FolderRename
from app.repository.folder_repository import FolderRepository

from app.core.errors.folder_error import (
    FolderNameEmptyError, FolderNameTooLongError,
    FolderAlreadyExistsError, FolderNotFoundError,
    CannotMoveFolderIntoChildError, CannotMoveFolderIntoItselfError
)


async def create_folder(
    db: AsyncSession, data: FolderCreate,
    user_id: int,
):
    name = data.name.strip()

    if not name:
        raise FolderNameEmptyError()

    if len(name) > 255:
        raise FolderNameTooLongError()

    try:
        folder = await FolderRepository.create_folder(
            db=db, name=name,
            parent_id=data.parent_id, owner_id=user_id,
        )
    except IntegrityError:
        await db.rollback()
        raise FolderAlreadyExistsError()

    return folder


async def rename_folder(
    db: AsyncSession, folder_id: int,
    name: str, user_id: int,
):
    name = name.strip()

    if not name:
        raise FolderNameEmptyError()

    if len(name) > 255:
        raise FolderNameTooLongError()

    folder = await FolderRepository.get_folder_by_id(
        db=db, id=folder_id,
        owner_id=user_id,
    )

    if not folder:
        raise FolderNotFoundError

    if folder.name == name:
        return folder

    folder.name = name

    try:
        await db.commit()
    except IntegrityError:
        await db.rollback()
        raise FolderAlreadyExistsError()

    await db.refresh(folder)

    return folder


async def delete_folder(
    db: AsyncSession, folder_id: int,
    user_id: int,
):
    folder = await FolderRepository.get_folder_by_id(
        db=db, id=folder_id,
        owner_id=user_id,
    )

    if not folder:
        raise FolderNotFoundError()

    await FolderRepository.delete_folder(
        db=db, folder=folder
    )

    return True


async def move_folder(
    db: AsyncSession, folder_id: int,
    parent_id: int | None, user_id: int,
):
    folder = await FolderRepository.get_folder_by_id(
        db=db, id=folder_id,
        owner_id=user_id,
    )

    if not folder:
        raise FolderNotFoundError()

    if parent_id == folder_id:
        raise ValueError("Cannot move folder into itself")

    if parent_id is not None:
        parent = await FolderRepository.get_folder_by_id(
            db=db, id=parent_id,
            owner_id=user_id,
        )

        if not parent:
            raise CannotMoveFolderIntoItselfError()

        is_descendant = await FolderRepository.is_descendant(
            db=db, folder_id=parent_id,
            potential_parent_id=folder_id,
        )

        if is_descendant: 
            raise CannotMoveFolderIntoChildError()

    try:
        folder.parent_id = parent_id

        await db.commit()
        await db.refresh(folder)

    except IntegrityError:
        await db.rollback()
        raise FolderAlreadyExistsError()

    return folder


async def move_folders_bulk(
    db: AsyncSession, folder_ids: list[int],
    parent_id: int | None, user_id: int,
):
    folders = await FolderRepository.get_folders_by_ids(
        db=db, ids=folder_ids,
        owner_id=user_id,
    )

    if len(folders) != len(folder_ids):
        raise FolderNotFoundError()

    if parent_id in folder_ids:
        raise CannotMoveFolderIntoItselfError()

    if parent_id is not None:
        parent = await FolderRepository.get_folder_by_id(
            db=db, id=parent_id,
            owner_id=user_id,
        )

        if not parent:
            raise FolderNotFoundError()

        is_descendant = await FolderRepository.any_is_descendant(
            db=db, folder_ids=folder_ids,
            parent_id=parent_id,
        )

        if is_descendant:
            raise CannotMoveFolderIntoChildError()

    try:
        await FolderRepository.bulk_update_parent(
            db=db, folder_ids=folder_ids,
            parent_id=parent_id,
        )
    except IntegrityError:
        await db.rollback()
        raise FolderAlreadyExistsError()

    return await FolderRepository.get_folders_by_ids(
        db=db, ids=folder_ids,
        owner_id=user_id,
    )

async def get_folder_page(
    db: AsyncSession, user_id: int,
    parent_id: int | None,
):
    folders = await FolderRepository.get_by_user_and_parent(
        db, user_id,
        parent_id,
    )

    breadcrumb = []

    if parent_id is not None:
        breadcrumb = await FolderRepository.get_breadcrumb(
            db, parent_id,
            user_id,
        )

    return {
        "breadcrumb": breadcrumb,
        "folders": folders,
    }