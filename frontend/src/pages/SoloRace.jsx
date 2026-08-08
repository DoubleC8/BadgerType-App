import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import TypingDisplay from "../features/TypingDisplay";
import Results from "../features/Results";
import useTypeEngine from "../hooks/useTypeEngine";
import { fetchQuote } from "../services/api";
import RetryButton from "../components/RetryButton";
import { useUser } from "@clerk/react";

const SoloRace = () => {
  const [quoteText, setQuoteText] = useState("");
  const { user, isSignedIn } = useUser();

  const {
    userInput,
    startTime,
    endTime,
    timeElapsed,
    wpm,
    accuracy,
    errors,
    resetEngine,
  } = useTypeEngine(quoteText);

  const startNewGame = async () => {
    resetEngine();
    setQuoteText("Loading next quote...");
    const text = await fetchQuote();
    setQuoteText(text);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  useEffect(() => {
    if (endTime && user && isSignedIn) {
      fetch("http://localhost:8000/api/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clerk_id: user.id,
          wpm: wpm,
          accuracy: accuracy,
        }),
      }).catch((err) => console.error("Failed to save solo match: ", err));
    }
  }, [endTime, isSignedIn, user, wpm, accuracy]);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex justify-between">
        <Timer
          startTime={startTime}
          endTime={endTime}
          timeElapsed={timeElapsed}
        />
        {endTime && <RetryButton onRetry={startNewGame} />}
      </div>

      <TypingDisplay
        quote={quoteText}
        userInput={userInput}
        multiplayer={false}
      />

      {endTime && (
        <Results
          wpm={wpm}
          accuracy={accuracy}
          timeElapsed={timeElapsed}
          errors={errors}
        />
      )}
    </div>
  );
};

export default SoloRace;
