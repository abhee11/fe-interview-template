import { useEffect, useState } from "react";
import RunDetailsPanel from "./components/RunDetailsPanel";
import TraceTree from "./components/TraceTree";
import { RunNode } from "./types";

function App() {
  const [runNodes, setRunNodes] = useState<RunNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<RunNode | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRunNodes();
  }, []);

  const fetchRunNodes = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/traces`);
      const data = await response.json();
      setRunNodes(data);
    } catch (error) {
      console.error("Failed to fetch traces:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNodeSelect = (node: RunNode) => {
    setSelectedNode(node);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading traces...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          LangSmith Trace Viewer
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Trace Tree */}
          <div className="bg-white rounded-lg border p-6">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-gray-500">Loading trace nodes...</div>
              </div>
            ) : (
              <TraceTree
                nodes={runNodes}
                onNodeSelect={handleNodeSelect}
                selectedNodeId={selectedNode?.id}
              />
            )}
          </div>

          {/* Right Panel - Run Details */}
          <div className="bg-white rounded-lg border p-6">
            <RunDetailsPanel selectedNode={selectedNode} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
