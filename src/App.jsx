import { useState } from "react";
import JsonText from "./components/JsonText";
import TreeVisualizer from "./components/TreeVisualizer";
import { parseJsonToFlow } from "./utils/parseJsonToFlow";

export default function App() {
  const [flowData, setFlowData] = useState(null);

  const handleVisualize = (json) => {
    const { nodes, edges } = parseJsonToFlow(json);
    setFlowData({ nodes, edges });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* Left panel */}
      <div
        style={{
          width: "35%",
          borderRight: "1px solid #ccc",
          overflowY: "auto",
          padding: "1rem",
          boxSizing: "border-box",
          background: "#fff",
        }}
      >
        <JsonText onVisualize={handleVisualize} />
      </div>

      {/* Right panel */}
      <div
        style={{
          flexGrow: 1,
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {flowData ? (
          <TreeVisualizer key={JSON.stringify(flowData.nodes.map(n => n.id))} nodes={flowData.nodes} edges={flowData.edges} />
        ) : (
          <div
            style={{
              padding: "2rem",
              textAlign: "center",
              color: "#777",
            }}
          >
            🪄 Paste your JSON and click “Visualize JSON” to see the tree!
          </div>
        )}
      </div>
    </div>
  );
}
