import React from "react";
import getAccuracyColor from "../utils/colors";

const ProfileMatches = ({ stats }) => {
  return (
    <div className="w-full h-4/10 flex-1 flex gap-6">
      {/* LEFT COLUMN: Solo Matches */}
      <div className="w-1/2 flex flex-col gap-3 p-3 bg-(--border) rounded-lg border-4 border-(--accent)">
        <h2 className="text-2xl font-bold text-(--text-secondary)">
          Solo Matches
        </h2>
        {stats?.recent_solo_matches?.length > 0 ? (
          <div className="w-full flex-1 overflow-y-auto flex flex-col flex-nowrap pr-2">
            <div className="flex justify-between text-(--text-secondary) border-b-2 border-(--text-secondary)/20 pb-3 font-bold sticky top-0 bg-(--border)">
              <span className="w-1/3">Date</span>
              <span className="w-1/3 text-center">Speed</span>
              <span className="w-1/3 text-right">Accuracy</span>
            </div>
            {stats.recent_solo_matches.map((match, index) => (
              <div
                key={index}
                className="flex justify-between text-(--text) py-3 border-b border-(--border)/50 hover:bg-black/20 transition-colors"
              >
                <span className="w-1/3">{match.date}</span>
                <span className="w-1/3 text-center text-(--accent) font-bold">
                  {match.wpm} WPM
                </span>
                <span
                  className={`text-${getAccuracyColor(match.accuracy)} w-1/3 text-right`}
                >
                  {match.accuracy}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-2xl text-(--text-secondary)">
              No solo matches yet.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: Multiplayer Matches */}
      <div className="w-1/2 flex flex-col gap-3 p-3 bg-(--border) rounded-lg border-4 border-(--accent)">
        <h2 className="text-2xl font-bold text-(--text-secondary)">
          Multiplayer Matches
        </h2>
        {stats?.recent_multiplayer_matches?.length > 0 ? (
          <div className="w-full flex-1 overflow-y-auto flex flex-col flex-nowrap pr-2">
            <div className="flex justify-between text-(--text-secondary) border-b-2 border-(--text-secondary)/20 pb-3 font-bold sticky top-0 bg-(--border)">
              <span className="w-1/4">Date</span>
              <span className="w-1/4 text-center">Result</span>
              <span className="w-1/4 text-center">Speed</span>
              <span className="w-1/4 text-right">Accuracy</span>
            </div>
            {stats.recent_multiplayer_matches.map((match, index) => (
              <div
                key={index}
                className="flex justify-between text-(--text) py-3 border-b border-(--border)/50 hover:bg-black/20 transition-colors"
              >
                <span className="w-1/4">{match.date}</span>
                <span
                  className={`w-1/4 text-center font-extrabold ${match.outcome === "W" ? "text-green-500" : "text-red-500"}`}
                >
                  {match.outcome}
                </span>
                <span className="w-1/4 text-center text-(--accent) font-bold">
                  {match.wpm} WPM
                </span>
                <span
                  className={`text-${getAccuracyColor(match.accuracy)} w-1/4 text-right`}
                >
                  {match.accuracy}%
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-2xl text-(--text-secondary)">
              No multiplayer matches yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileMatches;
