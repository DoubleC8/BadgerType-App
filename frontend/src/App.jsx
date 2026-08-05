import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import SoloRace from "../components/SoloRace";
import Home from "../components/Home";
import MultiplayerLobby from "../components/MultiplayerLobby";

function App() {
  return (
    <Router>
      <main className="md:px-6 md:py-3 p-3 h-screen w-full">
        <section className="lg:flex hidden w-full h-full flex-col gap-6 font-(family-name:--geist)">
          <Header />

          {/* The Router dictates which component sits below the Header */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/solo" element={<SoloRace />} />
            <Route path="/lobby/:lobbyId" element={<MultiplayerLobby />} />
          </Routes>
        </section>
        <DesktopOnlyNotice />
      </main>
    </Router>
  );
}

export default App;
