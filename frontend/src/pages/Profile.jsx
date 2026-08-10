import { useEffect, useState } from "react";
import { useUser } from "@clerk/react";
import { FaGhost } from "react-icons/fa";
import StatBox from "../components/StatBox";
import getAccuracyColor from "../utils/colors";
import ProfileHeader from "../components/ProfileHeader";
import ProfileStats from "../components/ProfileStats";
import ProfileMatches from "../components/ProfileMatches";

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
    <div className="w-full min-h-full h-fit bg-red-400 flex flex-col gap-6 font-(family-name:--geist)">
      <ProfileHeader stats={stats} />

      <ProfileStats stats={stats} />

      <ProfileMatches stats={stats} />
    </div>
  );
};

export default Profile;
