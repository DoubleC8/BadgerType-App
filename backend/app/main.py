import os
import requests
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.websockets.socket_manager import manager
from contextlib import asynccontextmanager
from app.core.database import create_db_and_tables

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
    
    try:
        # 2. Stay on the line forever, listening for any messages from this player
        while True:
            # Wait for the player to send a message (like "I typed the letter A")
            data = await websocket.receive_text()
            
            # For now, just echo back what they said to prove the room works!
            await manager.broadcast({"message": f"Someone in {lobby_id} said: {data}"}, lobby_id)
            
    except WebSocketDisconnect:
        # 3. If the player closes their browser tab, the Operator hangs up the phone
        manager.disconnect(websocket, lobby_id)
        
        remaining_players = len(manager.active_lobbies.get(lobby_id, []))
        await manager.broadcast({"type": "player_left", "total_players": remaining_players}, lobby_id)
        