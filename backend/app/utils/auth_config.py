from datetime import timedelta
import os
from dotenv import load_dotenv

load_dotenv()


SECRET_KEY = "qwertyasdfgh"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

INVITE_TOKEN_EXPIRE_HOURS = 24

INVITATION_URL = f"{os.getenv("UI_BASE_URL")}/register?invitation_token="

PASSWORD_RESET_URL = f"{os.getenv("UI_BASE_URL")}/reset-password?reset-token="

