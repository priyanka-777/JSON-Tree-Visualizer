import { useEffect, useState } from "react";

export default function Header({ isDarkMode, onToggleTheme,onDownload }) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: isDarkMode ? "#1e1e1e" : "#f5f5f5",
        color: isDarkMode ? "#f5f5f5" : "#1e1e1e",
        borderBottom: isDarkMode ? "1px solid #333" : "1px solid #ccc",
      }}
    >
      <h1 style={{ fontSize: "1.5rem", margin: 0 }}>JSON Tree Visualizer</h1>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
      <button
          onClick={onDownload}
          style={{
            padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          background: isDarkMode ? "#333" : "#007bff",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 500,
          }}
        >
          Download
        </button>
      <button
        onClick={onToggleTheme}
        style={{
          padding: "0.5rem 1rem",
          border: "none",
          borderRadius: "4px",
          background: isDarkMode ? "#333" : "#007bff",
          color: "#fff",
          cursor: "pointer",
          fontWeight: 500,
        }}
      >
        {isDarkMode ? "Light Mode" : "Dark Mode"}
      </button>
      </div>
    </header>
  );
}
