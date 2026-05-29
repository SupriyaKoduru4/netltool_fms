from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.services.authentication_service import verify_access_token

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="login"
)

def get_current_user(
    token: str = Depends(
        oauth2_scheme
    )
):

    payload = verify_access_token(
        token
    )

    return payload