import React from "react";

const ProfileHeader = ({ stats }) => {
  return (
    <div className="w-full min-h-1/5 flex items-center gap-6 p-6 bg-(--bg-secondary) rounded-lg border-4 border-(--border)">
      <img
        src={stats?.profile_picture || user.imageUrl}
        alt="Profile"
        className="w-20 h-20 rounded-full border-4 border-(--accent)"
      />
      <div className="flex flex-col">
        <h1 className="text-4xl font-bold text-(--text)">{stats?.username}</h1>
        <p className="text-xl text-(--text-secondary)">
          BadgerType Racer •{" "}
          <span className="text-(--accent) font-extrabold">
            {stats?.total_races || 0} Races Completed
          </span>
          {" • "}
          <span className="text-(--green) font-extrabold">
            {stats?.total_wins || 0}W
          </span>
          {" - "}
          <span className="text-(--red) font-extrabold">
            {stats?.total_losses || 0}L
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfileHeader;
