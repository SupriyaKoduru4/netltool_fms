from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import base


class Video(base):
    __tablename__ = "Video"

    id = Column(Integer, primary_key=True , autoincrement=True)
    title = Column(String)
    description = Column(String)
    url = Column(String)
    thumbnail_url = Column(String)
    transcript = Column(String)
    video_status = Column(String, default="processing")
    created_at = Column(DateTime)
    author_id = Column(String)