import { useEffect, useState } from "react";
import { RunContent, RunNode } from "../../types";

interface RunDetailsPanelProps {
  selectedNode: RunNode | null;
}

function RunDetailsPanel({ selectedNode }: RunDetailsPanelProps) {
  const [runContent, setRunContent] = useState<RunContent | null>(null);

  useEffect(() => {
    async function fetchRunContent() {
      if (!selectedNode) {
        setRunContent(null);
        return;
      }

      try {
        const response = await fetch(`/api/traces/${selectedNode.id}`);
        const data = await response.json();
        setRunContent(data);
      } catch (error) {
        console.error("Failed to fetch node content:", error);
        setRunContent(null);
      }
    }

    fetchRunContent();
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border">
        <p className="text-gray-500 text-center">
          Select a node from the trace tree to view details
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Run Details</h3>
      <pre>{selectedNode.id}</pre>
      {/* Inputs and Outputs */}
      {runContent ? (
        <div className="space-y-4">
          {/* Inputs */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">Inputs</h4>
            <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(runContent.inputs, null, 2)}
            </pre>
          </div>

          {/* Outputs */}
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-3">Outputs</h4>
            <pre className="bg-gray-800 text-white p-4 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(runContent.outputs, null, 2)}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 p-4 rounded-lg border">
          <p className="text-gray-500 text-center">
            No detailed content available for this node
          </p>
        </div>
      )}
    </div>
  );
}

export default RunDetailsPanel;
