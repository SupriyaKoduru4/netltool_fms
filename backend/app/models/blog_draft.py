from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from app.db.database import base

class Draft(base):
    __tablename__ = "drafts"

    id = Column(Integer, primary_key=True , autoincrement=True)

    video_id = Column(
        Integer,
        ForeignKey("Video.id")
    )

    response = Column(Text)

    status = Column(
        String,
        default="Draft"
    )

    created_at = Column(DateTime)

    updated_at = Column(DateTime)