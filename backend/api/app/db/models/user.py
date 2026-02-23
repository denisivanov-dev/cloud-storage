from app.db.base import Base

from datetime import datetime

from sqlalchemy import String, Boolean, DateTime
from sqlalchemy import func, text

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    

    username: Mapped[str] = mapped_column(
        String(30), index=True, 
        nullable=False, unique=True
    )
    email: Mapped[str] = mapped_column(
        String(320), index=True, 
        nullable=False, unique=True
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255), nullable=False
    )


    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), 
        nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), 
        onupdate=func.now(), nullable=False
    )


    is_email_verified: Mapped[bool] = mapped_column(
        Boolean, nullable=False, 
        server_default=text("false"), default=False
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, nullable=False,
        server_default=text("true"), default=True
    )


    role: Mapped[str] = mapped_column(
        String(20), nullable=False,
        server_default="user"
    )