from ast import expr

from app.utils import mail_config
from datetime import timedelta , datetime
from jose import jwt
from jose.exceptions import JWTError, ExpiredSignatureError
from app.schemas.user_schema import login_schema
from app.utils.security import hash_password, verify_password
from fastapi import HTTPException
from app.utils.auth_config import PASSWORD_RESET_URL, SECRET_KEY, ALGORITHM, INVITATION_URL

from app.schemas.User import UserCreate, UserRegister, requestResetPassword
from app.models.User import User
from sqlalchemy.orm import Session , joinedload
from app.services.mail_service import send_mail
from app.utils.mail_config import mail_config
from app.schemas.email_schema import EmailRequest

from app.utils.session_creator import create_access_token, verify_access_token


async def create_user_for_login(user: UserCreate, db: Session):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if db_user:
        raise HTTPException(400, "User already exists")

    db_user = User(
        email=user.email,
        first_name=user.first_name,
        role_id=user.role_id
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    # NOW id exists
    invitation_token = create_access_token(
        {"user_id": db_user.id , "role" : db_user.role_id} , expire_timedelta=timedelta(hours=24)
    )

    db_user.invitation_token = invitation_token
    db_user.invitation_expiry = datetime.utcnow() + timedelta(hours=24)

    db.commit()

    await send_mail(
        mail_config=mail_config,
        email_data=EmailRequest(
            to=[user.email],
            subject="Invitation Mail",
            body=f"{INVITATION_URL}{invitation_token}"
        )
    )

    return db_user
    

# login user 
def login_user(data:login_schema , db:Session):
    try:
        user = db.query(User).filter(User.email == data.email).first()
        if not user.is_active:
            raise HTTPException(status_code=401 , detail="Our account is disabled")
        if not user or user.is_deleted:
            raise HTTPException(status_code=404 , detail="User not found")
        verify = verify_password(data.password , user.password)
        if not verify:
            raise HTTPException(status_code=401 , detail="Invalid credentials")
        access_token = create_access_token({"user_id" : user.id , "role" : {"role_id":user.role.id, "role_name":user.role.name}})
        return {"access_token" : access_token , "token_type" : "bearer"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))


# register user 
def register_user(data: dict, invitation_token:str , db:Session):
    try:
        user= verify_access_token(invitation_token)
        user = db.query(User).filter(User.id == user["user_id"]).first()
        if not user:
            raise HTTPException(status_code=404 , detail="User not found")
        if user.is_register:
            raise HTTPException(status_code=400 , detail="User already registered")
        
        print("this is the data we are getting in the register user function" , data) 
        user.password = hash_password(data["password"])
        user.avatar_url = data["avatar_url"]
        user.company = data["company"]
        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.phone = data["phone"]
        user.is_register = True

        db.commit()
        db.refresh(user)

        return user
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500 , detail=str(e))

# update user 

#soft delete user 

# get user 
def get_users(db:Session):
    try:
        users = (
        db.query(User)
        .options(joinedload(User.role))
        .all()
        )   
        return users
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
# delete user for testing purpose only
def delete_user(db:Session , user_id:int):
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404 , detail="User not found")
        db.delete(user)
        db.commit()
        return {"message" : "User deleted successfully"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500 , detail=str(e))

# check token expr and expiry for invitation link
def check_invitation_token(token:str , db:Session):
    try:
        user = verify_access_token(token)
        user_details=get_user_by_id(user["user_id"] , db)
        return user_details
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
# get user profile 
def get_user_profile(token:str , db:Session):
    try:
        user = verify_access_token(token)
        user_id = user["user_id"]
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404 , detail="User not found")
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
def admin_update_user(data:UserCreate , user_id:int , db:Session):
    try:
        user = db.query(User).options(joinedload(User.role)).filter(User.id==user_id).first()
        user.email=data.email
        user.role_id=data.role_id
        user.first_name = data.first_name
        db.commit()
        db.refresh(user)
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    

def get_user_by_id(user_id:int , db:Session):
    try:
        user = db.query(User).options(joinedload(User.role)).filter(User.id==user_id).first()
        return user 
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))

def disable_user(user_id:int , db:Session):
    try:
        user = db.query(User).filter(User.id==user_id).first()    
        user.is_active = not user.is_active
        db.commit()
        db.refresh(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
def sofl_delete_user(user_id:int , db:Session):
    try:
        user = db.query(User).filter(User.id==user_id).first()
        user.is_deleted = not user.is_deleted 
        db.commit()
        db.refresh(user)
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
def get_user_login_details(token:str , db:Session):
    try:
        user = verify_access_token(token)
        user_id = user["user_id"]
        user = db.query(User).options(joinedload(User.role)).filter(User.id==user_id).first()
        if not user:
            raise HTTPException(status_code=404 , detail="User not found")
        user.password = None
        return user
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))

async def send_reset_password_mail(email:str , db:Session):
    try:
        user = db.query(User).filter(User.email == email).first()
        print("this is the user we are getting in the send reset password mail function" , user.id)
        if not user:
            raise HTTPException(status_code=404 , detail="User not found")
        reset_token = create_access_token({"user_id": user.id , "role_id": user.role_id} , expire_timedelta=timedelta(hours=1))
        await send_mail(
            mail_config=mail_config,
            email_data=EmailRequest(
                to=[email],
                subject="Reset Password",
                body=f"{PASSWORD_RESET_URL}{reset_token}"
            )
        )
        return {"message" : "Reset password mail sent successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
    
async def reset_password(token:str , new_password:str , db:Session):
    try:
        user = verify_access_token(token)
        user_id = user["user_id"]
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404 , detail="User not found")
        user.password = hash_password(new_password)
        db.commit()
        db.refresh(user)
        return {"message" : "Password reset successfully"}
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))



