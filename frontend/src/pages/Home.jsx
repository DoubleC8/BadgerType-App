import { useNavigate } from "react-router-dom";
import TypewriterText from "../components/TypewriterText";
import Button from "../components/Button";

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
        <Button
          onAction={() => navigate("/solo")}
          title={"Solo"}
          buttonColor={"bg-secondary"}
          textColor={"text-secondary"}
        />
        <Button
          onAction={createLobby}
          title={"Multiplayer"}
          buttonColor={"accent"}
          textColor={"text"}
        />
      </div>
    </div>
  );
};

export default Home;
