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
