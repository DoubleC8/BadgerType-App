import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import TypewriterText from "../components/TypewriterText";

const MultiplayerLobby = () => {
  const { lobbyId } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [socket, setSocket] = useState(null);
  const [playerCount, setPlayerCount] = useState(1);

  useEffect(() => {
    // 1. Dial the FastAPI Switchboard when the lobby mounts
    const ws = new WebSocket(`ws://localhost:8000/ws/${lobbyId}`);

    ws.onopen = () => {
      console.log(`Connected to lobby: ${lobbyId}`);
      setSocket(ws);
    };

    // 2. Listen for messages from the Switchboard
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // If the server tells us someone joined, update the count!
      if (data.type === "player_joined") {
        setPlayerCount(data.total_players);
      }

      // NEW: Wait for the authoritative server to officially hand us the quote!
      if (data.type === "game_start") {
        setTimeout(() => {
          // We pass the quote securely into the Arena via React Router state
          navigate(`/arena/${lobbyId}`, { state: { quote: data.quote } });
        }, 1000);
      }

      // Handle someone leaving the lobby
      if (data.type === "player_left") {
        setPlayerCount(data.total_players);
      }
    };

    // 3. Hang up the phone if they navigate away
    return () => ws.close();
  }, [lobbyId, navigate]);

  const handleCopyLink = () => {
    const inviteLink = window.location.href;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-3/4 flex flex-col items-center justify-center gap-6">
      {playerCount < 2 ? (
        <TypewriterText title={"Waiting for opponent..."} />
      ) : (
        <motion.h1
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 6.2,
            times: [0, 0.05, 0.8, 1],
          }}
          className="text-3xl font-bold text-(--accent)"
        >
          Opponent Found! Starting race...
        </motion.h1>
      )}

      <div className="w-full flex justify-center gap-6">
        {playerCount < 2 && (
          <div className="w-2/5 h-fit flex flex-col gap-3 justify-evenly items-center p-3 bg-(--bg-secondary) rounded-lg">
            <p className="text-xl text-(--text-secondary)">
              Send this link to a friend to play:
            </p>
            <div className="w-full flex gap-3 items-center">
              <code className="h-12 w-7/10 px-3 py-1 flex flex-col justify-center bg-(--border) rounded-lg text-(--accent) text-xl overflow-clip">
                {window.location.href}
              </code>
              <button
                onClick={handleCopyLink}
                className="h-12 w-3/10 px-3 py-1 flex flex-col justify-center bg-(--accent) rounded-lg font-bold text-xl hover:cursor-pointer duration-300 ease-in-out"
              >
                {copied ? "Copied!" : "Link"}
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="text-lg text-(--text-secondary)">
        <span className="text-(--accent)">Players</span> in lobby: {playerCount}
        /2
      </p>
    </div>
  );
};

export default MultiplayerLobby;
