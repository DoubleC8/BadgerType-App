import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import TypingDisplay from "../components/TypingDisplay";
import Cursor from "../components/Cursor";
import { useEffect, useState } from "react";
import { fetchQuote } from "../services/api";

function App() {
  // const [quoteText, setQuoteText] = useState("");

  // useEffect(() => {
  //   const getQuote = async () => {
  //     const text = await fetchQuote();
  //     setQuoteText(text);
  //   };

  //   getQuote();
  // }, []);

  const quoteText =
    "The final door is about to open! And I am the one opening it! Then the world that we know of will come to an end! This world of insatiable desires will end!";

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
        <TypingDisplay quote={quoteText} />
      </section>
      <DesktopOnlyNotice />
    </main>
  );
}

export default App;
