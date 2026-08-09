import { useState, useEffect } from "react";

const useTypeEngine = (quote) => {
  const [userInput, setUserInput] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [wpm, setWmp] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [errors, setErrors] = useState(0);
  const [maxIndexReached, setMaxIndexReached] = useState(-1);

  // =====================================================================
  // 1. The Keystroke Listener Effect
  // What it does: Listens to every key you press on your physical keyboard.
  // It ignores special keys (like Shift), starts the stopwatch on your first
  // valid letter, handles the Backspace key, and officially stops the race
  // (sets endTime) the exact millisecond your input perfectly matches the quote.
  // =====================================================================
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
          if (quote && prev.length >= quote.length) return prev;

          const currentIndex = prev.length;

          // CHANGED: Only check for an error if this is a NEW character index
          if (currentIndex > maxIndexReached) {
            setMaxIndexReached(currentIndex); // Update the furthest reach

            if (quote && e.key !== quote[currentIndex]) {
              setErrors((prevErrors) => prevErrors + 1);
            }
          }

          const nextInput = prev + e.key;

          if (quote && nextInput === quote) {
            setEndTime(Date.now());
          }

          return nextInput;
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startTime, endTime, quote, maxIndexReached]);

  // =====================================================================
  // 2. The Timer Effect
  // What it does: Acts as your live digital stopwatch. Once the race starts,
  // it ticks up every single second to update the UI. The moment the race
  // ends, it stops the interval and locks in your final time elapsed.
  // =====================================================================
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

  // =====================================================================
  // 3. The Math & Stats Effect
  // What it does: Runs exactly once when you cross the finish line. It looks
  // at how long you took and what you typed, then calculates your final
  // Words Per Minute (WPM), your accuracy percentage, and your total errors.
  // =====================================================================
  useEffect(() => {
    if (endTime && startTime && quote) {
      // Calculating total mins
      const totalMinutes = (endTime - startTime) / 60000;

      // Calculating wpm
      // By industry standard, 1 "word" = 5 keystrokes.
      // So, total standard words typed = length of userInput / 5
      const words = quote.length / 5;

      const grossWpm = Math.round(words / totalMinutes);
      setWmp(grossWpm);

      const correctKeystrokes = Math.max(0, quote.length - errors);
      const calculatedAccuracy = Math.round(
        (correctKeystrokes / quote.length) * 100,
      );

      setAccuracy(calculatedAccuracy);
    }
  }, [quote, startTime, endTime, errors]);

  const resetEngine = () => {
    setUserInput("");
    setStartTime(null);
    setEndTime(null);
    setTimeElapsed(0);
    setWmp(0);
    setAccuracy(0);
    setErrors(0);
    setMaxIndexReached(-1);
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
