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

function TreeVisualizerInner({ nodes: initialNodes, edges: initialEdges, searchTerm,onSearchResult }) {
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
    // Step 1: Reset all nodes first
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: { ...n.style, border: "none", background: nodeColor(n), color: "#fff" },
      }))
    );
  
    // Step 2: If empty search, just stop after reset
    if (!searchTerm){
      onSearchResult?.(true);
       return;
      }
    let found = false;
    // Step 3: Apply highlighting for matches
    setNodes((nds) =>
      nds.map((n) => {
        const isMatch =
          n.data?.path?.toLowerCase() === searchTerm.toLowerCase() ||
          n.data?.label?.toLowerCase()?.includes(searchTerm.toLowerCase());
          if (isMatch) found = true;
        return {
          ...n,
          style: {
            ...n.style,
            border: isMatch ? "3px solid #ff4757" : "none",
            background: isMatch ? "#ffeaa7" : nodeColor(n),
            color: isMatch ? "#000" : "#fff",
          },
        };
      })
    );
    onSearchResult?.(found);

    // Step 4: Smoothly focus on first matched node
    const match = nodesRef.current.find(
      (n) =>
        n.data?.path?.toLowerCase() === searchTerm.toLowerCase() ||
        n.data?.label?.toLowerCase()?.includes(searchTerm.toLowerCase())
    );
  
    if (match) {
      setTimeout(() => {
        fitView({ nodes: [match], padding: 1.5, duration: 800 });
      }, 200);
    }
  }, [searchTerm, setNodes, fitView, nodeColor]);
  

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      fitView
      style={{ background: "#f8f9fa" }}
    >
      <MiniMap nodeColor={nodeColor} nodeStrokeWidth={2} />
      <Controls />
      <Background color="#aaa" gap={20} />
    </ReactFlow>
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
