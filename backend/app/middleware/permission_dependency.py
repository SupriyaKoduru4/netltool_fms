from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.middleware.auth_middlware import get_current_user

from app.models.RolePermissions import RolePermission
from app.models.Permissions import Permission


def require_permission(
    required_permission:str
):

    def checker(

        current_user=Depends(
            get_current_user
        ),

        db:Session=Depends(
            get_db
        )

    ):

        print(current_user)

        role_id = current_user[
            "role"
        ]

        role_permissions = (

            db.query(RolePermission)

            .filter(
                RolePermission.role_id
                == role_id
            )

            .all()

        )

        permission_names = []

        for rp in role_permissions:

            permission = (

                db.query(Permission)

                .filter(
                    Permission.id
                    == rp.permission_id
                )

                .first()

            )

            if permission:

                permission_names.append(
                    permission.name
                )

        if required_permission not in permission_names:

            raise HTTPException(
                status_code=403,
                detail="Permission denied"
            )

        return current_user["user_id"]

    return checker