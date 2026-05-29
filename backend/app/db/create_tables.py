from app.db.database import base, engine

from app.models.User import User
from app.models.Video import Video
from app.models.Blog import Blog
from app.models.blog_draft import Draft
from app.models.Projects import Projects
from app.models.Updates import Updates
from app.models.Roles import Role  
from app.models.Permissions import Permission
from app.models.RolePermissions import RolePermission

base.metadata.create_all(bind=engine)

print("Tables Created")