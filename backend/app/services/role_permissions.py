from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.models.Roles import Role
from app.models.Permissions import Permission
from app.models.RolePermissions import RolePermission
from app.schemas.role_permission import creater_role_validation,create_permission_validation,assign_permission_to_role_validation
from app.constants.permissions import Permissions

# create role 
def create_role(data:creater_role_validation , db:Session):
    try:
        role = Role(
            name=data.name,
            description=data.description
        )
        db.add(role)
        db.commit()
        db.refresh(role)
        return role
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))


# create permissions 
def create_permission(db:Session):
    try:
        permissions = [

        Permissions.BLOG_CREATE,
        Permissions.BLOG_VIEW,

        Permissions.PROJECT_CREATE,
        Permissions.PROJECT_UPDATE,
        Permissions.PROJECT_DELETE,

        Permissions.STREAMLAB_ACCESS,

        Permissions.USER_CREATE,
        Permissions.USER_DELETE ,  
    
        ]
    
        for perm in permissions:
            existing_perm = db.query(Permission).filter(Permission.name == perm).first()
            if not existing_perm:
                permission = Permission(
                    name=perm,
                    description=f"Permission for {perm}"
                )
                db.add(permission)
        db.commit()
        return {"message" : "Permissions created successfully"}
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))

# assign permissions to role
def assign_permission_to_role(data:assign_permission_to_role_validation , db:Session):
    try:
        for perm_id in data.permission_id:
            existing_assignment = db.query(RolePermission).filter(
                RolePermission.role_id == data.role_id,
                RolePermission.permission_id == perm_id
            ).first()
            if not existing_assignment:
                role_permission = RolePermission(
                    role_id=data.role_id,
                    permission_id=perm_id
                )
                db.add(role_permission)
        db.commit()
        return {"message" : "Permissions assigned to role successfully"}
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))

def get_permissions_for_role(role_id:int , db:Session):
    try:
        permissions = db.query(Permission).join(RolePermission).filter(RolePermission.role_id == role_id).all()
        return permissions
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))

def get_roles_for_permission(permission_id:int , db:Session):
    try:
        roles = db.query(Role).join(RolePermission).filter(RolePermission.permission_id == permission_id).all()
        return roles
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))

def get_all_permissions(db:Session):
    try:
        permissions = db.query(Permission).all()
        return permissions
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    


