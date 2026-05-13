from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.schemas.user_schema import user_schema
from app.models.User import User
from app.utils.security import hash_password , verify_password
from app.schemas.user_schema import login_schema
import uuid


def register_user(user_data: user_schema , db:Session):
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400 , detail="Email already registered")        
    print("this is the user data" , user_data)
    hassed_password = hash_password(user_data.password)
    user_id = uuid.uuid4().hex
    print("this are the details" , hassed_password , user_id)
    new_user =  User(
        id=user_id,
        email=user_data.email,
        google_id=user_data.google_id,
        password=hassed_password,
        avatar_url=user_data.avatar_url,
        company=user_data.company
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

#login user function will be added later
def login_user(login_data: login_schema, db: Session):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if not verify_password(login_data.password, user.password):
        raise HTTPException(status_code=400, detail="Invalid password")
    return user

#profile 

