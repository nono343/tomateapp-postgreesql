"""empty message

Revision ID: 2b56f9adcba2
Revises: fdff90bf957d
Create Date: 2023-11-23 18:34:45.244354

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '2b56f9adcba2'
down_revision = 'fdff90bf957d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('packagings', schema=None) as batch_op:
        batch_op.add_column(sa.Column('marca', sa.String(length=80), nullable=False, server_default=''))


    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('packagings', schema=None) as batch_op:
        batch_op.drop_column('marca')

    # ### end Alembic commands ###