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
      setError("❌ Invalid JSON format. Please check your input.");
    }
  };

  return (
    <div className="json-input-container" style={{ padding: "1rem" }}>
      <h2>Paste or Type Your JSON Data</h2>
      <textarea
        rows={15}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontFamily: "monospace",
          borderColor: error ? "red" : "#ccc",
        }}
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
      />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button
        onClick={handleVisualize}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Visualize JSON
      </button>
    </div>
  );
}
