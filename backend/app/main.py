from app.api.api_router import api_router 
from fastapi import FastAPI

app = FastAPI()

app.include_router(
    api_router,
    prefix="/api",
    tags=["api"]
)


@app.get("/")
async def root():
    return {"messsage":"You netltool backend is ready let's make benchmark"}

