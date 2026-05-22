from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://postgres:robotics123@localhost/netltoolfms"

engine = create_engine(DATABASE_URL)

sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():

    db = sessionLocal()

    try:
        yield db

    finally:
        db.close()

base = declarative_base()