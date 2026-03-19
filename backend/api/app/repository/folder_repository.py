from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text, update

from app.db.models.folder import Folder


class FolderRepository:
    
    @staticmethod
    async def get_folder_by_id(
        db: AsyncSession, id: int,
        owner_id: int,
    ) -> Folder | None:
        
        result = await db.execute(
            select(Folder).where(
                Folder.id == id,
                Folder.owner_id == owner_id,
            )
        )

        return result.scalar_one_or_none()
    

    @staticmethod
    async def get_folders_by_ids(
        db: AsyncSession, ids: list[int],
        owner_id: int,
    ):
        if not ids:
            return []

        result = await db.execute(
            select(Folder).where(
                Folder.id.in_(ids),
                Folder.owner_id == owner_id,
            )
        )

        return result.scalars().all()
    

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
    async def delete_folder(
        db: AsyncSession, folder: Folder
    ):
        await db.delete(folder)
        await db.commit()

    
    @staticmethod
    async def is_descendant(
        db: AsyncSession, folder_id: int,
        potential_parent_id: int,
    ) -> bool:
        current_id = folder_id

        while current_id is not None:
            if current_id == potential_parent_id:
                return True

            result = await db.get(Folder, current_id)

            if not result:
                return False

            current_id = result.parent_id

        return False
    

    @staticmethod
    async def any_is_descendant(
        db: AsyncSession, folder_ids: list[int],
        parent_id: int,
    ) -> bool:
        if not folder_ids:
            return False

        query = text("""
            WITH RECURSIVE tree AS (
                SELECT id, parent_id FROM folders
                WHERE id = :parent_id

                UNION ALL

                SELECT f.id, f.parent_id FROM folders f
                JOIN tree t ON f.parent_id = t.id
            )
            SELECT 1 FROM tree
            WHERE id = ANY(:folder_ids)
            LIMIT 1;
        """)

        result = await db.execute(
            query,
            {
                "parent_id": parent_id,
                "folder_ids": folder_ids,
            },
        )

        return result.scalar() is not None
    

    @staticmethod
    async def bulk_update_parent(
        db: AsyncSession, folder_ids: list[int],
        parent_id: int | None,
    ):
        if not folder_ids:
            return

        await db.execute(
            update(Folder)
            .where(Folder.id.in_(folder_ids))
            .values(parent_id=parent_id)
        )

        await db.commit()
    

    @staticmethod
    async def get_by_user_and_parent(
        db: AsyncSession, user_id: int,
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
                SELECT id, name, parent_id FROM folders
                WHERE id = :folder_id AND owner_id = :user_id

                UNION ALL

                SELECT f.id, f.name, f.parent_id FROM folders f
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