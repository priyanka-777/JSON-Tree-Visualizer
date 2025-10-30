import { useState,useRef } from "react";
import JsonText from "./components/JsonText";
import TreeVisualizer from "./components/TreeVisualizer";
import { parseJsonToFlow } from "./utils/parseJsonToFlow";
import Header from "./components/Header";

export default function App() {
  const [flowData, setFlowData] = useState(null); //  text in input
  const [searchInput, setSearchInput] = useState(""); // term to actually search
  const [searchTerm, setSearchTerm] = useState("");
  const [searchStatus, setSearchStatus] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const treeRef = useRef(null);

  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  const handleDownload = () => {
    if (treeRef.current?.downloadAsImage) {
      treeRef.current.downloadAsImage();
    }
  };

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
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        background: isDarkMode ? "#121212" : "#ffffff",
        color: isDarkMode ? "#eaeaea" : "#000000",
      }}
    >
      {/* Header */}
      <Header 
      isDarkMode={isDarkMode} 
      onToggleTheme={handleToggleTheme}
      onDownload={handleDownload} />

      {/* Main layout */}
      <div style={{ display: "flex", flexGrow: 1, overflow: "hidden" }}>
        {/* Left Panel */}
        <div
          style={{
            width: "35%",

            overflowY: "auto",
            padding: "1rem",
            background: isDarkMode ? "#1e1e1e" : "#fff",
          }}
        >
          <JsonText onVisualize={handleVisualize} onClear={() => {
            setFlowData(null);
            setSearchInput("");
            setSearchTerm("");
            setSearchStatus(null);
          }}
            isDarkMode={isDarkMode} />
        </div>

        {/* Right Panel */}
        <div
          style={{
            flexGrow: 1,
            height: "100%",
            overflow: "hidden",
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Search Bar  */}
          {flowData && (
            <div
              style={{
                padding: "0.75rem 1rem",

                background: isDarkMode ? "#1e1e1e" : "#f9f9f9",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                zIndex: 2,
              }}
            >
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input
                  type="text"
                  placeholder="Search path (e.g. $.user.skills[0])"
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

              {/* Status */}
              {searchStatus === "not-found" && (
                <div
                  style={{
                    color: "#dc3545",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  No matches found!
                </div>
              )}
              {searchStatus === "found" && (
                <div
                  style={{
                    color: "#28a745",
                    fontWeight: "500",
                    textAlign: "center",
                  }}
                >
                  Match found!
                </div>
              )}
            </div>
          )}

          {/* Tree Visualizer  */}
          <div style={{ flexGrow: 1, position: "relative" }}>
            {flowData ? (
              <TreeVisualizer
              forwardedRef={treeRef}
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
    </div>
  );
}
