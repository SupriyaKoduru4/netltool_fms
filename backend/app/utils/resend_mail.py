# app/services/email_service.py

import os
import requests


def send_email(
    to_email: str,
    subject: str,
    html: str
):
    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
            "Authorization": f"Bearer {os.getenv('RESEND_API_KEY')}",
            "Content-Type": "application/json",
            },
            json={
            "from": "Team FMS <noreply@netltool.com>",
            
            "to": to_email,
            "subject": subject,
            "html": html,
        },
        timeout=30
    )
        print(response.status_code)
        print(response.text)
        return response.json()
    except Exception as e:
        return {"error": str(e)}


