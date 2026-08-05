from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # This dictionary is our "hotel". 
        # The key is the room number (lobby_id).
        # The value is a list of active phone lines (WebSockets) in that room.
        self.active_lobbies: dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, lobby_id: str):
        # 1. Answer the incoming phone call
        await websocket.accept()

        # 2. If this lobby doesn't exist yet, build the room!
        if lobby_id not in self.active_lobbies:
            self.active_lobbies[lobby_id] = []

        # 3. Put the player's phone line into the room
        self.active_lobbies[lobby_id].append(websocket)
        print(f"Player joined lobby: {lobby_id}. Total players: {len(self.active_lobbies[lobby_id])}")

    def disconnect(self, websocket: WebSocket, lobby_id: str):
        # 1. Unplug the player's phone line from the room
        if lobby_id in self.active_lobbies:
            self.active_lobbies[lobby_id].remove(websocket)
            print(f"Player left lobby: {lobby_id}.")

            # 2. If the room is completely empty, delete the room so we don't waste memory
            if len(self.active_lobbies[lobby_id]) == 0:
                del self.active_lobbies[lobby_id]
                print(f"Lobby {lobby_id} deleted.")

    async def broadcast(self, message: dict, lobby_id: str):
        # Shout a message into the room so everyone in it can hear it
        if lobby_id in self.active_lobbies:
            for connection in self.active_lobbies[lobby_id]:
                # We send the data as a JSON object, which React loves
                await connection.send_json(message)

# Finally, we hire our single global Switchboard Operator
manager = ConnectionManager()