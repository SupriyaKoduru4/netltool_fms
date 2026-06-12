from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    first_name:str
    role_id : int

class UserRegister(BaseModel):
    password: str
    avatar_Url: Optional[str] = None
    company: Optional[str] = None
    first_name:str 
    last_name:str
    phone:str

class requestResetPassword(BaseModel):
    email:str

class requestInvitation(BaseModel):
    user_id:int
    
    

