from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.api.routes.auth import get_current_user
from app.db.database import get_db
from app.models.Projects import Projects
from app.schemas.project_schema import ProjectCreate , ProjectUpdate
from app.schemas.updates_schema import CreateUpdate
from app.models.Updates import Updates

def create_project(
    project_data: ProjectCreate,
    current_user=Depends(),
    db: Session = Depends(get_db)
):
    try:

        new_project = Projects(
            name=project_data.name,
            summary=project_data.summary,
            thumbnail=project_data.thumbnail,
            isActive=project_data.isActive,
            visibility=project_data.visibility,
            companyId=project_data.companyId 
        )

        db.add(new_project)
        db.commit()
        db.refresh(new_project)

        return new_project

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
def get_all_projects(query: str = None, db: Session = Depends(get_db)):
    try:
        projects = db.query(Projects)
        if query:
            projects = projects.filter(Projects.name.contains(query))
        projects = projects.all()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def update_project(project_id: int, project_data: ProjectUpdate, db: Session):
    try:
        project = db.query(Projects)
        project = project.filter(Projects.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        project.name = project_data.name if project_data.name else project.name
        project.summary = project_data.summary if project_data.summary else project.summary
        project.thumbnail = project_data.thumbnail if project_data.thumbnail else project.thumbnail
        project.isActive = project_data.isActive if project_data.isActive is not None else project.isActive
        project.visibility = project_data.visibility if project_data.visibility else project.visibility

        db.commit()
        db.refresh(project)
        return project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

def add_updates_to_project(project_id:int , udpate_data:CreateUpdate , db: Session = Depends(get_db)):
    try:
        project = db.query(Projects).filter(Projects.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        new_update = Updates(
            title=udpate_data.title,
            content=udpate_data.content,
            image=udpate_data.image,
            progress=udpate_data.progress,
            projectId=project_id
        )

        db.add(new_update)
        db.commit()
        db.refresh(new_update)

        return new_update
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    
def get_updates_for_project(project_id:int , db: Session = Depends(get_db)):
    try:
        project = db.query(Projects).filter(Projects.id == project_id).first()
        if not project:
            raise HTTPException(status_code=404, detail="Project not found")
        
        updates = db.query(Updates).filter(Updates.projectId == project_id).all()
        return updates
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    
def update_update(update_id:int , update_data:CreateUpdate , db: Session = Depends(get_db)):
    try:
        update = db.query(Updates).filter(Updates.id == update_id).first()
        if not update:
            raise HTTPException(status_code=404, detail="Update not found")
        
        update.title = update_data.title if update_data.title else update.title
        update.content = update_data.content if update_data.content else update.content
        update.image = update_data.image if update_data.image else update.image
        update.progress = update_data.progress if update_data.progress is not None else update.progress

        db.commit()
        db.refresh(update)
        return update
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

def delete_update(update_id:int , db: Session = Depends(get_db)):
    try:
        update = db.query(Updates).filter(Updates.id == update_id).first()
        if not update:
            raise HTTPException(status_code=404, detail="Update not found")
        
        db.delete(update)
        db.commit()
        return {"message": "Update deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))