import os
import json
import re
from dotenv import load_dotenv
import requests
from app.models.blog_draft import Draft
from sqlalchemy.orm import Session
from fastapi import HTTPException

load_dotenv()
ollama_api_url = os.getenv("OLLAMA_URL")


# ─── Prompts ──────────────────────────────────────────────────────────────────

def build_blog_prompt(transcript: str) -> str:
    return f"""
You are an expert blog HTML generator.

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


def build_summary_prompt(content: str) -> str:
    # Strip HTML tags so the model reasons over plain text
    plain_text = re.sub(r"<[^>]+>", " ", content)
    plain_text = re.sub(r"\s+", " ", plain_text).strip()

    return f"""You are a technical blog metadata extractor.

TASK:
Read the blog content below and return a JSON object with exactly three fields.

STRICT RULES:
- Return ONLY a valid JSON object — nothing else
- No markdown, no code fences, no explanation, no preamble
- Response must start with {{ and end with }}
- All values must be plain strings (no nested objects or arrays)
- Follow the field rules exactly as described

FIELD RULES:

"summary"
  - One sentence, 20–40 words
  - Describes what the blog is about and who it helps
  - Plain English, no buzzwords

"tags"
  - Comma-separated list of 3–6 keywords
  - Use lowercase, no hashtags
  - Pick terms a developer would actually search for
  - Example: "react, hooks, state management, typescript"

"components"
  - Comma-separated list of tools, hardware, libraries, or frameworks mentioned
  - If none are mentioned, write "None"
  - Example: "STM32F407VG, FreeRTOS, STM32CubeIDE, ST-Link V2"

BLOG CONTENT:
{plain_text[:4000]}
"""
# Trim to 4000 chars to stay within context window of small models like gemma2:2b


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _call_ollama(prompt: str, timeout: int = 120) -> str:
    """
    Sends a prompt to Ollama and returns the raw response string.
    Raises HTTPException on any network or API failure.
    """
    try:
        response = requests.post(
            ollama_api_url,
            json={"prompt": prompt, "model": "gemma2:2b", "stream": False},
            timeout=timeout,
        )
        response.raise_for_status()
        return response.json().get("response", "")

    except requests.exceptions.ConnectionError:
        raise HTTPException(
            status_code=503,
            detail="Ollama is not reachable — make sure it is running.",
        )
    except requests.exceptions.Timeout:
        raise HTTPException(
            status_code=504,
            detail="Ollama timed out — try shorter content.",
        )
    except requests.exceptions.HTTPError as e:
        ollama_error = e.response.text if e.response is not None else str(e)
        raise HTTPException(status_code=502, detail=f"Ollama error: {ollama_error}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


def _parse_json_response(raw: str) -> dict:
    """
    Safely extracts a JSON object from the model's raw output.
    Handles cases where the model adds stray text around the JSON.
    """
    # Try direct parse first
    try:
        return json.loads(raw.strip())
    except json.JSONDecodeError:
        pass

    # Fall back: find the first {...} block in the output
    match = re.search(r"\{.*?\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group())
        except json.JSONDecodeError:
            pass

    # Give up gracefully — return empty defaults instead of crashing
    return {"summary": "", "tags": "", "components": ""}


# ─── Main functions ────────────────────────────────────────────────────────────

def generate_blog_with_ollama(
    video_id: str,
    video_title: str,
    video_transcript: str,
    db: Session,
):
    print(f"Fetching draft for video ID: {video_id}")

    if not video_id or not video_title or not video_transcript:
        raise HTTPException(
            status_code=400,
            detail="Video ID, title, and transcript are required.",
        )

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
            db.refresh(new_draft)
    else:
        new_draft = Draft(video_id=video_id, response="", status="Processing")
        db.add(new_draft)
        db.commit()
        db.refresh(new_draft)

    prompt = build_blog_prompt(video_transcript)
    html_content = ""

    try:
        html_content = _call_ollama(prompt, timeout=300)
        new_draft.response = html_content
        new_draft.status = "Completed"
        db.commit()
        db.refresh(new_draft)
        return new_draft

    except HTTPException:
        new_draft.status = "Error"
        db.commit()
        raise


def generate_summary_component_tags(content: str) -> dict:
    """
    Given the HTML or plain-text content of a blog post written by a user,
    calls Ollama to generate:

      - summary    : one-sentence description of the post (str)
      - tags       : comma-separated keywords, e.g. "react, hooks, typescript" (str)
      - components : comma-separated tools/hardware/libraries mentioned, e.g.
                     "STM32F407VG, FreeRTOS" — or "None" if not applicable (str)

    Returns a dict:
      {
        "summary": "...",
        "tags": "...",
        "components": "..."
      }

    Raises HTTPException if Ollama is unreachable or returns an error.
    """
    if not content or not content.strip():
        raise HTTPException(
            status_code=400,
            detail="Blog content is required to generate metadata.",
        )

    prompt = build_summary_prompt(content)
    raw_response = _call_ollama(prompt, timeout=120)
    result = _parse_json_response(raw_response)

    # Ensure all three keys exist even if the model skipped one
    return {
        "summary": result.get("summary", "").strip(),
        "tags": result.get("tags", "").strip(),
        "components": result.get("components", "").strip(),
    }