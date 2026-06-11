from fastapi import Depends  , HTTPException
from sqlalchemy.orm import Session , joinedload
from app.db.database import get_db
from app.models.Blog import Blog
from app.models.Permissions import Permission
from app.models.RolePermissions import RolePermission
from app.api.routes.auth import get_current_user
from app.middleware.permission_dependency import require_permission
from app.constants.permissions import allow_super_powers
from app.services.AI.ai_service import generate_summary_component_tags

def create_blog(
    title: str,
    content: str,
    video_id: int | None = None,
    tags: str | None = None,
    summary: str | None = None,
    components: str | None = None,
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:        
        generated = generate_summary_component_tags(f"${content}title:${title}")
        print(generated)
        # Create a new Blog instance
        new_blog = Blog(
            title=title,
            content=content,
            video_id=video_id,
            tags=generated["tags"],
            summary=generated["summary"],
            components=generated["components"],
            author_id=current_user
        )
        
        # Add the new blog to the database
        db.add(new_blog)
        db.commit()
        db.refresh(new_blog)
        
        return new_blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
# get all the blogs
def get_all_blogs(current_user: dict, db: Session = Depends(get_db)):
    try:
        if current_user["role"] in allow_super_powers:
            blogs = (
                db.query(Blog)
                .options(joinedload(Blog.user))
                .all()
            )
        else:
            blogs = (
                db.query(Blog)
                .options(joinedload(Blog.user))
                .filter(Blog.author_id == current_user["user_id"])
                .all()
            )

        return blogs

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def get_blog_by_id(blog_id: int, db: Session = Depends(get_db)):
    try:
        blog = db.query(Blog).options(joinedload(Blog.user)).filter(Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def search_blogs_by_tags(tags: str, db: Session = Depends(get_db)):
    try:
        blogs = db.query(Blog).filter(Blog.tags.contains(tags)).all()
        return blogs
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def  delete_blog(blog_id: int, db: Session = Depends(get_db)):
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        db.delete(blog)
        db.commit()
        return {"message": "Blog deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def update_blog(blog_id: int, title: str | None = None, content: str | None = None, tags: str | None = None, summary: str | None = None, components: str | None = None, db: Session = Depends(get_db)):
    try:
        blog = db.query(Blog).filter(Blog.id == blog_id).first()
        if not blog:
            raise HTTPException(status_code=404, detail="Blog not found")
        
        if title is not None:
            blog.title = title
        if content is not None:
            blog.content = content
        if tags is not None:
            blog.tags = tags
        if summary is not None:
            blog.summary = summary
        if components is not None:
            blog.components = components
        
        db.commit()
        db.refresh(blog)
        return blog
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

