import React from "react";
import ProgressBar from "./ProgressBar";

const MatchProgress = ({ userInput, quote, opponentProgress }) => {
  return (
    <div className="w-full h-2/10 flex flex-col justify-evenly p-3 bg-black border-2 border-dashed border-(--border) rounded-lg">
      {/* We calculate your progress live just for the visual bar */}
      <ProgressBar
        progress={(userInput.length / quote.length) * 100}
        label="You"
      />
      <ProgressBar progress={opponentProgress} label="Opponent" />
    </div>
  );
};

export default MatchProgress;
