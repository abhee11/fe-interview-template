import { Router } from "express";
import { singleRuns } from "../data/singleRuns";
import { traceTree } from "../data/traceTree";

const router = Router();

// GET /api/traces - Get list of available traces
router.get("/", async (req, res) => {
  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (traceTree.length === 0) {
    return res.status(404).json({ error: "Trace not found" });
  }

  res.json(traceTree);
});

// GET /api/traces/:traceId - Get full trace tree
router.get("/:traceId", async (req, res) => {
  // Add artificial delay to simulate network latency
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const traceId = req.params.traceId;

  const trace = singleRuns[traceId as keyof typeof singleRuns];

  if (!trace) {
    return res.status(404).json({ error: "Trace not found" });
  }

  res.json(trace);
});

export default router;
