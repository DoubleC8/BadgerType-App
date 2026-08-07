import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import useTypeEngine from "../hooks/useTypeEngine";
import TypingDisplay from "../features/TypingDisplay";
import ProgressBar from "../components/ProgressBar";
import MatchResult from "../components/MatchResult";
import MatchProgress from "../components/MatchProgress";
import Button from "../components/Button";

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
      <h1 className="text-3xl font-bold tracking-widest">
        Arena: <span className="text-(--accent)">{lobbyId}</span>
      </h1>
      <MatchProgress
        userInput={userInput}
        quote={quote}
        opponentProgress={opponentProgress}
      />
      {matchResult && (
        <MatchResult matchResult={matchResult} endTime={endTime} wpm={wpm} />
      )}
      <TypingDisplay quote={quote} userInput={userInput} multiplayer={true} />
      {matchResult && (
        <div className="w-full flex justify-center gap-6">
          <Button title={"Rematch"} buttonColor={"accent"} textColor={"text"} />
          <Button title={"Leave"} buttonColor={"red"} textColor={"text"} />
        </div>
      )}
    </div>
  );
};

export default Arena;
