import { useState } from "react";
import axios from "axios";

function App() {
  const API = import.meta.env.VITE_API_URL;

  const [userMood, setUserMood] = useState("");
  const [communityQuote, setCommunityQuote] = useState(null);
  const [aiQuote, setAiQuote] = useState(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [loading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Motivation");

  const generateQuote = async () => {
    if (!userMood.trim()) {
      alert("Please describe how you're feeling first.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(`${API}/quotes/mood/`, {
        message: userMood,
      });

      setAiQuote(res.data.ai_quote);
      setCommunityQuote(res.data.community_quote);
      setHasGenerated(true);
    } catch (error) {
      console.error(error);
      alert("Failed to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const addQuote = async () => {
    if (!text.trim() || !author.trim()) {
      alert("Please fill in both the quote text and author.");
      return;
    }

    try {
      await axios.post(
        `${API}/quotes/`,
        { text, author, category },
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Quote added successfully!");
      setText("");
      setAuthor("");
      setCategory("Motivation");
    } catch (error) {
      console.error(error);
      alert("Failed to add quote.");
    }
  };

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
  };

  const categories = [
    "Motivation", "Success", "Life", "Failure", "Happiness",
    "Sadness", "Stress", "Confidence", "Hope", "Friendship",
    "Love", "Education", "Career", "Leadership", "Discipline",
    "Perseverance", "SelfGrowth",
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "40px auto", padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>🌟 AI Quote Companion</h1>
      <p style={{ textAlign: "center" }}>Tell us how you're feeling and receive encouraging quotes.</p>

      {/* Mood Input */}
      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h2>How are you feeling today?</h2>
        <textarea
          rows="4"
          value={userMood}
          onChange={(e) => setUserMood(e.target.value)}
          placeholder="Example: I failed my exam and feel discouraged..."
          style={{ width: "100%", padding: "10px", boxSizing: "border-box" }}
        />
        <br /><br />
        <button onClick={generateQuote} disabled={loading}>
          {loading ? "Generating..." : "Generate Supportive Quote"}
        </button>
      </div>

      {/* Quote Results — only show after first generate */}
      {hasGenerated && (
        <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
          {/* AI Quote */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h2><b>AI Quote</b></h2>
            {aiQuote && aiQuote.text ? (
              <>
                <h3>"{aiQuote.text}"</h3>
                <p>— {aiQuote.author}</p>
              </>
            ) : (
              <p>Could not generate a quote. Please try again.</p>
            )}
          </div>

          {/* Community Quote */}
          <div style={{ ...cardStyle, flex: 1 }}>
            <h2><b>Community Quote</b></h2>
            {communityQuote ? (
              <>
                <h3>"{communityQuote.text}"</h3>
                <p><strong>Author:</strong> {communityQuote.author}</p>
                <p><strong>Category:</strong> {communityQuote.category}</p>
              </>
            ) : (
              <p>No community quotes found for this mood yet.</p>
            )}
          </div>
        </div>
      )}

      {/* Add Quote */}
      <div style={cardStyle}>
        <h2><b>Contribute a Quote</b></h2>
        <input
          type="text"
          placeholder="Quote text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
        />
        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ width: "100%", padding: "10px", marginBottom: "10px", boxSizing: "border-box" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <button onClick={addQuote}>Add Quote</button>
      </div>
    </div>
  );
}

export default App;