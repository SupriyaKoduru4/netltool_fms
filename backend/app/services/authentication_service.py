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
# from app.services.mail_service import send_mail
from app.utils.resend_mail import send_email
from app.utils.mail_config import mail_config
from app.schemas.email_schema import EmailRequest

from app.utils.session_creator import create_access_token, verify_access_token


def reset_html(reset_token):
    reset_link = f"{PASSWORD_RESET_URL}{reset_token}"

    RESET_PASSWORD_EMAIL_HTML = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset your netltool password</title>
  <style>
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background-color: #f3f2f0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 2rem 1rem;
      -webkit-font-smoothing: antialiased;
    }}
    .wrapper  {{ max-width: 520px; margin: 0 auto; }}
    .card     {{ background: #ffffff; border-radius: 14px; border: 0.5px solid #e5e5e2; overflow: hidden; }}

    .navbar   {{ background: #0f0e17; padding: 1rem 1.5rem; display: flex; align-items: center; gap: 10px; }}
    .logo-box {{ width: 26px; height: 26px; background: #ffffff; border-radius: 6px; display: inline-flex; align-items: center; justify-content: center; }}
    .brand    {{ font-size: 15px; font-weight: 500; color: #ffffff; letter-spacing: -0.01em; }}
    .brand span {{ color: #9ca3af; font-weight: 400; }}

    .body     {{ padding: 2rem 1.75rem 1.5rem; }}
    .icon-wrap {{ width: 46px; height: 46px; background: #f7f6f4; border: 0.5px solid #e5e5e2; border-radius: 11px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem; }}
    .eyebrow  {{ font-size: 11px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; color: #9ca3af; margin-bottom: 6px; }}
    .heading  {{ font-size: 20px; font-weight: 500; color: #111111; margin-bottom: 10px; line-height: 1.3; }}
    .intro    {{ font-size: 14px; color: #555555; line-height: 1.7; margin-bottom: 1.5rem; }}
    .intro strong {{ color: #111111; font-weight: 500; }}

    .cta-btn  {{ display: block; text-align: center; background: #0f0e17; color: #ffffff !important; text-decoration: none; font-size: 14px; font-weight: 500; padding: 13px 24px; border-radius: 10px; margin-bottom: 1.25rem; letter-spacing: -0.01em; }}

    .divider  {{ display: flex; align-items: center; gap: 10px; margin-bottom: 1.25rem; }}
    .divider-line {{ flex: 1; height: 0.5px; background: #e5e5e2; }}
    .divider-text {{ font-size: 11px; color: #b0aea8; white-space: nowrap; }}

    .link-box  {{ background: #f7f6f4; border: 0.5px solid #e5e5e2; border-radius: 9px; padding: 9px 12px; display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 1.5rem; }}
    .link-text {{ font-size: 12px; color: #9ca3af; font-family: 'Courier New', monospace; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }}
    .copy-btn  {{ flex-shrink: 0; font-size: 12px; font-weight: 500; color: #555555; background: #ffffff; border: 0.5px solid #d1d0cc; border-radius: 6px; padding: 5px 10px; text-decoration: none; white-space: nowrap; }}

    .info-grid  {{ display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 8px; margin-bottom: 1.5rem; }}
    .info-pill  {{ background: #f7f6f4; border: 0.5px solid #e5e5e2; border-radius: 9px; padding: 11px 12px; }}
    .pill-icon  {{ font-size: 16px; color: #9ca3af; margin-bottom: 6px; display: block; }}
    .pill-title {{ font-size: 12px; font-weight: 500; color: #111111; margin-bottom: 2px; }}
    .pill-sub   {{ font-size: 11px; color: #9ca3af; }}

    .note-box   {{ background: #f7f6f4; border: 0.5px solid #e5e5e2; border-radius: 9px; padding: 12px 14px; display: flex; align-items: flex-start; gap: 10px; }}
    .note-icon  {{ font-size: 15px; color: #9ca3af; flex-shrink: 0; margin-top: 1px; }}
    .note-text  {{ font-size: 12px; color: #6b6966; line-height: 1.6; }}

    .footer     {{ border-top: 0.5px solid #e5e5e2; background: #f7f6f4; padding: 0.875rem 1.5rem; display: flex; align-items: center; justify-content: space-between; }}
    .footer-brand {{ display: flex; align-items: center; gap: 7px; }}
    .footer-logo  {{ width: 17px; height: 17px; background: #0f0e17; border-radius: 4px; display: inline-flex; align-items: center; justify-content: center; }}
    .footer-name  {{ font-size: 12px; color: #9ca3af; }}
    .footer-links {{ display: flex; gap: 12px; }}
    .footer-links a {{ font-size: 11px; color: #b0aea8; text-decoration: none; }}

    .below-note {{ text-align: center; font-size: 11px; color: #b0aea8; margin-top: 1rem; }}
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">

      <!-- Navbar -->
      <div class="navbar">
        <div class="logo-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0f0e17" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <span class="brand">netl<span>tool</span></span>
      </div>

      <!-- Body -->
      <div class="body">

        <div class="icon-wrap">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#888" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <p class="eyebrow">Password reset</p>
        <h1 class="heading">Reset your password</h1>
        <p class="intro">
          We received a request to reset the password for your
          <strong>netltool</strong> account. Click the button below
          to choose a new password.
        </p>

        <!-- ✅ reset_link inserted here via f-string -->
        <a href="{reset_link}" class="cta-btn">Reset password</a>

        <div class="divider">
          <div class="divider-line"></div>
          <span class="divider-text">or copy the link</span>
          <div class="divider-line"></div>
        </div>

        <!-- ✅ reset_link shown in the copy box too -->
        <div class="link-box">
          <span class="link-text">{reset_link}</span>
          <span class="copy-btn">Copy link</span>
        </div>

        <div class="info-grid">
          <div class="info-pill">
            <svg class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <p class="pill-title">15 min expiry</p>
            <p class="pill-sub">Link expires soon</p>
          </div>
          <div class="info-pill">
            <svg class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <p class="pill-title">Single use</p>
            <p class="pill-sub">One-time link</p>
          </div>
          <div class="info-pill">
            <svg class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
            <p class="pill-title">Secure</p>
            <p class="pill-sub">Only for you</p>
          </div>
        </div>

        <div class="note-box">
          <svg class="note-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p class="note-text">
            If you didn't request a password reset, you can safely ignore this email.
            Your password won't change unless you click the button above.
          </p>
        </div>

      </div>

      <!-- Footer -->
      <div class="footer">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span class="footer-name">netltool</span>
        </div>
        <div class="footer-links">
          <a href="#">Privacy</a>
          <a href="#">Help</a>
          <a href="#">Unsubscribe</a>
        </div>
      </div>

    </div>

    <p class="below-note">This link will expire in 15 minutes for your security.</p>
  </div>
</body>
</html>"""

    return RESET_PASSWORD_EMAIL_HTML


def html_template(invitation_token: str):
    invite_link = f"{INVITATION_URL}{invitation_token}"

    return f"""
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Invitation</title>
    </head>
    <body style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        <table width="100%" cellspacing="0" cellpadding="0">
            <tr>
                <td align="center">
                    <table width="600" cellspacing="0" cellpadding="0"
                        style="background-color: #ffffff; border-radius: 8px; padding: 40px;">
                        
                        <tr>
                            <td align="center">
                                <h1 style="color: #333;">You're Invited!</h1>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="font-size: 16px; color: #555;">
                                    You have been invited to join our platform.
                                </p>

                                <p style="font-size: 16px; color: #555;">
                                    Click the button below to accept your invitation and get started.
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td align="center" style="padding: 30px 0;">
                                <a href="{invite_link}"
                                    style="
                                        background-color: #2563eb;
                                        color: white;
                                        text-decoration: none;
                                        padding: 12px 24px;
                                        border-radius: 6px;
                                        display: inline-block;
                                        font-weight: bold;
                                    ">
                                    Accept Invitation
                                </a>
                            </td>
                        </tr>

                        <tr>
                            <td>
                                <p style="font-size: 14px; color: #888;">
                                    If the button doesn't work, copy and paste the following link into your browser:
                                </p>

                                <p style="word-break: break-all;">
                                    <a href="{invite_link}">
                                        {invite_link}
                                    </a>
                                </p>
                            </td>
                        </tr>

                        <tr>
                            <td style="padding-top: 30px;">
                                <hr>
                                <p style="font-size: 12px; color: #999; text-align: center;">
                                    This invitation link may expire. If you did not expect this invitation, you can safely ignore this email.
                                </p>
                            </td>
                        </tr>

                    </table>
                </td>
            </tr>
        </table>
    </body>
    </html>
    """


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

  

    send_email(
        subject="Inviation for login in FMS Dashboard" , 
        to_email=db_user.email , 
        html=html_template(invitation_token)
    )

    db.commit()

    return db_user
    
def resend_registration(user_id:int , db:Session):
    try:
        user = db.query(User).filter(User.id==user_id).first()
        invitation_token = create_access_token(
        {"user_id": user.id , "role" : user.role_id} , expire_timedelta=timedelta(hours=24)
        )
        user.invitation_token = invitation_token
        user.invitation_expiry = datetime.utcnow() + timedelta(hours=24)
        send_email(
           subject="Inviation for login in FMS Dashboard" , 
        to_email=user.email , 
        html=html_template(invitation_token)
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500 , detail=str(e))
        
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
        access_token = create_access_token({"user_id" : user.id , "role" :user.role_id})
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
        send_email(
            subject="Here is your reset password link" , 
            to_email=user.email,
            html=reset_html(reset_token)
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

def update_user_profile(data: dict, user_id: int, db: Session):
    try:
        user = db.query(User).filter(User.id == user_id).first()

        if not user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        for key, value in data.items():
            setattr(user, key, value)

        db.commit()
        db.refresh(user)

        return user

    except HTTPException as e:
        raise e

