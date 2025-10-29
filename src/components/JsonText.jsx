// component to take json as input

import { useState } from "react";

export default function JsonText({ onVisualize }) {
  const [jsonText, setJsonText] = useState(`{
  "user": {
    "id": 1,
    "name": "Priyanka",
    "skills": ["React", "Node"],
    "address": {
      "city": "Hyderabad",
      "country": "India"
    },
    "items": [
      {
        "name1": "item1"
      },
      {
        "name2": "item2"
      }
    ]
  }
}
`);
  const [error, setError] = useState("");

  const handleVisualize = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setError("");
      onVisualize(parsed);
    } catch (err) {
      // Try to extract position info from the error message
      const match = /position (\d+)/.exec(err.message);
      if (match) {
        const pos = parseInt(match[1], 10);
        const linesUntilError = jsonText.slice(0, pos).split("\n");
        const line = linesUntilError.length;
        const col = linesUntilError[linesUntilError.length - 1].length + 1;
        setError(` JSON error at line ${line}, column ${col}: ${err.message}`);
      } else {
        setError(` Invalid JSON: ${err.message}`);
      }
    }
  };

  const handleClearClick = () => {
    setJsonText(""); // 👈 clears the textarea
  };

  return (
    <div className="json-input-container" style={{ padding: "1rem" }}>
      <h2>Paste or Type Your JSON Data</h2>
      <textarea
        rows={15}
        placeholder="Paste your JSON here..."
        style={{
          width: "100%",
          padding: "0.5rem",
          fontFamily: "monospace",
          borderColor: error ? "red" : "#ccc",
        }}
        value={jsonText}
        onChange={(e) => {
          setJsonText(e.target.value)
          if (error) setError("");
        }
        }
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          marginTop: "1rem",
        }}
      >
        <button
          onClick={handleVisualize}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#0056b3")}
          onMouseOut={(e) => (e.target.style.background = "#007bff")}
        >
          Visualize JSON
        </button>

        <button
          onClick={handleClearClick}
          style={{
            flex: 1,
            padding: "0.6rem 1rem",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "500",
            transition: "background 0.2s ease",
          }}
          onMouseOver={(e) => (e.target.style.background = "#5a6268")}
          onMouseOut={(e) => (e.target.style.background = "#6c757d")}
        >
          Clear
        </button>
      </div>

    </div>
  );
}
