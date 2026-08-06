import os
import requests
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # This dictionary is our "hotel". 
        # The key is the room number (lobby_id).
        # The value is a list of active phone lines (WebSockets) in that room.
        self.active_lobbies: dict[str, list[WebSocket]] = {}
    
    def fetch_game_quote(self):
        try:
            url = "https://api.api-ninjas.com/v2/randomquotes?categories=success%2Ccourage%2Cinspirational%2Cleadership"
            api_key = os.getenv("API_KEY")
            
            if api_key is None:
                print("Warning: API_KEY not found in environment variables.")
                return "The quick brown fox jumps over the lazy dog."
            
            response = requests.get(url, headers={'X-Api-Key': api_key}, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            return data[0]["quote"]
        
        except Exception as e:
            print(f"Error fetching quote: {e}")
            return "The quick brown fox jumps over the lazy dog."
            

    async def connect(self, websocket: WebSocket, lobby_id: str):
        # 1. Answer the incoming phone call
        await websocket.accept()

        # 2. If this lobby doesn't exist yet, build the room!
        if lobby_id not in self.active_lobbies:
            self.active_lobbies[lobby_id] = []
        
        # 3. Prevent overcrodwing: Only allow 2 players max (for now)
        if len(self.active_lobbies[lobby_id]) >= 2:
            await websocket.close(code=1008)
            return False

        # 4. Put the player's phone line into the room
        self.active_lobbies[lobby_id].append(websocket)
        print(f"Player joined lobby: {lobby_id}. Total players: {len(self.active_lobbies[lobby_id])}")
        
        return True

    def disconnect(self, websocket: WebSocket, lobby_id: str):
        # 1. Unplug the player's phone line from the room
        if lobby_id in self.active_lobbies and websocket in self.active_lobbies[lobby_id]:
            self.active_lobbies[lobby_id].remove(websocket)
            print(f"Player left lobby: {lobby_id}.")

            # 2. If the room is completely empty, delete the room so we don't waste memory
            if len(self.active_lobbies[lobby_id]) == 0:
                del self.active_lobbies[lobby_id]
                print(f"Lobby {lobby_id} deleted.")

    async def broadcast(self, message: dict, lobby_id: str):
        if lobby_id in self.active_lobbies:
            # We iterate over a copy of the list using list() to prevent errors if a socket is removed mid-broadcast
            for connection in list(self.active_lobbies[lobby_id]):
                try:
                    await connection.send_json(message)
                except Exception as e:
                    print(f"Failed to send message to a closed socket: {e}")

# Finally, we hire our single global Switchboard Operator
manager = ConnectionManager()