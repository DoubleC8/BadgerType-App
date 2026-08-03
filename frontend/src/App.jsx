import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import Timer from "../components/Timer";
import TypingDisplay from "../components/TypingDisplay";
import { useEffect, useState } from "react";
import { fetchQuote } from "../services/api";
import useTypeEngine from "../hooks/useTypeEngine";
import Results from "../components/Results";

function App() {
  const [quoteText, setQuoteText] = useState("");

  useEffect(() => {
    const getQuote = async () => {
      const text = await fetchQuote();
      setQuoteText(text);
    };

    getQuote();
  }, []);

  const { userInput, startTime, endTime, timeElapsed, wpm, accuracy } =
    useTypeEngine(quoteText);

  return (
    <main
      className="md:px-6 md:py-3
    p-3 h-screen w-full"
    >
      <section
        className="md:flex
      hidden w-full h-full flex-col gap-6 font-(family-name:--geist)"
      >
        <Header />
        <Timer
          startTime={startTime}
          endTime={endTime}
          timeElapsed={timeElapsed}
        />
        <TypingDisplay quote={quoteText} userInput={userInput} />
        {endTime && (
          <Results wpm={wpm} accuracy={accuracy} timeElapsed={timeElapsed} />
        )}
      </section>
      <DesktopOnlyNotice />
    </main>
  );
}

export default App;
