import os
import requests
from pydantic import BaseModel
from sqlmodel import select, Session
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.websockets.socket_manager import manager
from contextlib import asynccontextmanager
from app.core.database import create_db_and_tables
from app.core.database import get_session
from app.models.models import User, Match

class UserSync(BaseModel):
    clerk_id: str
    username: str
    profile_picture: str | None = None

class MatchSubmit(BaseModel):
    clerk_id: str
    wpm: float
    accuracy: float

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
        url = "https://api.api-ninjas.com/v2/randomquotes"
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

@app.post("/api/auth/sync")
def sync_user(user_data: UserSync, db: Session = Depends(get_session)):
    # Check if this Clerk user is already in our Neon database
    statement = select(User).where(User.clerk_id == user_data.clerk_id)
    existing_user = db.exec(statement).first()

    if existing_user:
        # If they exist, just update their profile pic in case they changed it on GitHub
        existing_user.profile_picture = user_data.profile_picture
        db.add(existing_user)
        db.commit()
        return {"message": "User synced successfully", "user": existing_user}

    # If they DO NOT exist, create a fresh row in the Neon database
    new_user = User(
        clerk_id=user_data.clerk_id,
        username=user_data.username,
        profile_picture=user_data.profile_picture
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "User created in database", "user": new_user}

@app.post("/api/matches")
def save_match(match_data: MatchSubmit, db: Session = Depends(get_session)):
    statement = select(User).where(User.clerk_id == match_data.clerk_id)
    user = db.exec(statement).first()
    
    if not user:
        return {"error": "User not found in database"}
    
    new_match = Match(
        player1_id=user.id, 
        p1_wpm=match_data.wpm, 
        p1_accuracy=match_data.accuracy
    )
    
    db.add(new_match)
    db.commit()
    
    return {"message": "Match successfully recorded!"}

@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str):
    # 1. Player calls in. The Switchboard Operator answers and puts them in the room.
    connected = await manager.connect(websocket, lobby_id)
    
    if not connected:
        return
    
    current_players = len(manager.active_lobbies[lobby_id])
    
    await manager.broadcast({
        "type": "player_joined", 
        "total_players": current_players
    }, lobby_id)
    
    # --- The Game Start Logic ---
    if current_players == 2:
        # Fetch the authoritative quote from the server
        game_quote = manager.fetch_game_quote()
        
        await manager.broadcast({
            "type": "game_start", 
            "quote": game_quote
        }, lobby_id)
        
    
    try:
        # 2. Stay on the line forever, listening for any messages from this player
        while True:
            # Wait for the player to send a message (like "I typed the letter A")
            data = await websocket.receive_json()            
            
            if data.get("type") == "rematch":
                manager.rematch_votes[lobby_id] += 1
                
                if manager.rematch_votes[lobby_id] == 2:
                    manager.rematch_votes[lobby_id] = 0
                    new_quote = manager.fetch_game_quote()
                    await manager.broadcast({"type": "game_start", "quote": new_quote}, lobby_id)
                    
                continue
            
            await manager.broadcast(data, lobby_id, sender=websocket)
            
    except WebSocketDisconnect:
        # 3. If the player closes their browser tab, the Operator hangs up the phone
        manager.disconnect(websocket, lobby_id)
        
        remaining_players = len(manager.active_lobbies.get(lobby_id, []))
        await manager.broadcast({"type": "player_left", "total_players": remaining_players}, lobby_id)
        