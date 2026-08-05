import { useEffect, useState } from "react";
import Timer from "../components/Timer";
import TypingDisplay from "../features/TypingDisplay";
import Results from "../features/Results";
import useTypeEngine from "../hooks/useTypeEngine";

const SoloRace = () => {
  // const [quoteText, setQuoteText] = useState("");

  const quoteText =
    "Success is getting what you want. Happiness is wanting what you get.";
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

  // const startNewGame = async () => {
  //   resetEngine();
  //   setQuoteText("Loading next quote...");
  //   const text = await fetchQuote();
  //   setQuoteText(text);
  // };

  // useEffect(() => {
  //   startNewGame();
  // }, []);

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <div className="w-full flex justify-between">
        <Timer
          startTime={startTime}
          endTime={endTime}
          timeElapsed={timeElapsed}
        />
        {/**{endTime && <RetryButton onRetry={startNewGame} />} */}
      </div>

      <TypingDisplay quote={quoteText} userInput={userInput} />

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
