from pydantic import BaseModel
from datetime import datetime


class FolderCreate(BaseModel):
    name: str
    parent_id: int | None = None


class FolderRename(BaseModel):
    name: str


class FolderMove(BaseModel):
    parent_id: int | None


class FolderMoveBulk(BaseModel):
    ids: list[int]
    parent_id: int


class FolderOut(BaseModel):
    id: int
    name: str
    owner_id: int
    parent_id: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class FolderBreadcrumb(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class FolderPage(BaseModel):
    breadcrumb: list[FolderBreadcrumb]
    folders: list[FolderOut]