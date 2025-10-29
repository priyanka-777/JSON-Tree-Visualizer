let nodeId = 0;

export function parseJsonToFlow(json, parentId = null, path = "$", posX = 0, posY = 0, level = 0) {
  let nodes = [];
  let edges = [];

  const type = getType(json);
  const currentId = `node-${nodeId++}`;
  const label = path === "$" ? "" : path.split(".").pop();
  const displayValue =
    type === "string" || type === "number" || type === "boolean" || type === "null"
      ? String(json)
      : null;

  // Skip root "$"
  if (path !== "$") {
    const node = {
      id: currentId,
      data: {
        label: displayValue ? `${label}: ${displayValue}` : label,
        path,
        type,
      },
      position: { x: level * 280, y: posY },
      style: {
        background: nodeColorByType(type),
        color: "#fff",
        borderRadius: 8,
        padding: 10,
        fontSize: 13,
        minWidth: 140,
        textAlign: "center",
        boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      },
    };
    nodes.push(node);

    if (parentId) {
      edges.push({
        id: `edge-${parentId}-${currentId}`,
        source: parentId,
        target: currentId,
        animated: false,
      });
    }
  }

  // Spacing between child nodes
  const verticalSpacing = 120;
  let currentY = posY;

  // Recurse for objects and arrays
  if (type === "object") {
    for (const [key, value] of Object.entries(json)) {
      const { nodes: childNodes, edges: childEdges } = parseJsonToFlow(
        value,
        path === "$" ? null : currentId,
        path === "$" ? key : `${path}.${key}`,
        posX,
        currentY,
        level + 1
      );

      nodes = nodes.concat(childNodes);
      edges = edges.concat(childEdges);

      currentY += verticalSpacing * Math.max(1, childNodes.length / 2);
    }
  } else if (type === "array") {
    json.forEach((value, index) => {
      const { nodes: childNodes, edges: childEdges } = parseJsonToFlow(
        value,
        path === "$" ? null : currentId,
        path === "$" ? `[${index}]` : `${path}[${index}]`,
        posX,
        currentY,
        level + 1
      );

      nodes = nodes.concat(childNodes);
      edges = edges.concat(childEdges);

      currentY += verticalSpacing * Math.max(1, childNodes.length / 2);
    });
  }

  // Add unified root node at very top (only once)
  if (path === "$") {
    const rootId = "root-node";
    const rootNode = {
      id: rootId,
      data: { label: "Root", path: "$", type: "object" },
      position: { x: 0, y: 0 },
      style: {
        background: "#2563eb", // distinct blue
        color: "#fff",
        borderRadius: 8,
        padding: 12,
        fontSize: 14,
        fontWeight: "bold",
        minWidth: 150,
        textAlign: "center",
        boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
      },
    };

    // Connect all top-level nodes directly to Root
    const topEdges = nodes
      .filter((n) => !edges.some((e) => e.target === n.id)) // nodes with no parent
      .map((n) => ({
        id: `edge-${rootId}-${n.id}`,
        source: rootId,
        target: n.id,
      }));

    nodes.unshift(rootNode);
    edges = [...topEdges, ...edges];
  }

  return { nodes, edges };
}

function getType(value) {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function nodeColorByType(type) {
  switch (type) {
    case "object":
      return "#7c3aed";
    case "array":
      return "#10b981";
    case "null":
      return "#f59e0b";
    case "number":
    case "string":
    case "boolean":
      return "#f97316";
    default:
      return "#9ca3af";
  }
}
