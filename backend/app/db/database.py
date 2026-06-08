from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()  # Load environment variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL") or "postgresql://postgres:50$#a$#502002@db.clqdiprnbhtwnexmyvsw.supabase.co:5432/postgres"

engine = create_engine(DATABASE_URL)

sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():

    db = sessionLocal()

    try:
        yield db

    finally:
        db.close()

base = declarative_base()