from pydantic import BaseModel , EmailStr

class user_schema(BaseModel):
    # id:str 
    email:EmailStr 
    google_id:str 
    password:str 
    avatar_url:str 
    company:str

class login_schema(BaseModel):
    email:EmailStr 
    password:str

