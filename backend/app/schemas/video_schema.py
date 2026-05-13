from pydantic import BaseModel


class VideoUploadRequest(BaseModel):
    title: str
    description: str
    transcript: str | None
