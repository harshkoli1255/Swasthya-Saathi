"""abdm_patient_verification_fields

Revision ID: 45f315b4b40f
Revises: b0bc7a50c2e3
Create Date: 2026-09-12 09:39:23.794566
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '45f315b4b40f'
down_revision: Union[str, None] = 'b0bc7a50c2e3'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('patients', sa.Column('verification_status', sa.String(), server_default='UNVERIFIED', nullable=False))
    op.add_column('patients', sa.Column('verification_method', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('verification_source', sa.String(), nullable=True))
    op.add_column('patients', sa.Column('verified_at', sa.DateTime(), nullable=True))
    op.add_column('patients', sa.Column('verification_reference', sa.String(), nullable=True))


def downgrade() -> None:
    op.drop_column('patients', 'verification_reference')
    op.drop_column('patients', 'verified_at')
    op.drop_column('patients', 'verification_source')
    op.drop_column('patients', 'verification_method')
    op.drop_column('patients', 'verification_status')
