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
  const [matchResult, setMatchResult] = useState(null);

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

      if (data.type === "finished") {
        setOpponentProgress(100);

        setMatchResult((prev) => (prev ? prev : "Loss"));
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

  useEffect(() => {
    if (endTime && socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "finished" }));

      setMatchResult((prev) => (prev ? prev : "Win"));
    }
  }, [endTime, socket]);

  return (
    <div className="w-full h-full flex flex-col gap-6 font-(family-name:--geist)">
      <div className="w-full flex flex-col gap-6 text-(--text-secondary)">
        <h1 className="text-3xl font-bold tracking-widest">
          Arena: <span className="text-(--accent)">{lobbyId}</span>
        </h1>
        <div className="w-full flex flex-col gap-4 p-4 bg-black border-2 border-dashed border-(--border) rounded-lg">
          {/* We calculate your progress live just for the visual bar */}
          <ProgressBar
            progress={(userInput.length / quote.length) * 100}
            label="You"
          />
          <ProgressBar progress={opponentProgress} label="Opponent" />
        </div>
      </div>
      {matchResult && (
        <div className="w-full p-6 flex flex-col items-center justify-center bg-(--bg-secondary) border-4 border-(--accent) rounded-lg mb-6">
          <h1 className="text-6xl font-bold text-(--accent) mb-4">
            {matchResult === "Win" ? "YOU WON!" : "YOU LOST!"}
          </h1>
          {endTime && (
            <p className="text-2xl text-white">
              Your Speed:{" "}
              <span className="text-(--accent) font-bold">{wpm} WPM</span>
            </p>
          )}
        </div>
      )}
      <TypingDisplay quote={quote} userInput={userInput} />
    </div>
  );
};

export default Arena;
