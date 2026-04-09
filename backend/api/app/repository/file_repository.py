from sqlalchemy.ext.asyncio import AsyncSession

from sqlalchemy import select

from app.db.models.file import File


class FileRepository:

    @staticmethod
    async def create_file(
        db: AsyncSession, id: str,
        name: str, folder_id: int | None,
        owner_id: int, storage_key: str,
    ) -> File:
        file = File(
            id=id, name=name,
            folder_id=folder_id, owner_id=owner_id,
            storage_key=storage_key,
        )

        db.add(file)
        await db.commit()
        await db.refresh(file)

        return file
    

    @staticmethod
    async def get_by_user_and_folder(
        db: AsyncSession, user_id: int,
        folder_id: int | None,
    ):
        result = await db.execute(
            select(File).where(
                File.owner_id == user_id,
                File.folder_id == folder_id,
            )
        )

        return result.scalars().all()
        

    @staticmethod
    async def get_by_id(
        db: AsyncSession, file_id: str,
        user_id: int,
    ) -> File | None:
        result = await db.execute(
            select(File).where(
                File.id == file_id,
                File.owner_id == user_id,
            )
        )

        return result.scalar_one_or_none()
    

    @staticmethod
    async def get_by_storage_key(
        db: AsyncSession,
        storage_key: str,
    ) -> File | None:
        result = await db.execute(
            select(File).where(File.storage_key == storage_key)
        )

        return result.scalar_one_or_none()