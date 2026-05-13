from app.db.database import base, engine

from app.models.User import User
from app.models.Video import Video
from app.models.Blog import Blog
from app.models.blog_draft import Draft

base.metadata.create_all(bind=engine)

print("Tables Created")