from app.db.base_class import Base

from datetime import datetime

from sqlalchemy import ForeignKey, String, DateTime

from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from sqlalchemy import func


class RefreshToken(Base):
    __tablename__ = "refresh_tokens"


    jti: Mapped[str] = mapped_column(
        String(36), primary_key=True
    )

    
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        index=True, nullable=False,
    )
    revoked: Mapped[bool] = mapped_column(
        default=False, nullable=False,
    )


    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), index=True,
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(),
        nullable=False,
    )
    last_used_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True,
    )