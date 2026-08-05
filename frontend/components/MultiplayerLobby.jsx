import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import TypewriterText from "./TypewriterText";

const MultiplayerLobby = () => {
  const { lobbyId } = useParams();
  const [copied, setCopied] = useState(false);

  // 1. Initialize the animation controls
  const controls = useAnimation();

  const handleCopyLink = () => {
    const inviteLink = window.location.href;
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full h-3/4 flex flex-col items-center justify-center gap-6">
      <TypewriterText title={"Waiting for opponent..."} />
      <div className="p-6 bg-(--bg-secondary) rounded-lg flex flex-col items-center gap-3">
        <p className="text-xl text-(--text-secondary)">
          Send this link to a friend to play:
        </p>
        <div className="flex gap-3 items-center">
          <code className="px-4 py-2 bg-black rounded text-(--accent) text-xl">
            {window.location.href}
          </code>
          <button
            onClick={handleCopyLink}
            className="px-4 py-2 bg-(--accent) text-black font-bold rounded hover:opacity-80 cursor-pointer"
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
