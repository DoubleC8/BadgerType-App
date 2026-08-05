import { useNavigate } from "react-router-dom";
import TypewriterText from "../components/TypewriterText";

const Home = () => {
  const navigate = useNavigate();

  const createLobby = () => {
    const randomId = Math.random().toString(36).substring(2, 8);
    navigate(`/lobby/${randomId}`);
  };

  return (
    <div className="w-full h-3/4 flex flex-col items-center justify-center gap-6">
      <TypewriterText title={"Choose a Game Mode..."} />
      <div className="w-full flex justify-center gap-6">
        <button
          onClick={() => navigate("/solo")}
          className="w-1/5 h-13 p-3 text-(--text-secondary) bg-(--bg-secondary) rounded-lg text-xl font-bold hover:cursor-pointer hover:opacity-80 ease-in-out duration-300"
        >
          Solo
        </button>
        <button
          onClick={createLobby}
          className="w-1/5 h-13 p-3 bg-(--accent) text-(--text) rounded-lg text-xl font-bold hover:cursor-pointer hover:opacity-80 ease-in-out duration-300"
        >
          Multiplayer
        </button>
      </div>
    </div>
  );
};

export default Home;
