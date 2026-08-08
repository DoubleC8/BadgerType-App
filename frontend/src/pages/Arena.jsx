import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useTypeEngine from "../hooks/useTypeEngine";
import TypingDisplay from "../features/TypingDisplay";
import ProgressBar from "../components/ProgressBar";
import MatchResult from "../components/MatchResult";
import MatchProgress from "../components/MatchProgress";
import Button from "../components/Button";
import { useUser } from "@clerk/react";

const Arena = () => {
  const { lobbyId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isSignedIn } = useUser();

  const [quote, setQuote] = useState(
    location.state?.quote || "Fallback quote just in case!",
  );
  const [rematchRequested, setRematchRequested] = useState(false);

  const { userInput, startTime, endTime, wpm, accuracy, resetEngine } =
    useTypeEngine(quote);
  const [socket, setSocket] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(0);
  const [matchResult, setMatchResult] = useState(null);
  const [opponentLeft, setOpponentLeft] = useState(false);

  const leaveMatch = () => {
    navigate("/");
  };

  const handleRematch = () => {
    setRematchRequested(true);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "rematch" }));
    }
  };

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

      if (data.type === "game_start") {
        setQuote(data.quote);
        setMatchResult(null);
        setOpponentProgress(0);
        setRematchRequested(false);
        resetEngine();
      }

      if (data.type === "player_left") {
        setOpponentLeft(true);
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

      if (isSignedIn && user) {
        fetch("http://localhost:8000/api/matches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clerk_id: user.id,
            wpm: wpm,
            accuracy: accuracy,
          }),
        }).catch((err) => console.error("Failed to save match: ", err));
      }
    }
  }, [endTime, socket, isSignedIn, user, wpm, accuracy]);

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
        <div className="w-full flex items-center justify-center gap-6">
          {rematchRequested ? (
            opponentLeft ? (
              <p className="text-2xl text-(--red) font-bold animate-pulse">
                Opponent has left the lobby.
              </p>
            ) : (
              <div className="w-1/5 h-13 p-3 flex items-center justify-center bg-(--bg-secondary) border-2 border-dashed border-(--accent) text-(--text-secondary) rounded-lg text-xl font-bold">
                <p className="animate-pulse">Waiting for opponent...</p>
              </div>
            )
          ) : (
            <Button
              onAction={handleRematch}
              title={"Rematch"}
              buttonColor={"accent"}
              textColor={"text"}
            />
          )}

          <Button
            onAction={leaveMatch}
            title={"Leave"}
            buttonColor={"red"}
            textColor={"text"}
          />
        </div>
      )}
    </div>
  );
};

export default Arena;
