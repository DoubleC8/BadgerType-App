import { useEffect, useState } from "react";

const TestConnection = () => {
  const [messages, setMessages] = useState([]);
  const [socket, setSocket] = useState(null);

  // We will hardcode a lobby ID just for this test
  const lobbyId = "lobby-123";

  useEffect(() => {
    // 1. Dial the phone number!
    // Notice we use "ws://" instead of "http://" for WebSockets
    const ws = new WebSocket(`ws://localhost:8000/ws/${lobbyId}`);

    // 2. When the server picks up the phone
    ws.onopen = () => {
      console.log("Connected to the lobby!");
      setSocket(ws);
    };

    // 3. When the server shouts a message into the room
    ws.onmessage = (event) => {
      // The server sends a JSON string, so we parse it back into a JavaScript object
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data.message]);
    };

    // 4. Hang up the phone if the component unmounts
    return () => ws.close();
  }, []);

  // 5. A function to let the player talk into the phone
  const handleSendMessage = () => {
    if (socket) {
      socket.send("Hello from React! 🦡");
    }
  };

  return (
    <div className="w-full p-4 mb-6 border-4 border-dashed border-(--accent) rounded-lg bg-black text-(--text-secondary) font-(family-name:--geist)">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lobby: {lobbyId}</h2>
        <button
          onClick={handleSendMessage}
          className="px-4 py-2 bg-(--accent) text-black rounded-lg font-bold cursor-pointer hover:opacity-80"
        >
          Send Test Message
        </button>
      </div>

      {/* A small screen to display the messages we receive */}
      <div className="h-32 overflow-y-auto bg-(--bg-secondary) p-3 rounded-lg">
        {messages.length === 0 ? (
          <p className="opacity-50">Waiting for messages...</p>
        ) : (
          messages.map((msg, index) => (
            <p key={index} className="text-white mb-1">
              {" "}
              {msg}
            </p>
          ))
        )}
      </div>
    </div>
  );
};

export default TestConnection;
