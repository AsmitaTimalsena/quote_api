import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [quote, setQuote] = useState(null);
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Motivation");

  const API = "https://quote-api-gilt.vercel.app";

  // GET random quote
  const getQuote = async () => {
    const res = await axios.get(`${API}/quotes/random/`);
    setQuote(res.data);
  };

  // POST new quote
const addQuote = async () => {
  await axios.post(
    `${API}/quotes/`,
    {
      text,
      author,
      category,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  setText("");
  setAuthor("");
  alert("Quote added!");
};
  useEffect(() => {
    getQuote();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Quote API</h1>

      {/* Show random quote */}
      {quote && (
        <div style={{ marginBottom: 20 }}>
          <h2>{quote.text}</h2>
          <p>- {quote.author}</p>
          <p>{quote.category}</p>
        </div>
      )}

      <button onClick={getQuote}>Get Random Quote</button>

      <hr />

      {/* Add Quote Form */}
      <h2>Add Quote</h2>

      <input
        placeholder="Text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />

      <input
        placeholder="Author"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
      />
      <br />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Motivation</option>
        <option>Success</option>
        <option>Life</option>
      </select>

      <br />
      <button onClick={addQuote}>Add Quote</button>
    </div>
  );
}

export default App;