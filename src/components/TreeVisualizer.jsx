import React, {
  useCallback,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { toPng } from "html-to-image";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  getNodesBounds,
  getViewportForBounds,
} from "reactflow";
import "reactflow/dist/style.css";

function TreeVisualizerInner(
  { nodes: initialNodes, edges: initialEdges, searchTerm, isDarkMode, onSearchResult },
  ref
) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const { fitView, getNodes } = useReactFlow();
  const nodesRef = useRef(nodes);
  const reactFlowWrapperRef = useRef(null);

  // Keep ref updated but don't re-trigger effects
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useImperativeHandle(ref, () => ({
    async downloadAsImage() {
      try {
        const flow = reactFlowWrapperRef.current?.querySelector(".react-flow__viewport");
        if (!flow) {
          console.error("React Flow viewport not found");
          return;
        }

        // Get all node bounds
        const allNodes = getNodes();
        if (!allNodes || allNodes.length === 0) {
          alert("No nodes found to export");
          return;
        }

        const nodesBounds = getNodesBounds(allNodes);

        // Add padding to include outer edges
        const padding = 100;
        nodesBounds.x -= padding;
        nodesBounds.y -= padding;
        nodesBounds.width += padding * 2;
        nodesBounds.height += padding * 2;

        const imageWidth = 1920;
        const imageHeight = 1080;
        const viewport = getViewportForBounds(
          nodesBounds,
          imageWidth,
          imageHeight,
          0.2,
          1.8
        );

        // Generate PNG using html-to-image
        const dataUrl = await toPng(flow, {
          backgroundColor: isDarkMode ? "#121212" : "#ffffff",
          width: imageWidth,
          height: imageHeight,
          pixelRatio: 2,
          style: {
            width: `${imageWidth}px`,
            height: `${imageHeight}px`,
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
        });

        const link = document.createElement("a");
        link.download = "tree-visualization.png";
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error("Error generating image:", err);
        alert("Download failed. Check console for details.");
      }
    },
  }));

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
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        style: { ...n.style, border: "none", background: nodeColor(n), color: "#fff" },
      }))
    );

    if (!searchTerm) return;

    const lowerSearch = searchTerm.toLowerCase();
    const matchedNodeIds = nodesRef.current
    .filter((n) => {
      const nodePath = n.data?.path?.toLowerCase();
      const nodeLabel = n.data?.label?.toLowerCase();
  
      // normalize paths → always treat as "$.<path>"
      const normalizedNodePath = nodePath.startsWith("$")
        ? nodePath
        : "$." + nodePath;
  
      // exact match when user starts with "$"
      const isPathMatch =
        lowerSearch.startsWith("$") && normalizedNodePath === lowerSearch;
  
      // fuzzy label match when user doesn't start with "$"
      const isLabelMatch =
        !lowerSearch.startsWith("$") && nodeLabel?.includes(lowerSearch);
  
      return isPathMatch || isLabelMatch;
  })  
      .map((n) => n.id);

    const found = matchedNodeIds.length > 0;
    onSearchResult?.(found);

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

    if (found) {
      const firstMatch = nodesRef.current.find((n) =>
        matchedNodeIds.includes(n.id)
      );
      if (firstMatch) {
        setTimeout(() => {
          fitView({ nodes: [firstMatch], padding: 1.5, duration: 800 });
        }, 200);
      }
    }
  }, [searchTerm, setNodes, fitView, nodeColor, onSearchResult]);

  return (
    <div
      ref={reactFlowWrapperRef}
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
        <MiniMap
          nodeColor={() => (isDarkMode ? "#007bff" : "#555")}
          maskColor={
            isDarkMode ? "rgba(0,0,0,0.7)" : "rgba(255,255,255,0.8)"
          }
          nodeStrokeWidth={2}
        />
        <Controls style={{ background: isDarkMode ? "#2a2a2a" : "#fff" }} />
        <Background
          variant="dots"
          gap={12}
          size={1}
          color={isDarkMode ? "#444" : "#ddd"}
        />
      </ReactFlow>
    </div>
  );
}

const ForwardedTreeVisualizerInner = forwardRef(TreeVisualizerInner);

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
        <ForwardedTreeVisualizerInner {...props} ref={props.forwardedRef} />
      </ReactFlowProvider>
    </div>
  );
}
