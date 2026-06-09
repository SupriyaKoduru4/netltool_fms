from app.schemas.user_schema import login_schema
from app.utils.profile_upload import validate_profile_image , upload_profile_image
from fastapi import APIRouter , Depends , HTTPException , Header , UploadFile , File , Form
from app.schemas.User import UserCreate, UserRegister, requestResetPassword
from sqlalchemy.orm import Session
from typing import Optional

from app.db.database import get_db
from app.schemas.User import UserCreate
from app.services.authentication_service import check_invitation_token, create_user_for_login, delete_user, get_user_profile, get_users, login_user , register_user , admin_update_user , get_user_by_id , disable_user, reset_password, send_reset_password_mail , sofl_delete_user , get_user_login_details, verify_access_token , update_user_profile
from app.utils.session_creator import verify_access_token_auth
from app.middleware.permission_dependency import require_permission
from app.constants.permissions import Permissions

router = APIRouter()


@router.post("/create-user-for-login")
async def create(
    user : UserCreate,
    current_user:str = Depends(require_permission(Permissions.USER_CREATE)),
    db : Session = Depends(get_db)
):
    try:
        user = await create_user_for_login(user , db)
        return {"message" : "User created successfully" , "user" : user}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
@router.get("/users")
def get_all_users(db:Session = Depends(get_db)):
    try:
        users = get_users(db)
        
        return {"users" : users}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
@router.delete("/delete-user/{user_id}")
def delete(user_id:int , db:Session = Depends(get_db)):
    try:
        result = delete_user(db , user_id)
        return result
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
@router.put("/register-user")
def register(
    first_name: str = Form(...),
    last_name: str = Form(...),
    phone: str = Form(...),
    company: str = Form(None),
    password: str = Form(...),
    profile_image: UploadFile = Depends(validate_profile_image),
    authorization: str = Header(...),
    db: Session = Depends(get_db)):
    try:
        token = authorization.replace("Bearer ", "")
        print("this is the token we are getting in the header " , token)
        user = verify_access_token(token)
        profile_image_path = upload_profile_image(profile_image, user["user_id"])
        user = register_user({" ":user["user_id"], "first_name": first_name, "last_name": last_name, "phone": phone, "company": company, "avatar_url": profile_image_path, "password": password}, token , db)
        return {"message" : "User registered successfully" , "user" : user}
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException
    
@router.get("/check-invitation-token")
def check_token_validation(authorization:str = Header(...), db:Session = Depends(get_db)):
    try:
        token = authorization.replace("Bearer ", "")
        print("this is the token we are getting in the header" , token)
        user = check_invitation_token(token , db)
        return {"message" : "Token is valid" , "user" : user}
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500 , detail=str(e))
        raise httpException

@router.get("/profile")
def get_profile(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        token = authorization.replace("Bearer ", "")
        user = get_user_profile(token, db)
        return {"user": user}
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException
    
@router.post("/login")
def login(data:login_schema , db:Session = Depends(get_db)):
    try:
        user = login_user(data , db)
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException
    
@router.put("/admin-user-update/{user_id}")
def admin_update(data:UserCreate, user_id:int , db:Session = Depends(get_db)):
    try:
        user = admin_update_user(data, user_id, db)
        return {"message":"User successfully created" , "user":user}
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException
    
@router.get("/get-user/{user_id}")
def get_user_details(user_id:int , db:Session=Depends(get_db)):
    try:
        user = get_user_by_id(user_id , db)
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException

@router.put("/user-disable/{user_id}")
def admin_disable_user(user_id:int ,current_user:str=Depends(require_permission(Permissions.USER_CREATE)), db:Session=Depends(get_db)):
    try:
        disable_user(user_id , db)
        return {"message":"User disable successfullly"}
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException
    
@router.put("/delete-user/{user_id}")
def admin_delete_user(user_id:int, current_user:str=Depends(require_permission(Permissions.USER_DELETE)) , db:Session=Depends(get_db)):
    try:
        sofl_delete_user(user_id , db)
        return {"message":"User delelted successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException
    
@router.get("/user-details")
def user_details_after_login(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        token = authorization.replace("Bearer ", "")
        user = get_user_login_details(token, db)
        return {"user": user}
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException

@router.post("/reset-password-request")
async def request_reset_password(email: requestResetPassword, db: Session = Depends(get_db)):
    try:
        result = await send_reset_password_mail(email.email, db)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException
    
@router.post("/reset-password")
async def reset_password_route(new_password:str = Form(...) , authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        token = authorization.replace("Bearer ", "")
        print("this is the token we are getting in the header" , token)
        result = await reset_password(token, new_password, db)
        return result
    except HTTPException as e:
        raise e
    except Exception as e:
        httpException = HTTPException(status_code=500, detail=str(e))
        raise httpException



@router.put("/update-profile")
def update_profile_route(
    first_name: Optional[str] = Form(None),
    last_name: Optional[str] = Form(None),
    phone: Optional[str] = Form(None),
    company: Optional[str] = Form(None),
    profile_image: UploadFile | None = File(None),
    user=Depends(verify_access_token_auth),
    db: Session = Depends(get_db)
):
    try:
        update_data = {}

        if first_name is not None:
            update_data["first_name"] = first_name

        if last_name is not None:
            update_data["last_name"] = last_name

        if phone is not None:
            update_data["phone"] = phone

        if company is not None:
            update_data["company"] = company

        if profile_image:
            profile_image_path = upload_profile_image(
                profile_image,
                user["user_id"]
            )
            update_data["avatar_url"] = profile_image_path

        updated_user = update_user_profile(
            update_data,
            user["user_id"],
            db
        )

        return {
            "message": "Profile updated successfully",
            "user": updated_user
        }

    except HTTPException as e:
        raise e
