from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text

from app.db.models.folder import Folder


class FolderRepository:

    @staticmethod
    async def get_folder_by_name(
        db: AsyncSession, name: str,
        parent_id: int | None, owner_id: int,
    ) -> Folder | None:

        result = await db.execute(
            select(Folder).where(
                Folder.name == name,
                Folder.parent_id == parent_id,
                Folder.owner_id == owner_id,
            )
        )

        return result.scalar_one_or_none()


    @staticmethod
    async def create_folder(
        db: AsyncSession, name: str,
        parent_id: int | None, owner_id: int,
    ) -> Folder:

        folder = Folder(
            name=name,
            parent_id=parent_id,
            owner_id=owner_id,
        )

        db.add(folder)

        await db.commit()
        await db.refresh(folder)

        return folder
    

    @staticmethod
    async def get_by_user_and_parent(
        db: AsyncSession,
        user_id: int,
        parent_id: int | None
    ):
        query = select(Folder).where(Folder.owner_id == user_id)

        if parent_id is None:
            query = query.where(Folder.parent_id.is_(None))
        else:
            query = query.where(Folder.parent_id == parent_id)

        result = await db.execute(query)

        return result.scalars().all()
    

    @staticmethod
    async def get_breadcrumb(
        db: AsyncSession, folder_id: int,
        user_id: int
    ):
        query = text("""
            WITH RECURSIVE folder_path AS (
                SELECT id, name, parent_id
                FROM folders
                WHERE id = :folder_id AND owner_id = :user_id

                UNION ALL

                SELECT f.id, f.name, f.parent_id
                FROM folders f
                JOIN folder_path fp ON f.id = fp.parent_id
                WHERE f.owner_id = :user_id
            )
            SELECT id, name FROM folder_path;
        """)

        result = await db.execute(
            query,
            {
                "folder_id": folder_id,
                "user_id": user_id
            }
        )

        rows = result.mappings().all()

        return list(reversed(rows))