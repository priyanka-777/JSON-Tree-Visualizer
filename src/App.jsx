import { useState } from "react";
import JsonText from "./components/JsonText";
import TreeVisualizer from "./components/TreeVisualizer";
import { parseJsonToFlow } from "./utils/parseJsonToFlow";
import Header from "./components/Header";

export default function App() {
  const [flowData, setFlowData] = useState(null);
  const [searchInput, setSearchInput] = useState(""); // text in input
  const [searchTerm, setSearchTerm] = useState("");   // term to actually search
  const [searchStatus, setSearchStatus] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleVisualize = (json) => {
    const { nodes, edges } = parseJsonToFlow(json);
    setFlowData({ nodes, edges });
    setSearchInput("");
    setSearchTerm("");
    setSearchStatus(null);
  };

  const handleSearchClick = () => {
    const trimmed = searchInput.trim();
    if (!trimmed) return;
    setSearchStatus(null);
    setSearchTerm(trimmed);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column", // 👈 header on top, rest below
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: isDarkMode ? "#121212" : "#ffffff",
        color: isDarkMode ? "#eaeaea" : "#000000",

      }}
    >
      {/* Top Header */}
      <Header isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme} />

      {/* Main Content (Left + Right panels) */}
      <div
        style={{
          display: "flex",
          flexGrow: 1,
          overflow: "hidden",

        }}
      >
        {/* Left Panel */}
        <div
          style={{
            width: "35%",
            borderRight: isDarkMode ? "1px solid #333" : "1px solid #ccc",
            overflowY: "auto",
            padding: "1rem",
            boxSizing: "border-box",
            background: isDarkMode ? "#1e1e1e" : "#fff",
          }}
        >
          <JsonText onVisualize={handleVisualize} isDarkMode={isDarkMode} />

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
                    if (searchStatus !== null) setSearchStatus(null);
                    if (e.target.value.trim() === "") setSearchTerm("");
                  }}
                  style={{
                    flexGrow: 1,
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    background: isDarkMode ? "#2c2c2c" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
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
                  Match found!
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
              searchTerm={searchTerm}
              isDarkMode={isDarkMode}
              onSearchResult={(found) =>
                setSearchStatus(found ? "found" : "not-found")
              }
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
    </div>
  );
}
