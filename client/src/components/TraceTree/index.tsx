import { RunNode } from "../../types";

interface TraceTreeProps {
  nodes: RunNode[];
  onNodeSelect?: (node: RunNode) => void;
  selectedNodeId?: string;
}

function TraceTree({ nodes, onNodeSelect, selectedNodeId }: TraceTreeProps) {
  const handleNodeClick = (node: RunNode) => {
    onNodeSelect?.(node);
  };

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Trace Tree</h3>
      <div className="space-y-1">
        {nodes.map((node) => (
          <div
            key={node.id}
            onClick={() => handleNodeClick(node)}
            className={`p-3 border rounded-md cursor-pointer transition-colors ${
              selectedNodeId === node.id
                ? "bg-blue-50 border-blue-300"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="font-medium text-gray-900">{node.name}</div>
                <div className="text-sm text-gray-500">
                  Type: {node.run_type} | Status: {node.status}
                </div>
              </div>
              <div className="text-xs text-gray-400">{node.start_time}</div>
            </div>
            {node.error && (
              <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                Error: {node.error}
              </div>
            )}
            <pre>{node.id}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TraceTree;
