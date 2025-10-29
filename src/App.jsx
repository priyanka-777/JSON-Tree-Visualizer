import { useState } from "react";
import JsonText from "./components/JsonText";
import TreeVisualizer from "./components/TreeVisualizer";
import { parseJsonToFlow } from "./utils/parseJsonToFlow";

export default function App() {
  const [flowData, setFlowData] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // text in input
  const [searchTerm, setSearchTerm] = useState("");   // term to actually search
  const [searchStatus, setSearchStatus] = useState(null);

  const handleVisualize = (json) => {
    const { nodes, edges } = parseJsonToFlow(json);
    setFlowData({ nodes, edges });
    setSearchInput("");
    setSearchTerm("");
    setSearchStatus(null);
  };

  const handleSearchClick = () => {
    const trimmed = searchInput.trim();
    if (!trimmed) return; // no empty searches
    setSearchStatus(null); // clear old status while searching
    setSearchTerm(trimmed); // only trigger when button clicked
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
      {/* Left Panel */}
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

        {/* Search Section */}
        {/* Search Section */}
        {flowData && (
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                gap: "0.5rem",
                alignItems: "center",
              }}
            >
              <input
                type="text"
                placeholder="Search path (e.g. user.skills[0])"
                value={searchInput}
                onChange={(e) => {
                
                  setSearchInput(e.target.value);
                  if (searchStatus !== null) {
                    setSearchStatus(null);
                  }
                  if ( e.target.value.trim() === "") {
                    setSearchTerm(""); 
                  }
                }
                }
                style={{
                  flexGrow: 1,
                  padding: "0.5rem",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <button
                onClick={handleSearchClick}
                style={{
                  padding: "0.5rem 1rem",
                  background: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Search
              </button>
            </div>

            {/* Not Found Message */}
            {searchStatus === "not-found" && (
              <div
                style={{
                  marginTop: "0.75rem",
                  color: "#dc3545",
                  fontWeight: "500",
                  textAlign: "center",
                  animation: "fadeIn 0.4s ease-in",
                }}
              >
                 No matches found!
              </div>
            )}

            {searchStatus === "found" && (
              <div
                style={{
                  marginTop: "0.75rem",
                  color: "#28a745",
                  fontWeight: "500",
                  textAlign: "center",
                  animation: "fadeIn 0.4s ease-in",
                }}
              >
                ✅ Match found!
              </div>
            )}
            
          </div>
        )}

      </div>

      {/* Right Panel */}
      <div
        style={{
          flexGrow: 1,
          height: "100%",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {flowData ? (
          <TreeVisualizer
            key={JSON.stringify(flowData.nodes.map((n) => n.id))}
            nodes={flowData.nodes}
            edges={flowData.edges}
            searchTerm={searchTerm} // 👈 pass term only on button click
            onSearchResult={(found) => setSearchStatus(found ? "found" : "not-found")}
          />

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
