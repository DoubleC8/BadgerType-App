import { useState, useEffect } from "react";

const useTypeEngine = (quote) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWmp] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);

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

  useEffect(() => {
    if (endTime && startTime) {
      // Calculating total mins
      const totalMinutes = (endTime - startTime) / 60000;

      // Calculating wpm
      // By industry standard, 1 "word" = 5 keystrokes.
      // So, total standard words typed = length of userInput / 5
      const standardWords = userInput.length / 5;

      const grossWpm = Math.round(standardWords / totalMinutes);

      setWmp(grossWpm);

      let correctChars = 0;

      for (let i = 0; i < userInput.length; i++) {
        if (userInput[i] === quote[i]) {
          correctChars += 1;
        }
      }

      const accuracyPercentage = Math.round(
        (correctChars / quote.length) * 100,
      );

      const wrongChars = quote.length - correctChars;

      setAccuracy(accuracyPercentage);
      setErrors(wrongChars);
    }
  }, [userInput, quote, startTime, endTime]);

  const resetEngine = () => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setTimeElapsed(0);
    setWmp(0);
    setAccuracy(0);
    setErrors(0);
  };

  // 3. Return the exact data the UI needs
  return {
    userInput,
    startTime,
    endTime,
    timeElapsed,
    wpm,
    accuracy,
    errors,
    resetEngine,
  };
};

export default useTypeEngine;
