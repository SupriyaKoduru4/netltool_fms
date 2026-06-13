import token
from jose import jwt
from fastapi import HTTPException, Header
from datetime import timedelta , datetime
from jose.exceptions import JWTError, ExpiredSignatureError

from app.utils.auth_config import SECRET_KEY, ALGORITHM, INVITATION_URL

def create_access_token(data:dict , expire_timedelta:timedelta = None):

    to_encode = data.copy()

    expire = datetime.utcnow() + (expire_timedelta or timedelta(hours=1))

    to_encode.update({"exp" : expire})

    encoded_jwt = jwt.encode(to_encode , SECRET_KEY , algorithm=ALGORITHM)

    return encoded_jwt

def verify_access_token(token:str):
    try:
        print("this is the token we are verifying in the verify access token function" , token)
        payload = jwt.decode(token , SECRET_KEY , algorithms=[ALGORITHM])
        print("this sifashdfaf",datetime.utcfromtimestamp(payload["exp"]))
        print(datetime.utcnow())
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401 , detail="User Not authenticated or Registered")
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401 , detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=401 , detail="Invalid token")


def verify_access_token_auth(authorization:str= Header(...)):
    try:
        if not authorization.startswith("Bearer "):
            raise HTTPException(
                status_code=401,
                detail="Invalid authorization format"
            )

        token = authorization.replace("Bearer ", "")
        # print("this is the token we are verifying in the verify access token function" , token)
        payload = jwt.decode(token , SECRET_KEY , algorithms=[ALGORITHM])
        print("this sifashdfaf",datetime.utcfromtimestamp(payload["exp"]))
        print(datetime.utcnow())
        user_id = payload.get("user_id")
        if user_id is None:
            raise HTTPException(status_code=401 , detail="User Not authenticated or Registered")
        return payload
    except ExpiredSignatureError:
        raise HTTPException(status_code=401 , detail="Token has expired")
    except JWTError:
        raise HTTPException(status_code=401 , detail="Invalid token")
