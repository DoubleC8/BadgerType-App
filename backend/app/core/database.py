import os
from sqlmodel import SQLModel, create_engine, Session
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

# Create the engine (the core interface to the database)
engine = create_engine(DATABASE_URL, echo=True)

# Function to initialize the database tables
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

# Dependency to use in your FastAPI routes later
def get_session():
    with Session(engine) as session:
        yield session
        