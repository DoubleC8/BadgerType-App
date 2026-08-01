import DesktopOnlyNotice from "../components/DesktopOnlyNotice";
import Header from "../components/Header";
import TypingDisplay from "../components/TypingDisplay";
import Cursor from "../components/Cursor";
import { useEffect, useState } from "react";

export const fetchQuote = async () => {
  try {
    // Fetching quote
    const response = await fetch("http://localhost:8000/api/quote");
    const data = await response.json();
    return data.quote;
  } catch (error) {
    console.error("Failed to fetch quote: ", error);
    //Fall back incase fetching does not work
    return "The quick brown fox jumps over the lazy dog.";
  }
};

function App() {
  const [quoteText, setQuoteText] = useState("");

  useEffect(() => {
    const getQuote = async () => {
      const text = await fetchQuote();
      setQuoteText(text);
    };

    getQuote();
  }, []);
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
        <TypingDisplay randomWords={quoteText} />
      </section>
      <DesktopOnlyNotice />
    </main>
  );
}

export default App;
