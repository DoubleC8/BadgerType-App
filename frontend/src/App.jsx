import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import SoloRace from "../components/SoloRace";

function App() {
  return (
    <main
      className="md:px-6 md:py-3
    p-3 h-screen w-full"
    >
      <section
        className="lg:flex
      hidden w-full h-full flex-col gap-6 font-(family-name:--geist)"
      >
        <Header />
        <SoloRace />
      </section>
      <DesktopOnlyNotice />
    </main>
  );
}

export default App;
