// Initialize node id with 0 
let nodeId = 0;
let globalY = 0;

export function parseJsonToFlow(json, parentId = null, depth = 0, posX = 0, posY = 0) {
    let nodes = [];
    let edges = [];

    const currentId = `node-${nodeId++}`;

    // Determine node label and type
    let type = typeof json;
    let label;

    if (json === null) {
        type = "null";
        label = "null";
    } else if (Array.isArray(json)) {
        type = "array";
        label = "Array";
    } else if (type === "object") {
        label = "Object";
    } else {
        label = String(json);
    }

    // Add current node
    nodes.push({
        id: currentId,
        data: { label },
        position: { x: posX, y: posY },
        style: getNodeStyle(type),
    });

    // Connect to parent if applicable
    if (parentId) {
        edges.push({
            id: `edge-${parentId}-${currentId}`,
            source: parentId,
            target: currentId,
        });
    }

    // Recurse for child elements (if object or array)
    if (type === "object" && json !== null) {
        let i = 0;
        for (const [key, value] of Object.entries(json)) {
            const childX = posX + 250;
            const childY = globalY * 120;
            globalY++;

            const { nodes: childNodes, edges: childEdges } = parseJsonToFlow(
                value,
                currentId,
                depth + 1,
                childX,
                childY
            );

            // key node
            nodes.push({
                id: `${currentId}-key-${key}`,
                data: { label: key },
                position: { x: posX + 120, y: childY + 20 },
                style: getNodeStyle("key"),
            });

            edges.push({
                id: `edge-${currentId}-${currentId}-key-${key}`,
                source: currentId,
                target: `${currentId}-key-${key}`,
            });

            nodes = nodes.concat(childNodes);
            edges = edges.concat(childEdges);
            i++;
        }
    } else if (type === "array") {
        json.forEach((value, index) => {
            const childX = posX + 250;
            const childY = globalY * 120;
            globalY++;
          
            // index node ([0], [1]…)
            const indexNodeId = `${currentId}-index-${index}`;
            nodes.push({
              id: indexNodeId,
              data: { label: `[${index}]` },
              position: { x: posX + 120, y: childY + 20 },
              style: getNodeStyle("key"),
            });
          
            edges.push({
              id: `edge-${currentId}-${indexNodeId}`,
              source: currentId,
              target: indexNodeId,
            });
          
            const { nodes: childNodes, edges: childEdges } = parseJsonToFlow(
              value,
              indexNodeId,
              depth + 1,
              childX,
              childY
            );
          
            nodes = nodes.concat(childNodes);
            edges = edges.concat(childEdges);
          });
    }
    return { nodes, edges };
}

function getNodeStyle(type) {
    switch (type) {
        case "object":
            return { background: "#7E57C2", color: "white", borderRadius: "8px", padding: 10 };
        case "array":
            return { background: "#43A047", color: "white", borderRadius: "8px", padding: 10 };
        case "key":
            return { background: "#03A9F4", color: "white", borderRadius: "8px", padding: 10 };
        case "number":
        case "string":
        case "boolean":
        case "null":
            return { background: "#FBC02D", color: "black", borderRadius: "8px", padding: 10 };
        default:
            return { background: "#E0E0E0", color: "black" };
    }
}
