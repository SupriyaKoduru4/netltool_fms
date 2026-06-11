from fastapi import APIRouter , Depends , HTTPException
from app.services.project_service import add_updates_to_project, create_project, delete_update, get_all_projects, get_updates_for_project, update_project, update_update
from app.api.routes.auth import get_current_user
from app.db.database import get_db
from sqlalchemy.orm import Session
from app.schemas.project_schema import ProjectCreate
from app.schemas.updates_schema import CreateUpdate
from app.middleware.permission_dependency import require_permission
from app.constants.permissions import Permissions

router = APIRouter()


@router.post("/create")
def create(project_data: ProjectCreate , current_user: str = Depends(require_permission(Permissions.PROJECT_CREATE)), db: Session = Depends(get_db)):
    try:
        # Call the create_project function from the service
        project = create_project(
            project_data=project_data,
            current_user=current_user["user_id"],
            db=db
        )
        return {"message": "Project created successfully", "project": project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))         
    
@router.get("/")
def get_projects(query:str=None ,db: Session = Depends(get_db)):
    try:
        # Call the get_all_projects function from the service

        projects = get_all_projects(query ,db=db)
        return {"message": "Projects retrieved successfully", "projects": projects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/update/{project_id}")
def update(project_id: int, project_data: ProjectCreate, current_user: str = Depends(require_permission(Permissions.PROJECT_UPDATE)), db: Session = Depends(get_db)):
    try:
        # Call the update_project function from the service

        project = update_project(project_id,project_data, db=db)
        return {"message": "Project updated successfully", "project": project}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/{project_id}/add-update")
def add_update(project_id:int , update_data:CreateUpdate , current_user: str = Depends(require_permission(Permissions.PROJECT_UPDATE)), db: Session = Depends(get_db)):
    try:
        # Call the add_updates_to_project function from the service

        add_update = add_updates_to_project(project_id,update_data, db=db)
        return {"message": "Update added successfully", "update": add_update}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
@router.get("/{project_id}/updates")
def get_all_updates_for_project(project_id:int , db: Session = Depends(get_db)):
    try:
        # Call the get_all_updates_for_project function from the service

        updates = get_updates_for_project(project_id, db=db)
        return {"message": "Updates retrieved successfully", "updates": updates}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{project_id}/update-update/{update_id}")
def update_updates_to_project( update_id:int , update_data:CreateUpdate , current_user: str = Depends(require_permission(Permissions.PROJECT_UPDATE)), db: Session = Depends(get_db)):
    try:
        # Call the update_update function from the service

        updated_update = update_update(update_id,update_data, db=db)
        return {"message": "Update updated successfully", "update": updated_update}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{project_id}/delete-update/{update_id}")
def delete_update_from_project(update_id:int , current_user: str = Depends(require_permission(Permissions.PROJECT_DELETE)), db: Session = Depends(get_db)):
    try:
        # Call the delete_update function from the service

        delete_message = delete_update(update_id, db=db)
        return {"message": "Update deleted successfully", "details": delete_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))