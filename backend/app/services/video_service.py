from fastapi import HTTPException

from app.models.blog_draft import Draft
from app.services.AI.ai_service import generate_blog_with_ollama
from fastapi import UploadFile
from sqlalchemy.orm import Session
from app.models.Video import Video

def save_video(file_name:str , title:str , description:str , transcript:str | None , user_id:str , db:Session):
    new_video = Video(
        title=title,
        description=description,
        url=f"uploads/videos/{file_name}",
        thumbnail_url=f"uploads/thumbnails/{file_name}.jpg",
        transcript=transcript,
        author_id=user_id
    )
    db.add(new_video)
    db.commit()
    db.refresh(new_video)
    print("this is the new video" , new_video)
    return new_video

def get_videos(db:Session):
    videos = db.query(Video).all()
    return videos

# update video

# get transcript draft
def get_draft(video_id: int, db: Session):
    video = db.query(Video).filter(Video.id == video_id).first()
    if not video:
        print("Video not found for ID:", video_id)
        raise HTTPException(status_code=404, detail="Video not found")

    draft = generate_blog_with_ollama(video_id, video.title, video.transcript, db)
    if(draft):
        return draft
    else:
        print("Draft generation failed for video ID:", video_id)
        return None
    

# get video by id

# delete video by id