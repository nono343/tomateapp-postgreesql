"""empty message

Revision ID: 9453773f3ff7
Revises: 749c5a32612b
Create Date: 2023-11-30 18:18:55.854635

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '9453773f3ff7'
down_revision = '749c5a32612b'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint(None, ['id'])

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint(None, type_='unique')

    # ### end Alembic commands ###
