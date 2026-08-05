import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, useAnimation } from "motion/react";
import TypewriterText from "../components/TypewriterText";

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
      <div className="w-full flex justify-center gap-6">
        <div className="w-2/5 flex flex-col gap-3 justify-evenly items-center p-3 bg-(--bg-secondary) rounded-lg">
          <p className="text-xl text-(--text-secondary)">
            Send this link to a friend to play:
          </p>
          <div className="w-full flex gap-3 items-center">
            <code className="h-12 w-7/10 px-3 py-1 flex flex-col justify-center bg-(--border) rounded-lg text-(--accent) text-xl overflow-clip">
              {window.location.href}
            </code>
            <button
              onClick={handleCopyLink}
              className="h-12 w-3/10 px-3 py-1 flex flex-col justify-center bg-(--accent) rounded-lg font-bold text-xl hover:cursor-pointer duration-300 ease-in-out"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiplayerLobby;
