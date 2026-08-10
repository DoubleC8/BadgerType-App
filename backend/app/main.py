import os
import requests
from pydantic import BaseModel
from sqlmodel import select, Session, func
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

@app.get("/api/users/{clerk_id}/stats")
def get_user_stats(clerk_id: str, db: Session = Depends(get_session)):
    user = db.exec(select(User).where(User.clerk_id == clerk_id)).first()
    
    if not user:
        return {"error": "User not found"}
    
    statement = select(Match).where(
        (Match.player1_id == user.id) | (Match.player2_id == user.id)
    ).order_by(Match.created_at.desc());
    
    matches = db.exec(statement).all()
    
    total_races = len(matches)
    
    if total_races == 0:
        return {
            "username": user.username,
            "profile_picture": user.profile_picture,
            "total_races": 0,
            "total_wins": 0,
            "total_losses": 0,
            "avg_wpm": 0,
            "avg_accuracy": 0,
            "best_wpm": 0, 
            "recent_solo_matches": [],
            "recent_multiplayer_matches": [],
        }
        
    user_wpms = []
    user_accs = []
    recent_solo_matches = []
    recent_multiplayer_matches = []
    total_wins = 0
    total_losses = 0
    
    for m in matches:
        is_p1 = m.player1_id == user.id
        wpm = m.p1_wpm if is_p1 else m.p2_wpm
        acc = m.p1_accuracy if is_p1 else m.p2_accuracy
        
        user_wpms.append(wpm)
        user_accs.append(acc)
        
        match_data = {
            "wpm": round(wpm, 1),
            "accuracy": round(acc, 1), 
            "date": m.created_at.strftime("%b %d, %Y")
        }
        

        if not m.is_multiplayer:
            if len(recent_solo_matches) < 10:
                recent_solo_matches.append(match_data)
        else:
            if m.winner_id == user.id:
                total_wins += 1
                match_data["outcome"] = "W"
            else:
                total_losses += 1
                match_data["outcome"] = "L"
            
            if len(recent_multiplayer_matches) < 10:
                recent_multiplayer_matches.append(match_data)
    
    return {
        "username": user.username,
        "profile_picture": user.profile_picture,
        "total_races": total_races,
        "total_wins": total_wins,
        "total_losses": total_losses,
        "avg_wpm": round(sum(user_wpms) / total_races, 1),
        "avg_accuracy": round(sum(user_accs) / total_races, 1),
        "best_wpm": round(max(user_wpms), 1), 
        "recent_solo_matches": recent_solo_matches,
        "recent_multiplayer_matches": recent_multiplayer_matches, 
    }

# Don't forget to import Session and get_session at the top if they aren't already there!
@app.websocket("/ws/{lobby_id}")
async def websocket_endpoint(websocket: WebSocket, lobby_id: str, db: Session = Depends(get_session)):
    connected = await manager.connect(websocket, lobby_id)
    if not connected:
        return
    
    current_players = len(manager.active_lobbies[lobby_id])
    await manager.broadcast({"type": "player_joined", "total_players": current_players}, lobby_id)
    
    if current_players == 2:
        game_quote = manager.fetch_game_quote()
        await manager.broadcast({"type": "game_start", "quote": game_quote}, lobby_id)
        
    try:
        while True:
            data = await websocket.receive_json()            
            
            # 1. Player checks in when they arrive in the Arena
            if data.get("type") == "join_match":
                if lobby_id not in manager.lobby_players:
                    manager.lobby_players[lobby_id] = []
                manager.lobby_players[lobby_id].append(data.get("clerk_id"))

            # 2. The Rematch Logic
            elif data.get("type") == "rematch":
                manager.rematch_votes[lobby_id] += 1
                if manager.rematch_votes[lobby_id] == 2:
                    manager.rematch_votes[lobby_id] = 0
                    manager.match_winners[lobby_id] = False # Reset the winner lock!
                    new_quote = manager.fetch_game_quote()
                    await manager.broadcast({"type": "game_start", "quote": new_quote}, lobby_id)
                continue

            # 3. The Authoritative Finish Line
            elif data.get("type") == "finished":
                # The FIRST person to trigger this block is the official winner!
                if not manager.match_winners.get(lobby_id):
                    manager.match_winners[lobby_id] = True
                    
                    winner_clerk = data.get("clerk_id")
                    loser_clerk = None
                    
                    # Figure out who the loser was based on who checked in earlier
                    for p in manager.lobby_players.get(lobby_id, []):
                        if p != winner_clerk:
                            loser_clerk = p
                            break

                    # Lookup both users in the database (Guests will return None)
                    w_user = db.exec(select(User).where(User.clerk_id == winner_clerk)).first() if winner_clerk else None
                    l_user = db.exec(select(User).where(User.clerk_id == loser_clerk)).first() if loser_clerk else None

                    # Only save to the database if at least ONE player is registered
                    if w_user or l_user:
                        if w_user:
                            # Registered user WON
                            p1_id = w_user.id
                            p2_id = l_user.id if l_user else None
                            win_id = w_user.id
                            p1_w = data.get("wpm")
                            p1_a = data.get("accuracy")
                            p2_w = 0.0 # Loser hasn't finished, so 0 is fine for MVP
                            p2_a = 0.0
                        else:
                            # Guest WON, Registered user LOST
                            p1_id = l_user.id
                            p2_id = None
                            win_id = None # Guest win
                            p1_w = 0.0 # Registered user hasn't finished
                            p1_a = 0.0
                            p2_w = data.get("wpm") # Guest stats
                            p2_a = data.get("accuracy")
                        
                        new_match = Match(
                            is_multiplayer=True,
                            player1_id=p1_id,
                            player2_id=p2_id,
                            winner_id=win_id,
                            p1_wpm=p1_w,
                            p1_accuracy=p1_a,
                            p2_wpm=p2_w,
                            p2_accuracy=p2_a
                        )
                        db.add(new_match)
                        db.commit()

                # Still broadcast the finished message so the loser's React screen updates!
                await manager.broadcast(data, lobby_id, sender=websocket)
            
            else:
                # Normal progress updates
                await manager.broadcast(data, lobby_id, sender=websocket)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, lobby_id)
        remaining_players = len(manager.active_lobbies.get(lobby_id, []))
        await manager.broadcast({"type": "player_left", "total_players": remaining_players}, lobby_id)
        