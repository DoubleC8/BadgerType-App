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
      <div className="flex items-center gap-6 p-6 bg-(--bg-secondary) rounded-lg border-2 border-(--border)">
        <img
          src={stats?.profile_picture || user.imageUrl}
          alt="Profile"
          className="w-20 h-20 rounded-full border-4 border-(--accent)"
        />
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-(--text)">
            {stats?.username}
          </h1>
          <p className="text-xl text-(--text-secondary)">
            BadgerType Racer • {stats?.total_races || 0} Races Completed
          </p>
        </div>
      </div>
      <div className="w-full flex gap-3">
        <StatBox stat="Avg Speed" score={`${stats?.avg_wpm || 0} WPM`} />
        <StatBox stat="Best Speed" score={`${stats?.best_wpm || 0} WPM`} />
        <StatBox stat="Avg Accuracy" score={`${stats?.avg_accuracy || 0}%`} />
      </div>
    </div>
  );
};

export default Profile;
