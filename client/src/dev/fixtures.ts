import type { RunNode } from '../types';

// Deterministic, unordered, mixed-type traces; never used by the API or production build.
export function generateTrace(count: number): RunNode[] {
  const runs: RunNode[] = [];
  const start = Date.UTC(2025, 0, 1);
  for (let i = 0; i < count; i++) {
    const parent = i ? Math.floor((i - 1) / 4) : null;
    const ancestors = parent === null ? [] : [...runs[parent].parent_run_ids, runs[parent].id];
    const runType = ['chain', 'llm', 'tool', 'retriever'][(parent ?? 0) % 4];
    // Vary sibling spikes so every threshold visibly changes the results.
    const spike = i % 4 === 0 ? [2.5, 3.5, 8][(parent ?? 0) % 3] : 1;
    const base = 100 + ((parent ?? 0) * 74) % 1000;
    runs.push({
      id: `synthetic-${i}`, name: `${runType} run ${i}`, run_type: runType,
      start_time: new Date(start + i * 7).toISOString(),
      end_time: i % 101 === 100 ? null : new Date(start + i * 7 + base * spike).toISOString(),
      parent_run_id: parent === null ? null : `synthetic-${parent}`,
      parent_run_ids: ancestors, trace_id: 'synthetic-0',
      total_tokens: base * spike,
      total_cost: base * spike / 100000,
      error: i % 97 === 96 ? 'Synthetic tool failure' : null,
      status: i % 97 === 96 ? 'error' : i % 101 === 100 ? 'running' : 'success',
    });
  }
  return runs.reverse();
}
