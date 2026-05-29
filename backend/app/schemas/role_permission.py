from pydantic import BaseModel

class creater_role_validation(BaseModel):
    name:str 
    description:str

class create_permission_validation(BaseModel):
    name:str 
    description:str

class assign_permission_to_role_validation(BaseModel):
    role_id:int 
    permission_id:list[int]