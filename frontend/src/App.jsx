import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import { faker } from "@faker-js/faker";
import TypingDisplay from "../components/TypingDisplay";
import Cursor from "../components/Cursor";

const randomWords = faker.word.words(25);

function App() {
  return (
    <main
      className="md:px-6 md:py-3
    p-3 h-screen w-full"
    >
      <section
        className="md:flex
      hidden w-full h-full flex-col gap-3"
      >
        <Header />
        <TypingDisplay randomWords={randomWords} />
      </section>
      <DesktopOnlyNotice />
    </main>
  );
}

export default App;
