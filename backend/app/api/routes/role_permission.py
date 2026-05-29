from fastapi import APIRouter , Depends , HTTPException
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.role_permissions import create_role , create_permission , assign_permission_to_role, get_all_permissions, get_permissions_for_role
from app.schemas.role_permission import assign_permission_to_role_validation, create_permission_validation, creater_role_validation

router = APIRouter()

@router.post("/create-role")
def create_role_endpoint(data:creater_role_validation , db:Session = Depends(get_db)):
    try:
        role = create_role(data , db)
        return {"message" : "Role created successfully" , "role" : role}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException

@router.post("/create-permission")
def create_permission_endpoint(db:Session = Depends(get_db)):
    try:
        permission = create_permission(db)
        return {"message" : "Permission created successfully" , "permission" : permission}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException

@router.post("/assign-permission-to-role")
def assign_permission_to_role_endpoint(data:assign_permission_to_role_validation , db:Session = Depends(get_db)):
    try:
        role_permission = assign_permission_to_role(data , db)
        return {"message" : "Permission assigned to role successfully" , "role_permission" : role_permission}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
@router.get("/get-permissions-for-role/{role_id}")
def get_permissions_for_role_endpoint(role_id:int , db:Session = Depends(get_db)):
    try:
        permissions = get_permissions_for_role(role_id , db)
        return {"permissions" : permissions}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
@router.get("/get-all-permissions")
def get_all_permissions_endpoint(db:Session = Depends(get_db)):
    try:
        permissions = get_all_permissions(db)
        return {"permissions" : permissions}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
