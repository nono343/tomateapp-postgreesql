"""empty message

Revision ID: 56d3ef1a67b7
Revises: 1a946eccb71a
Create Date: 2023-11-20 12:23:17.862432

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '56d3ef1a67b7'
down_revision = '1a946eccb71a'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.add_column(sa.Column('foto', sa.String(length=120), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_column('foto')

    # ### end Alembic commands ###
