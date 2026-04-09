from app.db.base_class import Base

import uuid
from datetime import datetime

from sqlalchemy import (
    ForeignKey, String, DateTime,
    BigInteger, UniqueConstraint, Index
)
from sqlalchemy import func

from sqlalchemy.orm import Mapped, mapped_column


class File(Base):
    __tablename__ = "files"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )

    name: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        index=True
    )

    owner_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    folder_id: Mapped[int | None] = mapped_column(
        ForeignKey("folders.id", ondelete="CASCADE"),
        nullable=True
    )

    storage_key: Mapped[str] = mapped_column(
        String(512),
        nullable=False,
        unique=True
    )

    size: Mapped[int] = mapped_column(
        BigInteger,
        nullable=False,
        default=0
    )

    content_type: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True
    )

    status: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
        default="pending"
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False
    )

    __table_args__ = (
        UniqueConstraint(
            "owner_id", "folder_id", "name",
            name="uq_file_owner_folder_name",
        ),
        Index(
            "uq_root_file_owner_name",
            "owner_id", "name",
            unique=True,
            postgresql_where=folder_id.is_(None),
        ),
    )