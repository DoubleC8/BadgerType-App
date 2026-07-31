from fastapi import FastAPI
from database import create_db_and_tables

app = FastAPI(title="BadgerType API")

# This runs when the server starts up
@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    
@app.get("/health")
def health_check():
    return {"status": "ok"}