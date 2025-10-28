import { useState } from "react";
import JsonText from "./components/JsonText";
import { parseJsonToFlow } from "./utils/parseJsonToFlow";

export default function App() {
  const [parsedJson, setParsedJson] = useState(null);

  const handleVisualize = (json) => {
    const { nodes, edges } = parseJsonToFlow(json);
    console.log("Nodes:", nodes);
    console.log("Edges:", edges);
    setParsedJson({ nodes, edges });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <JsonText onVisualize={handleVisualize} />
      {parsedJson && <p style={{ padding: "1rem" }}>✅ JSON parsed successfully!</p>}
    </div>
  );
}
