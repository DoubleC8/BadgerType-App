from contextlib import asynccontextmanager
from fastapi import FastAPI
from database import create_db_and_tables

# Define the lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    # --- STARTUP LOGIC ---
    # Everything before the 'yield' runs when the server starts
    create_db_and_tables()
    
    yield # This hands control over to the FastAPI application
    
    # --- SHUTDOWN LOGIC ---
    # Anything after the 'yield' would run when the server stops.
    # We don't need any shutdown logic right now, so we just leave it blank!

# Pass the lifespan function into your FastAPI instance
app = FastAPI(title="BadgerType API", lifespan=lifespan)
    
@app.get("/health")
def health_check():
    return {"status": "ok"}