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

# get video by id

# delete video by id