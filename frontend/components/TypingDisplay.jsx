// src/components/TypingDisplay.jsx
import React from "react";
import Cursor from "./Cursor";

const TypingDisplay = ({ quote, userInput }) => {
  const words = quote ? quote.split(" ") : [];

  return (
    <div className="min-h-1/2 max-h-fit p-3 border-4 border-dashed border-(--accent) rounded-lg bg-(--bg-secondary) flex items-center font-(family-name:--geist)">
      <div className="text-(--text-secondary) text-4xl tracking-widest flex flex-wrap gap-y-3">
        {words.map((word, wordIdx) => {
          const wordWithSpace =
            wordIdx === words.length - 1 ? word : word + " ";

          return (
            <div key={wordIdx} className="inline-block whitespace-pre">
              {wordWithSpace.split("").map((char, charIdx) => {
                let globalIndex = 0;
                for (let i = 0; i < wordIdx; i++) {
                  globalIndex += words[i].length + 1;
                }
                globalIndex += charIdx;

                let colorClass = "text-(--text-secondary)";

                if (globalIndex < userInput.length) {
                  if (char === userInput[globalIndex]) {
                    colorClass = "text-(--green) bg-(--green)/20";
                  } else {
                    colorClass = "text-(--red) bg-(--red)/20";
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

        {quote && userInput.length === quote.length && <Cursor />}
      </div>
    </div>
  );
};

export default TypingDisplay;
