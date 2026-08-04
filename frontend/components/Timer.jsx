import React from "react";

const Timer = ({ startTime, endTime, timeElapsed }) => {
  return (
    <div
      className={`${endTime ? "text-(--accent)" : "text-(--text-secondary)"}
          w-1/8 h-10 flex justify-center items-center p-1 rounded-lg bg-(--bg-secondary) text-2xl font-bold tracking-widest`}
    >
      <p>{startTime ? `${timeElapsed}s` : "0s"}</p>
    </div>
  );
};

export default Timer;
