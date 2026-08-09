import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { FaGhost } from "react-icons/fa";
import StatBox from "../components/StatBox";

const Profile = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      fetch(`http://localhost:8000/api/users/${user.id}/stats`)
        .then((res) => res.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch user stats: ", err);
          setLoading(false);
        })
        .finally(() => setLoading(false));
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded || loading) {
    return (
      <div className="w-full h-3/4 flex items-center justify-center text-4xl font-bold text-(--accent) animate-pulse">
        Loading Stats...
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="w-full h-3/4 flex flex-col gap-3 items-center justify-center text-4xl font-bold text-(--red)">
        <FaGhost />
        <p>Please sign in to view your profile and lifetime stats.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-6 font-(family-name:--geist)">
      <div className="w-full min-h-1/5 flex items-center gap-6 p-6 bg-(--bg-secondary) rounded-lg border-4 border-(--accent)">
        <img
          src={stats?.profile_picture || user.imageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-(--border)"
        />
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-(--text)">
            {stats?.username}
          </h1>
          <p className="text-xl text-(--text-secondary)">
            BadgerType Racer •{" "}
            <span className="text-(--accent) font-extrabold">
              {stats?.total_races || 0} Races Completed
            </span>
          </p>
        </div>
      </div>
      <div className="w-full min-h-3/10 flex gap-6">
        <StatBox stat="Avg Speed" score={`${stats?.avg_wpm || 0} WPM`} />
        <StatBox stat="Best Speed" score={`${stats?.best_wpm || 0} WPM`} />
        <StatBox stat="Avg Accuracy" score={`${stats?.avg_accuracy || 0}%`} />
      </div>
      {/* Updated Parent Container */}
      {/* Updated Parent Container */}
      <div className="w-full flex-1 min-h-0 flex flex-col gap-3 p-3 bg-(--bg-secondary) rounded-lg border-4 border-(--border) mb-6">
        <h2 className="text-2xl font-bold text-(--text-secondary)">
          Recent Matches
        </h2>

        {stats?.recent_matches?.length > 0 ? (
          /* Updated Inner List Container (Removed bg-red-400 and added scroll classes) */
          <div className="w-full flex-1 overflow-y-auto flex flex-col flex-nowrap pr-2">
            {/* Table Header */}
            <div className="flex justify-between text-(--text-secondary) border-b-2 border-(--border) pb-3 font-bold sticky top-0 bg-(--bg-secondary)">
              <span className="w-1/3">Date</span>
              <span className="w-1/3 text-center">Speed</span>
              <span className="w-1/3 text-right">Accuracy</span>
            </div>

            {/* Table Rows */}
            {stats.recent_matches.map((match, index) => (
              <div
                key={index}
                className="flex justify-between text-(--text) py-3 border-b border-(--border)/50 hover:bg-black/20 transition-colors"
              >
                <span className="w-1/3">{match.date}</span>
                <span className="w-1/3 text-center text-(--accent) font-bold">
                  {match.wpm} WPM
                </span>
                <span className="w-1/3 text-right">{match.accuracy}%</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex-1 flex flex-col items-center justify-center">
            <p className="text-2xl text-(--text-secondary)">
              No matches played yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
