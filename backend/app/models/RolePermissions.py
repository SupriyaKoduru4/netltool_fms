from sqlalchemy import Column, Integer, String , ForeignKey
from app.db.database import base

class RolePermission(base):
    __tablename__ = "role_permissions"

    role_id = Column(
        Integer,
        ForeignKey("roles.id"),
        primary_key=True
    )

    permission_id = Column(
        Integer,
        ForeignKey("permissions.id"),
        primary_key=True
    )