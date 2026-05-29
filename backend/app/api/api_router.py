from fastapi import APIRouter

from app.api.routes.authentication import router as auth_router
from app.api.routes.streamlab import router as streamlab_apis
from app.api.routes.blog import router as blog_apis
from app.api.routes.projects import router as projects_apis
from app.api.routes.role_permission import router as role_permission_apis

api_router = APIRouter()
api_router.include_router(
    auth_router, 
    prefix="/auth", 
    tags=["auth"]
    )
    
api_router.include_router(
    streamlab_apis,
    prefix="/streamlab",
    tags=["streamlab"]
)   

api_router.include_router(
    blog_apis,
    prefix="/blog",
    tags=["blog"]
)

api_router.include_router(
    projects_apis,
    prefix="/projects",
    tags=["projects"]
)

api_router.include_router(
    role_permission_apis,
    prefix="/role-permission",
    tags=["role-permission"]
)
    