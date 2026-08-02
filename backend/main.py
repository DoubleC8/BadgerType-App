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
        url = "https://api.animechan.io/v1/quotes/random"
        # requests handles the JSON parsing and SSL for us!
        response = requests.get(url, headers={'User-Agent': 'Mozilla/5.0'}, timeout=5)
        data = response.json()
        
        return {"quote": data["data"]["content"]}
    except Exception as e:
        print(f"Error Fetching quote: {e}")
        return {"quote": "The quick brown fox jumps over the lazy dog."}