import React from "react";
import StatBox from "./StatBox";

const ProfileStats = ({ stats }) => {
  return (
    <div className="w-full min-h-3/10 flex gap-6">
      <StatBox stat="Avg Speed" score={`${stats?.avg_wpm || 0} WPM`} />
      <StatBox stat="Best Speed" score={`${stats?.best_wpm || 0} WPM`} />
      <StatBox stat="Avg Accuracy" score={`${stats?.avg_accuracy || 0}%`} />
    </div>
  );
};

export default ProfileStats;
