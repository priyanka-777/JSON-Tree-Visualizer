import { useState } from "react";
import JsonText from "./components/JsonText";

export default function App() {
  const [parsedJson, setParsedJson] = useState(null);

  const handleVisualize = (json) => {
    console.log("Parsed JSON:", json);
    setParsedJson(json);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <JsonText onVisualize={handleVisualize} />
      {parsedJson && <p style={{ padding: "1rem" }}>✅ JSON parsed successfully!</p>}
    </div>
  );
}
