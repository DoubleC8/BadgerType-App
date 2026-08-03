import React from "react";

const Timer = ({ startTime, endTime, timeElapsed }) => {
  return (
    <div
      className={`${endTime ? "text-(--accent)" : "text-(--text-secondary)"}
          w-1/8 h-fit text-center py-1 rounded-lg bg-(--bg-secondary) text-3xl font-bold tracking-widest`}
    >
      {startTime ? `${timeElapsed}s` : "0s"}
    </div>
  );
};

export default Timer;
