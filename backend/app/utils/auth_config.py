from datetime import timedelta

SECRET_KEY = "qwertyasdfgh"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

INVITE_TOKEN_EXPIRE_HOURS = 24

INVITATION_URL = "http://localhost:3000/verify-email?token="

PASSWORD_RESET_URL = "http://localhost:3000/reset-password?token="

