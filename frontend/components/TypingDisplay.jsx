import React, { useState, useEffect } from "react";
import Cursor from "./Cursor";

const TypingDisplay = ({ quote }) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // If the race is over, ignore all further keystrokes
      if (endTime) return;

      if (
        e.key === "Shift" ||
        e.key === "Control" ||
        e.key === "Alt" ||
        e.key === "Meta" ||
        e.key === "Tab"
      ) {
        return;
      }

      if (!startTime && e.key.length === 1) {
        setStartTime(Date.now());
      }

      if (e.key === "Backspace") {
        setUserInput((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1) {
        // Calculate the next string inside the state updater
        setUserInput((prev) => {
          const nextInput = prev + e.key;

          // Check if this specific keystroke finishes the quote
          if (quote && nextInput.length === quote.length) {
            setEndTime(Date.now());
          }

          return nextInput;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startTime, endTime, quote]); // Ensure new variables are in the dependency array

  // 3. The Timer Effect
  useEffect(() => {
    let interval;

    // If the race has started but hasn't ended yet -> Tick the clock
    if (startTime && !endTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    // If the race has ended -> Lock in the final exact time
    else if (endTime && startTime) {
      setTimeElapsed(Math.floor((endTime - startTime) / 1000));
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  const words = quote ? quote.split(" ") : [];
  return (
    <section className="h-screen font-(family-name:--geist) flex flex-col gap-6">
      {/* Timer UI */}
      <div className="px-6 py-3 rounded-lg bg-(--bg-secondary) w-fit text-2xl font-bold tracking-widest text-(--text-secondary)">
        {startTime ? `${timeElapsed}s` : "0s"}
      </div>

      {/* Typing Area UI */}
      <div className="min-h-1/2 max-h-fit p-3 border-4 border-dashed border-(--accent) rounded-lg bg-(--bg-secondary) flex items-center">
        {/* We added flex-wrap here to ensure word blocks wrap cleanly */}
        <div className="text-(--text-secondary) text-4xl tracking-widest flex flex-wrap gap-y-3">
          {words.map((word, wordIdx) => {
            // Re-attach the space to the end of the word (except the last word)
            const wordWithSpace =
              wordIdx === words.length - 1 ? word : word + " ";

            return (
              // inline-block forces the whole word to stay together on line wraps
              // whitespace-pre forces HTML to actually render the space at the end
              <div key={wordIdx} className="inline-block whitespace-pre">
                {wordWithSpace.split("").map((char, charIdx) => {
                  // Calculate this letter's exact position in the overall string
                  let globalIndex = 0;
                  for (let i = 0; i < wordIdx; i++) {
                    globalIndex += words[i].length + 1; // +1 accounts for the spaces
                  }
                  globalIndex += charIdx;

                  let colorClass = "text-(--text-secondary)";

                  // Grade the keystroke
                  if (globalIndex < userInput.length) {
                    if (char === userInput[globalIndex]) {
                      colorClass = "text-(--green) bg-(--green)/50";
                    } else {
                      colorClass = "text-(--red) bg-(--red)/50";
                    }
                  }

                  return (
                    <React.Fragment key={`${wordIdx}_${charIdx}`}>
                      {globalIndex === userInput.length && <Cursor />}
                      <span className={colorClass}>{char}</span>
                    </React.Fragment>
                  );
                })}
              </div>
            );
          })}

          {/* Catch the cursor if they type past the very last character */}
          {quote && userInput.length === quote.length && <Cursor />}
        </div>
      </div>
    </section>
  );
};

export default TypingDisplay;
