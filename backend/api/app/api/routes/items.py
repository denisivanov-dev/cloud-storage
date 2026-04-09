from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.user import User
from app.db.deps import get_db, get_current_user

from app.services.folder_service import get_folder_page
from app.services.file_service import get_files_page


router = APIRouter(tags=["items"])

@router.get("/")
async def get_items_route(
    parent_id: int | None = None, db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
):
    folders_page = await get_folder_page(db, user.id, parent_id)
    files_page = await get_files_page(db, user.id, parent_id)

    return {
        "folders": folders_page["folders"],
        "files": files_page["files"],
        "breadcrumb": folders_page["breadcrumb"],
    }