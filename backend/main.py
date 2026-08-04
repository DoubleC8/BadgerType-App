import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import requests # Replaces urllib and json
from database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield
    
app = FastAPI(title="BadgerType API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}
    
@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/api/quote")
def fetch_stoic_quote():
    try:
        url = "https://api.api-ninjas.com/v2/randomquotes?categories=success%2Ccourage%2Cinspirational%2Cleadership"
        api_key = os.getenv("API_KEY")
        
        if api_key is None:
            raise ValueError("API key not found! Please set the MY_API_KEY environment variable.")
        
        # requests handles the JSON parsing and SSL for us!
        response = requests.get(url, headers={'X-Api-key': api_key}, timeout=5)
        
        response.raise_for_status()
        
        data = response.json()
        
        return {"quote": data[0]["quote"]}
    except Exception as e:
        print(f"Error Fetching quote: {e}")
        return {"quote": "The quick brown fox jumps over the lazy dog."}