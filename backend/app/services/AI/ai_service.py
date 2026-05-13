import requests
from app.models.blog_draft import Draft
from sqlalchemy.orm import Session

def generate_blog_with_ollama(video_id:str , video_title:str , video_transcript:str , db:Session):
    ollama_api_url = "http://localhost:11434/api/generate"
    payload = {
        "video_id": video_id,
        "video_title": video_title,
        "video_transcript": video_transcript
    }


    prompt = f"""
    You are a professional technical blog writer and frontend UI designer.

Generate a modern, visually appealing HTML blog article from the provided transcript.

IMPORTANT OUTPUT RULES:

* Return ONLY raw HTML.
* Do NOT return JSON.
* Do NOT escape characters.
* Do NOT include \n or ".
* Do NOT include markdown.
* Do NOT include ```html.
* Start directly with <article>.
* End with </article>.

DESIGN REQUIREMENTS:

* Use semantic HTML.
* Use inline TailwindCSS utility classes.
* Make the design modern, minimal, and professional.
* Add:

  * hero section
  * title
  * introduction
  * section headings
  * highlighted quote blocks
  * conclusion
* Ensure readability on dark and light backgrounds.
* Use spacing and typography properly.
* Keep content SEO friendly.
* Improve grammar and readability.
* Remove repetitive speech from transcript.

USE:

* article
* section
* h1
* h2
* h3
* p
* ul
* li
* blockquote
* code
* pre

STYLE:

* modern SaaS blog aesthetic
* clean spacing
* rounded sections
* elegant typography

here are the details of the video:
{payload}

    """
    try:
        if not video_id or not video_title or not video_transcript:
            print("Invalid video details")
            return None
        existing_draft = db.query(Draft).filter(Draft.video_id == video_id).first()
        if existing_draft:
            print("Draft already exists for this video")
            return existing_draft
        new_draft = Draft(video_id=video_id, response="", status="Processing")
        db.add(new_draft)
        db.commit()
        response = requests.post(ollama_api_url, json={
            "prompt": prompt,
            "model": "llama3",
            "stream": False
            })
        
        response.raise_for_status()
        final_html = response.json()
        print("this is the final html" , final_html)
        # new_draft = Draft(video_id=video_id, response=final_html, status="Draft")
        db.add(new_draft)
        db.commit()
        return new_draft
    except requests.exceptions.RequestException as e:
        new_draft = Draft(video_id=video_id, response="", status="Error")
        db.add(new_draft)
        db.commit()
        print(f"Error generating blog with Ollama: {e}")
        return None