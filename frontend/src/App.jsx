import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import { faker } from "@faker-js/faker";

const randomWords = faker.word.words(25);

function App() {
  return (
    <main
      className="md:px-6 md:py-3
    p-3 h-screen w-full"
    >
      <section
        className="md:flex
      hidden w-full h-full flex-col gap-6"
      >
        <Header />
        <div className="min-h-1/2 p-3 border-4 border-dashed border-(--accent) rounded-lg flex flex-col justify-center bg-(--bg-secondary) text-(--text-secondary) text-4xl tracking-widest font-(family-name:--geist)">
          {randomWords}
        </div>
      </section>
      <DesktopOnlyNotice />
    </main>
  );
}

export default App;
