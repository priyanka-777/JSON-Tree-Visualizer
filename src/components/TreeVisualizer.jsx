import React, { useCallback,useEffect } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
} from "reactflow";
import "reactflow/dist/style.css";



export default function TreeVisualizer({ nodes: initialNodes, edges: initialEdges }) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const nodeColor = useCallback((node) => {
    switch (node.data.type) {
      case "object":
        return "#6c5ce7"; // Purple
      case "array":
        return "#00b894"; // Green
      default:
        return "#fdcb6e"; // Yellow/Orange for primitives
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%",position: "absolute",
        top: 0,
        left: 0, }}>
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
    </div>
  );
}
