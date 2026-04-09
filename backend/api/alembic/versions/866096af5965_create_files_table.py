"""create files table

Revision ID: 866096af5965
Revises: a11aedffa535
Create Date: 2026-03-19 20:28:33.444316

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '866096af5965'
down_revision: Union[str, Sequence[str], None] = 'a11aedffa535'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "files",
        sa.Column("id", sa.String(36), primary_key=True),

        sa.Column("name", sa.String(255), nullable=False),

        sa.Column("owner_id", sa.Integer(), nullable=False),
        sa.Column("folder_id", sa.Integer(), nullable=True),

        sa.Column("storage_key", sa.String(512), nullable=False, unique=True),

        sa.Column("size", sa.BigInteger(), nullable=False, server_default="0"),
        sa.Column("content_type", sa.String(255), nullable=True),

        sa.Column("status", sa.String(50), nullable=False, server_default="pending"),

        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),

        sa.ForeignKeyConstraint(["owner_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["folder_id"], ["folders.id"], ondelete="CASCADE"),
    )

    op.create_index("ix_files_name", "files", ["name"])
    op.create_index("ix_files_owner_id", "files", ["owner_id"])

    op.create_unique_constraint(
        "uq_file_owner_folder_name",
        "files",
        ["owner_id", "folder_id", "name"],
    )

    op.create_index(
        "uq_root_file_owner_name",
        "files",
        ["owner_id", "name"],
        unique=True,
        postgresql_where=sa.text("folder_id IS NULL"),
    )


def downgrade() -> None:
    op.drop_index("uq_root_file_owner_name", table_name="files")
    op.drop_constraint("uq_file_owner_folder_name", "files", type_="unique")
    op.drop_index("ix_files_owner_id", table_name="files")
    op.drop_index("ix_files_name", table_name="files")
    op.drop_table("files")