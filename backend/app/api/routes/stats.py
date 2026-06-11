from fastapi import (APIRouter , Depends)
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.services.stats_service import get_stats_all
from app.middleware.permission_dependency import require_permission
from app.constants.permissions import Permissions

router = APIRouter()

@router.get('/all')
def get_stats(current_user:dict = Depends(require_permission(Permissions.BLOG_VIEW)) , db:Session = Depends(get_db)):
    stats = get_stats_all(current_user ,db)
    return stats 