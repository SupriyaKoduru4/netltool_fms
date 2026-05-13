from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import base

class Blog(base):
    __tablename__ = "Blog"

    id = Column(Integer, primary_key=True , autoincrement=True)
    video_id = Column(Integer)
    tags = Column(String)
    title = Column(String)
    content = Column(String)
    summary = Column(String)
    components = Column(String)
    author_id = Column(String)
    created_at = Column(DateTime)