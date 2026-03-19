from app.db.base_class import Base

from datetime import datetime

from sqlalchemy import (
    ForeignKey, String, DateTime, 
    UniqueConstraint, Index
)
from sqlalchemy import func

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class Folder(Base):
    __tablename__ = "folders"

    id: Mapped[int] = mapped_column(primary_key=True)


    name: Mapped[str] = mapped_column(
        String(255), index=True,
        nullable=False
    )
    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True, nullable=False,
    )
    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("folders.id", ondelete="CASCADE"),
        nullable=True
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), 
        onupdate=func.now(), nullable=False
    )

    
    __table_args__ = (
        UniqueConstraint(
            "owner_id", "parent_id", "name",
            name="uq_folder_owner_parent_name",
        ),

        Index(
            "uq_root_folder_owner_name",
            "owner_id", "name",
            unique=True,
            postgresql_where=parent_id.is_(None),
        ),
    )