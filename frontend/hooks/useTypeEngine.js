import { useState, useEffect } from "react";

const useTypeEngine = (quote) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  // 1. The Keystroke Listener Effect
  useEffect(() => {
    const handleKeyDown = (e) => {
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
        setUserInput((prev) => {
          const nextInput = prev + e.key;

          if (quote && nextInput.length === quote.length) {
            setEndTime(Date.now());
          }

          return nextInput;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startTime, endTime, quote]);

  // 2. The Timer Effect
  useEffect(() => {
    let interval;

    if (startTime && !endTime) {
      interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    } else if (endTime && startTime) {
      setTimeElapsed(Math.floor((endTime - startTime) / 1000));
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [startTime, endTime]);

  // 3. Return the exact data the UI needs
  return { userInput, startTime, endTime, timeElapsed };
};

export default useTypeEngine;
