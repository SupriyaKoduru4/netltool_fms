from app.db.database import engine

try:
    connection = engine.connect()
    print("Database connection successful!")
except Exception as e:
    print(f"Database connection failed: {e}")
