import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useTypeEngine from "../hooks/useTypeEngine";
import TypingDisplay from "../features/TypingDisplay";
import ProgressBar from "../components/ProgressBar";

const Arena = () => {
  const { lobbyId } = useParams();
  const location = useLocation();

  // Grab the authoritative quote the server handed us in the Lobby!
  const quote = location.state?.quote || "Fallback quote just in case!";

  const { userInput, startTime, endTime, wpm, accuracy } = useTypeEngine(quote);
  const [socket, setSocket] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(0);

  // 1. Establish the Arena WebSocket Connection
  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/${lobbyId}`);

    ws.onopen = () => setSocket(ws);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Listen specifically for the opponent's progress updates
      if (data.type === "progress") {
        setOpponentProgress(data.progress);
      }
    };

    return () => ws.close();
  }, [lobbyId]);

  // 2. Broadcast YOUR progress every time you press a valid key
  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Calculate how far along you are (0 to 100)
      const myProgress = (userInput.length / quote.length) * 100;

      // Send it to the server as a JSON string
      socket.send(JSON.stringify({ type: "progress", progress: myProgress }));
    }
  }, [userInput, socket, quote.length]);

  return (
    <div className="w-full h-full flex flex-col gap-6 font-(family-name:--geist)">
      <div className="w-full flex justify-between items-center text-(--text-secondary)">
        <h1 className="text-2xl font-bold tracking-widest">Arena: {lobbyId}</h1>
        {/* Temporary UI just to prove the numbers are syncing! */}
        <div className="w-full flex flex-col gap-4 p-4 bg-black border-2 border-dashed border-(--border) rounded-lg">
          {/* We calculate your progress live just for the visual bar */}
          <ProgressBar
            progress={(userInput.length / quote.length) * 100}
            label="You"
          />
          <ProgressBar progress={opponentProgress} label="Opponent" />
        </div>
      </div>

      <TypingDisplay quote={quote} userInput={userInput} />
    </div>
  );
};

export default Arena;
