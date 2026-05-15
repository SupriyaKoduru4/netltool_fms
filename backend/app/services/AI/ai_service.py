import os
from dotenv import load_dotenv
import requests
from app.models.blog_draft import Draft
from sqlalchemy.orm import Session
from fastapi import HTTPException

load_dotenv()
ollama_api_url = os.getenv("OLLAMA_URL")

def build_blog_prompt(transcript: str) -> str:
    return f"""
YYou are an expert blog HTML generator.

TASK:
Convert the transcript into a modern professional blog page.

STRICT RULES:
- Return ONLY raw HTML
- Do NOT use markdown
- Do NOT explain anything
- Do NOT wrap response in ```html
- Response must start with <!DOCTYPE html>
- Response must end with </html>
- No text before or after HTML
- Generate production-ready responsive blog design
- Use modern CSS styling
- Make it visually appealing
- Use semantic HTML5
- Add:
  - Hero section
  - Article sections
  - Styled headings
  - Quote blocks
  - Key takeaways section
  - Footer
- Use dark modern blog styling
- Content width should look like Medium/substack
- Rewrite transcript into professional article format
- Remove filler words

TRANSCRIPT:
{transcript}
"""

def generate_blog_with_ollama(video_id: str, video_title: str, video_transcript: str, db: Session):
    print(f"Fetching draft for video ID: {video_id}")

    if not video_id or not video_title or not video_transcript:
        raise HTTPException(status_code=400, detail="Video ID, title, and transcript are required.")
    
    new_draft = None
    existing_draft = db.query(Draft).filter(Draft.video_id == video_id).first()
    print(f"Existing draft found: {existing_draft}")
    
    if existing_draft:
        if existing_draft.status == "Completed":
            return existing_draft
        else:
            new_draft = existing_draft
            new_draft.status = "Processing"
            db.commit()
            db.refresh(new_draft)  # ✅ Fix: reload after commit
    else:
        new_draft = Draft(video_id=video_id, response="", status="Processing")
        db.add(new_draft)
        db.commit()
        db.refresh(new_draft)  # ✅ Fix: reload after first insert

    prompt = build_blog_prompt(video_transcript)

    try:
        response = requests.post(
            ollama_api_url,
            json={"prompt": prompt, "model": "gemma2:2b", "stream": False},
            timeout=300
        )
        response.raise_for_status()

        html_content = response.json().get("response", "")
        new_draft.response = html_content
        new_draft.status = "Completed"
        db.commit()
        db.refresh(new_draft)  # ✅ Fix: reload before returning
        return new_draft

    except requests.exceptions.ConnectionError:
        new_draft.status = "Error"
        db.commit()
        raise HTTPException(status_code=503, detail="Ollama is not reachable — make sure it is running.")

    except requests.exceptions.Timeout:
        new_draft.status = "Error"
        db.commit()
        raise HTTPException(status_code=504, detail="Ollama timed out — try a shorter transcript.")

    except requests.exceptions.HTTPError as e:
        new_draft.status = "Error"
        db.commit()
        ollama_error = e.response.text if e.response is not None else str(e)
        raise HTTPException(status_code=502, detail=f"Ollama error: {ollama_error}")

    except Exception as e:
        new_draft.status = "Error"
        db.commit()
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")