import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy.exc import IntegrityError

from app.core.errors.file_error import (
    FileNameEmptyError, FileNameTooLongError,
    FileAlreadyExistsError
)

from app.core.redis import redis_client

from app.repository.file_repository import FileRepository


async def create_file(
    db: AsyncSession, name: str,
    folder_id: int | None, user_id: int,
):
    if not name:
        raise FileNameEmptyError()

    if len(name) > 255:
        raise FileNameTooLongError()

    file_id = str(uuid.uuid4())
    storage_key = f"{user_id}/{file_id}"

    try:
        file = await FileRepository.create_file(
            db=db, id=file_id,
            name=name, folder_id=folder_id,
            owner_id=user_id, storage_key=storage_key,
        )
    except IntegrityError:
        await db.rollback()
        raise FileAlreadyExistsError()

    return file


async def get_files_page(
    db: AsyncSession, user_id: int,
    parent_id: int | None,
):
    files = await FileRepository.get_by_user_and_folder(
        db, user_id,
        parent_id,
    )

    return {
        "files": files,
    }


async def get_file(
    db: AsyncSession, file_id: str, 
    user_id: int
):
    file = await FileRepository.get_by_id(db, file_id, user_id)

    if not file:
        raise FileNotFoundError()

    token = str(uuid.uuid4())

    await redis_client.setex(
        f"download:{token}",
        300,
        file.storage_key
    )

    download_url = f"http://localhost:8081/download?token={token}"

    return {
        "id": file.id,
        "name": file.name,
        "size": file.size,
        "content_type": file.content_type,
        "status": file.status,
        "download_url": download_url,
    }


async def update_file_status(
    db: AsyncSession, storage_key: str,
    size: int, content_type: str,
):
    file = await FileRepository.get_by_storage_key(db, storage_key)

    if not file:
        raise FileNotFoundError()

    if file.status == "ready":
        return file

    try:
        file.size = size
        file.content_type = content_type or file.content_type
        file.status = "ready"

        await db.commit()
        await db.refresh(file)

    except Exception:
        await db.rollback()
        raise

    return file