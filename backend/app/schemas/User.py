from typing import Optional
from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    first_name:str
    role: str = "User"

class UserRegister(BaseModel):
    password: str
    avatar_Url: Optional[str] = None
    company: Optional[str] = None
    first_name:str 
    last_name:str
    phone:str
    

