from datetime import datetime
import os

from app.models.blog_draft import Draft
from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    Form,
    HTTPException , 
    BackgroundTasks
)

from sqlalchemy.orm import Session
from app.models.Video import Video
from app.db.database import get_db
from app.api.routes.auth import get_current_user
from app.services.video_service import get_draft, save_video , get_videos
from app.task.video_transcript_process import process_video_transcript
from app.services.AI.ai_service import generate_blog_with_ollama

router = APIRouter()

UPLOAD_DIR = "uploads/videos"

os.makedirs(UPLOAD_DIR, exist_ok=True)

def validate_video_file(
    video_file: UploadFile = File(...)
):
    allowed_extensions = [".mp4", ".avi", ".mkv"]

    extension = os.path.splitext(video_file.filename)[1]

    if extension.lower() not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported file type"
        )

    return video_file


@router.post("/upload")
async def upload_video(
    background_tasks: BackgroundTasks,
    title: str = Form(...),
    description: str = Form(...),
    transcript: str | None = Form(None),
    video_file: UploadFile = Depends(validate_video_file),
    current_user: str = Depends(get_current_user),
    db: Session = Depends(get_db), 
):

    extension = os.path.splitext(video_file.filename)[1]

    timestamp = datetime.utcnow().strftime("%Y%m%d%H%M%S")

    file_name = f"{title}_{current_user}_{timestamp}{extension}"

    file_path = os.path.join(UPLOAD_DIR, file_name)

    with open(file_path, "wb") as f:
        f.write(await video_file.read())

    new_video = save_video(
        file_name=file_name,
        title=title,
        description=description,
        transcript=transcript,
        user_id=current_user,
        db=db
    )

    background_tasks.add_task(process_video_transcript, video_id=new_video.id)
    #generate blog with ollama
    
    return {
        "message": "Video uploaded successfully",
        "file_path": file_path
    }

@router.get("/videos/status/{video_id}")
async def get_video_status(
    video_id: int,
    db: Session = Depends(get_db)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"video": video, "status": video.video_status}


@router.get("/list")
async def list_videos(
    db: Session = Depends(get_db)
):
    videos = get_videos(db)
    return {"videos": videos}

@router.get("/transcript/{video_id}")
async def get_video_transcript(
    video_id: int,
    db: Session = Depends(get_db)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    return {"video": video, "transcript": video.transcript}

@router.get("/transcript-retry/{video_id}")
async def retry_video_transcript(
    video_id: int,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        raise HTTPException(status_code=404, detail="Video not found")
    
    video.video_status = "processing"
    db.commit()

    background_tasks.add_task(process_video_transcript, video_id=video_id)
    #generate blog with ollama

    return {"message": "Transcript processing retried", "video_id": video_id}

@router.get("/video-blog-draft/{video_id}")
async def get_video_blog_draft(
    video_id: int,
    db: Session = Depends(get_db)
):
    draft = get_draft(video_id, db)
    if not draft:
        raise HTTPException(status_code=404, detail="Draft not found")
    return {"draft": draft}
