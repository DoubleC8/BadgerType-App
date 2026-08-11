import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

  const hasBroadcastFinish = useRef(false);
  const hasSavedMatch = useRef(false);

  const leaveMatch = () => {
    navigate("/");
  };

  const handleRematch = () => {
    setRematchRequested(true);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: "rematch" }));
    }
  };

  useEffect(() => {
    const ws = new WebSocket(
      `wss://badgertype-backend-597162430503.us-west2.run.app/ws/${lobbyId}`,
    );

    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_match",
          clerk_id: user?.id || null,
        }),
      );
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

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

        hasBroadcastFinish.current = false;
        hasSavedMatch.current = false;
      }

      if (data.type === "player_left") {
        setOpponentLeft(true);
      }
    };

    return () => ws.close();
  }, [lobbyId]);

  useEffect(() => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      // Calculate how far along you are (0 to 100)
      const myProgress = (userInput.length / quote.length) * 100;

      // Send it to the server as a JSON string
      socket.send(JSON.stringify({ type: "progress", progress: myProgress }));
    }
  }, [userInput, socket, quote.length]);

  useEffect(() => {
    if (
      endTime &&
      wpm > 0 &&
      socket &&
      socket.readyState === WebSocket.OPEN &&
      !hasBroadcastFinish.current
    ) {
      hasBroadcastFinish.current = true;

      socket.send(
        JSON.stringify({
          type: "finished",
          clerk_id: user?.id || null,
          wpm: wpm,
          accuracy: accuracy,
        }),
      );

      setMatchResult((prev) => (prev ? prev : "Win"));
    }
  }, [endTime, socket, user, wpm, accuracy]);

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
