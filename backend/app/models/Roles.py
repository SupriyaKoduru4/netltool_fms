from sqlalchemy import Column, Integer, String
from app.db.database import base

class Role(base):
    __tablename__ = "roles"

    id = Column(Integer, primary_key=True, index=True , autoincrement=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)