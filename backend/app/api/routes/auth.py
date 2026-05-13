
from fastapi import APIRouter , Depends, Header, HTTPException
from app.schemas.user_schema import login_schema, user_schema
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.services.auth_service import login_user, register_user

router = APIRouter()

def  get_current_user(user:str = Header(None)):
    if user is None:
        raise HTTPException(status_code=401, detail="Unauthorized")
    return user


@router.post("/register")
async def register(user: user_schema  , db: Session = Depends(get_db)):

    # Exception("This is a test exception to check async handler")
    new_user = register_user(user_data=user, db=db)
    print("this is the new user" , new_user)
    return {"message": "User registered successfully", "user_id": new_user.id}

@router.post("/login")
async def login(request: login_schema , db: Session = Depends(get_db)):
    user = login_user(login_data=request, db=db)
    return {"message": "Login successful", "user": {"id": user.id, "email": user.email , "avatar_url": user.avatar_url , "company": user.company}}

