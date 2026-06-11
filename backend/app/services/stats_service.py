from sqlalchemy.orm import Session
from app.models.Blog import Blog

from app.constants.permissions import allow_super_powers

def get_stats_all(current_user:dict , db: Session):
    try:
        if current_user["role"] in allow_super_powers:
            blog_count = db.query(Blog).count()
        else:
            blog_count = db.query(Blog).filter(Blog.author_id==current_user["user_id"]).count()

        return {
            "blog_count": blog_count
        }

    except Exception as e:
        raise e