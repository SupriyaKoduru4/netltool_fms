from sqlalchemy import Column, Integer, String, DateTime
from app.db.database import base
import datetime

class User(base):
    __tablename__ = "User"

    id = Column(String, primary_key=True)
    email = Column(String)
    google_id = Column(String)
    password = Column(String)
    avatar_url = Column(String)
    company = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)