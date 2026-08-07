import React from "react";

const MatchResult = ({ matchResult, endTime, wpm }) => {
  return (
    <div
      className={`${matchResult === "Win" ? "border-(--gold)" : "border-(--red)"}
    w-full h-2/10 flex flex-col items-center justify-center bg-(--bg-secondary) border-4 rounded-lg`}
    >
      <h1
        className={`${matchResult === "Win" ? "text-(--text)" : "text-(--red)"}
        text-6xl font-bold mb-3`}
      >
        {matchResult === "Win" ? "YOU WON! 🏆🦡" : "YOU LOST! 💀"}
      </h1>
      {endTime && (
        <p className="text-2xl text-(--text)">
          Your Speed: <span className="text-(--gold) font-bold">{wpm} WPM</span>
        </p>
      )}
    </div>
  );
};

export default MatchResult;
