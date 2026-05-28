from sqlalchemy import Column, Integer, String, DateTime, Boolean
from app.db.database import base
import datetime
from sqlalchemy.orm import relationship


class User(base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)

    email = Column(String, unique=True, nullable=False)

    google_id = Column(String, nullable=True)

    password = Column(String, nullable=True)

    avatar_url = Column(String, nullable=True)

    company = Column(String, nullable=True)

    created_at = Column(
        DateTime,
        default=datetime.datetime.utcnow
    )

    first_name = Column(String, nullable=True)

    last_name = Column(String, nullable=True)

    phone = Column(String, nullable=True)

    role = Column(Integer, nullable=False)

    is_register = Column(Boolean, default=False)

    is_active = Column(Boolean, default=True)

    is_deleted = Column(Boolean, default=False)

    invitation_token = Column(String, nullable=True)

    invitation_expiry = Column(DateTime, nullable=True)

    blogs = relationship("Blog", back_populates="user")