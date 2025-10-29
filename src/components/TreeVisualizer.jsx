import React, { useCallback, useEffect, useRef } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

function TreeVisualizerInner({ nodes: initialNodes, edges: initialEdges, searchTerm,isDarkMode,onSearchResult }) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { fitView } = useReactFlow();
  const nodesRef = useRef(nodes);

  // Keep ref updated but don't re-trigger effects
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const nodeColor = useCallback((node) => {
    switch (node.data.type) {
      case "object":
        return "#6c5ce7";
      case "array":
        return "#00b894";
      default:
        return "#f44336";
    }
  }, []);

  useEffect(() => {
    // Step 1: Reset all node styles
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: { ...n.style, border: "none", background: nodeColor(n), color: "#fff" },
      }))
    );
  
    // Step 2: Stop here if no search term (don’t notify parent)
    if (!searchTerm) return;
  
    // Step 3: Determine matches in one pass
    const lowerSearch = searchTerm.toLowerCase();
    const matchedNodeIds = nodesRef.current
      .filter(
        (n) =>
          n.data?.path?.toLowerCase() === lowerSearch ||
          n.data?.label?.toLowerCase()?.includes(lowerSearch)
      )
      .map((n) => n.id);
  
    const found = matchedNodeIds.length > 0;
    onSearchResult?.(found);
  
    // Step 4: Apply new styles (highlight matches)
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: {
          ...n.style,
          border: matchedNodeIds.includes(n.id) ? "3px solid #ff4757" : "none",
          background: matchedNodeIds.includes(n.id)
            ? "#ffeaa7"
            : nodeColor(n),
          color: matchedNodeIds.includes(n.id) ? "#000" : "#fff",
        },
      }))
    );
  
    // Step 5: Focus on first match if found
    if (found) {
      const firstMatch = nodesRef.current.find((n) => matchedNodeIds.includes(n.id));
      if (firstMatch) {
        setTimeout(() => {
          fitView({ nodes: [firstMatch], padding: 1.5, duration: 800 });
        }, 200);
      }
    }
  }, [searchTerm, setNodes, fitView, nodeColor, onSearchResult]);
  
  

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: isDarkMode ? "#121212" : "#fafafa",
        color: isDarkMode ? "#eaeaea" : "#000000",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      style={{
        background: isDarkMode ? "#1e1e1e" : "#ffffff",
        color: isDarkMode ? "#eaeaea" : "#000000",
      }}
    >
      <MiniMap nodeColor={(node) => (isDarkMode ? "#007bff" : "#555")}
          maskColor={isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.8)"} nodeStrokeWidth={2} />
      <Controls style={{ background: isDarkMode ? "#2a2a2a" : "#fff" }}/>
      <Background variant="dots"
          gap={12}
          size={1}
          color={isDarkMode ? "#444" : "#ddd"} />
    </ReactFlow>
  </div>
  );
}

export default function TreeVisualizer(props) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
      }}
    >
      <ReactFlowProvider>
        <TreeVisualizerInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
