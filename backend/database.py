import os
from dotenv import load_dotenv
from sqlmodel import SQLModel, create_engine, Session

# Load the variables from the .env file
load_dotenv()

# Safely fetch the URL
DATABASE_URL = os.environ.get("DATABASE_URL")

# Create the engine 
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)
    
def get_session():
    with Session(engine) as session:
        yield session