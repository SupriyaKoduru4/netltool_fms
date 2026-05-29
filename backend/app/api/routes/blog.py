from app.services.blog_service import create_blog, get_blog_by_id, search_blogs_by_tags, update_blog
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.Blog import Blog
from app.api.routes.auth import get_current_user
from app.services.AI.ai_service import generate_blog_with_ollama
from app.schemas.blog_schema import BlogCreateRequest
from app.services.blog_service import get_all_blogs , delete_blog
from app.middleware.permission_dependency import require_permission
from app.constants.permissions import Permissions

router = APIRouter()

@router.get("/all")
async def get_blogs(db: Session = Depends(get_db)):
    try:
        blogs = get_all_blogs(db=db)
        return {"blogs": blogs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/create")
async def create(
    request: BlogCreateRequest,
    current_user: str = Depends(require_permission(Permissions.BLOG_CREATE)),
    db: Session = Depends(get_db)
):
    try:
        # Generate blog content using Ollama
        created_blog = create_blog(
            title=request.title,
            content=request.content,
            video_id=request.video_id,
            tags=request.tags,
            summary=request.summary,
            components=request.components,
            current_user=current_user,
            db=db
        )
        print("Generated Blog:", created_blog)
        return {"message": "Blog created successfully", "blog_id": created_blog.id}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{blog_id}")
async def get_blog_id(blog_id: int, db: Session = Depends(get_db)):
    try:
        if(blog_id is None):
            raise HTTPException(status_code=400, detail="Blog ID is required")
        blog = get_blog_by_id(blog_id=blog_id, db=db)
        return {"blog": blog}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/search")
async def search_blogs(tags: str, db: Session = Depends(get_db)):
    try:
        blogs = search_blogs_by_tags(tags=tags, db=db)
        return {"blogs": blogs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.delete("/{blog_id}")
async def delete(blog_id: int, db: Session = Depends(get_db)):
    if blog_id is None:
        raise HTTPException(status_code=400, detail="Blog ID is required")  
    delete_blog(blog_id=blog_id, db=db)
    return {"message": "Blog deleted successfully"}

@router.put("/{blog_id}")
async def update(blog_id: int, request: BlogCreateRequest, db: Session = Depends(get_db)):
    if blog_id is None:
        raise HTTPException(status_code=400, detail="Blog ID is required")  
    update_blog(blog_id=blog_id, title=request.title, content=request.content, tags=request.tags, summary=request.summary, components=request.components, db=db)
    return {"message": "Blog updated successfully"}

