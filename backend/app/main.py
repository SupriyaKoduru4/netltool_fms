from fastapi.staticfiles import StaticFiles

from app.api.api_router import api_router 
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

origins = [
    "http://localhost",
    "http://localhost:5173",
    "https://fms.netltool.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    api_router,
    prefix="/api",
    tags=["api"]
)




@app.get("/")
async def root():
    return {"messsage":"You netltool backend is ready let's make benchmark"}

