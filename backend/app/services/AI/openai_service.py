import requests
import os
from fastapi import HTTPException
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-5-mini")

def build_blog_metadata_prompt(title: str, html_content: str):
    return f"""
You are an expert technical blog editor.

TASK:
Improve the blog and generate metadata.

Return ONLY valid JSON.

Schema:

{{
  "enhanced_html": "...",
  "summary": "...",
  "tags": "...",
  "components": "..."
}}

RULES:

enhanced_html:
- Improve readability
- Preserve all information
- Add proper headings
- Add code block styling
- Add callouts
- Add key takeaways section
- Return valid HTML only
- it should occupy the full width of parent component and must be responsive as well

summary:
- 20-40 words

tags:
- 5-10 comma separated keywords

components:
- libraries, frameworks, hardware
- write "None" if unavailable

TITLE:
{title}

CONTENT:
{html_content}
"""

def _call_openai(system_prompt: str, user_prompt: str) -> str:
    try:
        response = client.responses.create(
            model=OPENAI_MODEL,
            input=[
                {
                    "role": "system",
                    "content": system_prompt
                },
                {
                    "role": "user",
                    "content": user_prompt
                }
            ]
        )

        return response.output_text

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"OpenAI error: {str(e)}"
        )