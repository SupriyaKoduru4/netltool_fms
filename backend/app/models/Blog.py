from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import base
from datetime import datetime

class Blog(base):
    __tablename__ = "Blog"

    id = Column(Integer, primary_key=True , autoincrement=True)
    video_id = Column(Integer)
    tags = Column(String)
    title = Column(String)
    content = Column(String)
    summary = Column(String)
    components = Column(String)
    author_id = Column(Integer , ForeignKey("users.id"))
    created_at = Column(DateTime , default=datetime.utcnow)
    user = relationship(
    "User",
    back_populates="blogs"
    )