import type { RunNode } from '../types';

// Deterministic, unordered, mixed-type traces; never used by the API or production build.
export function generateTrace(count: number): RunNode[] {
  const runs: RunNode[] = [];
  const start = Date.UTC(2025, 0, 1);
  for (let i = 0; i < count; i++) {
    const parent = i ? Math.floor((i - 1) / 4) : null;
    const ancestors = parent === null ? [] : [...runs[parent].parent_run_ids, runs[parent].id];
    const runType = ['chain', 'llm', 'tool', 'retriever'][i % 4];
    runs.push({
      id: `synthetic-${i}`, name: `${runType} run ${i}`, run_type: runType,
      start_time: new Date(start + i * 7).toISOString(),
      end_time: i % 101 === 100 ? null : new Date(start + i * 7 + 10 + (i * 73) % 5000).toISOString(),
      parent_run_id: parent === null ? null : `synthetic-${parent}`,
      parent_run_ids: ancestors, trace_id: 'synthetic-0',
      total_tokens: i % 4 === 1 ? (i * 997) % 20000 : 0,
      total_cost: i % 4 === 1 ? ((i * 97) % 1000) / 100000 : null,
      error: i % 97 === 96 ? 'Synthetic tool failure' : null,
      status: i % 97 === 96 ? 'error' : i % 101 === 100 ? 'running' : 'success',
    });
  }
  return runs.reverse();
}
