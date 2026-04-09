from pydantic import BaseModel
from typing import Optional


class FileCreate(BaseModel):
    name: str
    folder_id: Optional[int] = None

class FileCreateOut(BaseModel):
    id: str
    storage_key: str
    name: str
    status: str

    class Config:
        from_attributes = True

class FileOut(BaseModel):
    id: str
    name: str
    status: str
    size: int
    content_type: str | None
    download_url: str

class FileStatusUpdate(BaseModel):
    storage_key: str
    size: int
    content_type: str