import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const API = import.meta.env.VITE_API_URL;

  // for mood input
  const [userMood, setUserMood] = useState("");

  // for community quote
  const [communityQuote, setCommunityQuote] = useState(null);

  // for AI quote (placeholder for now)
  const [aiQuote, setAiQuote] = useState(null);

  // Add quote form
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Motivation");

  // Fetch community quote
  const getCommunityQuote = async () => {
    try {
      const res = await axios.get(
        `${API}/quotes/community/`
      );

      setCommunityQuote(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const generateQuote = async () => {
    try {
      const res = await axios.post(
        `${API}/quotes/mood/`,
        {
          message: userMood,
        }
      );

      setAiQuote(res.data.ai_quote);

      setCommunityQuote(
        res.data.community_quote
      );

    } catch (error) {
      console.error(error);
      alert("Failed to generate quote");
    }
  };
  // Add quote
  const addQuote = async () => {
    try {
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

      alert("Quote added successfully!");

      setText("");
      setAuthor("");
      setCategory("Motivation");

      await getCommunityQuote();
    } catch (error) {
      console.error(error);
      alert("Failed to add quote");
    }
  };

  useEffect(() => {
    getCommunityQuote();
  }, []);

  const cardStyle = {
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    backgroundColor: "#fff",
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "40px auto",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      <h1 style={{ textAlign: "center" }}>
        🌟 AI Quote Companion
      </h1>

      <p style={{ textAlign: "center" }}>
        Tell us how you're feeling and receive
        encouraging quotes.
      </p>

      {/* Mood Input */}
      <div style={{ ...cardStyle, marginBottom: "20px" }}>
        <h2>How are you feeling today?</h2>

        <textarea
          rows="4"
          value={userMood}
          onChange={(e) => setUserMood(e.target.value)}
          placeholder="Example: I failed my exam and feel discouraged..."
          style={{
            width: "100%",
            padding: "10px",
          }}
        />

        <br />
        <br />

        <button onClick={generateQuote}>
          Generate Supportive Quote
        </button>
      </div>


      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
        }}
      >

        <div style={{ ...cardStyle, flex: 1 }}>
          <h2><b>AI Quote</b></h2>

          {aiQuote ? (
            <>
              <h3>{aiQuote.text}</h3>
              <p>- {aiQuote.author}</p>
            </>
          ) : (
            <p>No AI quote yet.</p>
          )}
        </div>


        <div style={{ ...cardStyle, flex: 1 }}>
          <h2><b>Community Quote</b></h2>
          {communityQuote ? (
            <>
              <h3>{communityQuote.text}</h3>

              <p>
                <strong>Author:</strong>{" "}
                {communityQuote.author}
              </p>

              <p>
                <strong>Category:</strong>{" "}
                {communityQuote.category}
              </p>
            </>
          ) : (
            <p>No related community quote found.</p>
          )}


        </div>
      </div>


      <div style={cardStyle}>
        <h2> <b>Contribute a Quote</b></h2>

        <input
          type="text"
          placeholder="Quote text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <input
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <option>Motivation</option>
          <option>Success</option>
          <option>Life</option>
          <option>Failure</option>
          <option>Happiness</option>
          <option>Sadness</option>
          <option>Stress</option>
          <option>Confidence</option>
          <option>Hope</option>
          <option>Friendship</option>
          <option>Love</option>
          <option>Education</option>
          <option>Career</option>
          <option>Leadership</option>
          <option>Discipline</option>
          <option>Perseverance</option>
          <option>SelfGrowth</option>
        </select>

        <button onClick={addQuote}>
          Add Quote
        </button>
      </div>
    </div>
  );
}

export default App;