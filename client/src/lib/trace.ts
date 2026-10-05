import { RunNode } from '../types';

export const status = (run: RunNode) => run.error ? 'error' : run.status || (run.end_time ? 'success' : 'running');
export const elapsed = (run: RunNode) => run.end_time ? Date.parse(run.end_time) - Date.parse(run.start_time) : NaN;
export const duration = (run: RunNode) => {
  const ms = elapsed(run);
  return !run.end_time ? (['running', 'pending'].includes(status(run)) ? 'Running' : '—') : !Number.isFinite(ms) ? '—' : ms < 1000 ? `${Math.max(0, ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
};
export const tokens = (value?: number | null) => value == null ? '—' : value.toLocaleString();
export const cost = (value?: number | null) => value == null ? '—' : `$${value.toFixed(5)}`;
export type OutlierMetric = 'tokens' | 'duration' | 'cost';
export type OutlierThreshold = 2 | 3 | 4;
export const matchesOutlier = (outlier: Outlier, metric: OutlierMetric | 'all' | null, threshold: OutlierThreshold = 3) => outlier.ratio >= threshold && (!metric || metric === 'all' || outlier.metric === metric);
const metrics: OutlierMetric[] = ['tokens', 'duration', 'cost'];
export interface Outlier { metric: OutlierMetric; ratio: number; heading: string; comparison: string; explanation: string }
export interface Entry {
  run: RunNode; parent: string | null; children: string[]; depth: number; search: string;
  outliers: Outlier[]; metrics: Record<OutlierMetric, number>;
}
export interface TraceIndex {
  entries: Map<string, Entry>; roots: string[]; order: string[];
  types: string[]; statuses: string[];
}
const metricNumber = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 6 });
// Cache candidates at the lowest selectable threshold (2×). Sort once per peer group; median excluding each candidate is then O(1).
function detectOutliers(eligible: Entry[], metric: OutlierMetric) {
  if (eligible.length < 3) return;
  const sorted = [...eligible].sort((a, b) => a.metrics[metric] - b.metrics[metric]);
  const peers = sorted.length - 1, lower = Math.floor((peers - 1) / 2), upper = Math.floor(peers / 2);
  const format = (value: number) => metric === 'duration' ? `${Number((value / 1000).toPrecision(4))} s` : `${metric === 'cost' ? '$' : ''}${metricNumber.format(value)}${metric === 'tokens' ? ' tokens' : ''}`;
  sorted.forEach((entry, i) => {
    const at = (position: number) => sorted[position >= i ? position + 1 : position].metrics[metric];
    const median = (at(lower) + at(upper)) / 2, value = entry.metrics[metric];
    if (median <= 0 || value / median < 2) return;
    const label = metric === 'duration' ? 'Latency outlier' : metric === 'tokens' ? 'Token spike' : 'Cost spike';
    const comparison = `${format(value)} is ${(value / median).toFixed(1)}× the median of ${peers} other same-type siblings (${format(median)}).`;
    entry.outliers.push({ metric, ratio: value / median, heading: label, comparison,
      explanation: `${label}: ${comparison} Compared before filtering. Relative spike, not proof of inefficiency; siblings may do different work and totals may include children.` });
  });
}
export function normalizeTrace(runs: RunNode[]): TraceIndex {
  const entries = new Map<string, Entry>();
  const types = new Set<string>(), statuses = new Set<string>();
  for (const run of runs) {
    types.add(run.run_type); statuses.add(status(run));
    entries.set(run.id, { run, parent: run.parent_run_id, children: [], depth: 0, outliers: [], search: run.name.toLowerCase(),
      metrics: { tokens: run.total_tokens ?? NaN, cost: run.total_cost ?? NaN, duration: elapsed(run) } });
  }
  // Resolve each parent path once. Orphans and cycle members become roots.
  const done = new Set<string>();
  for (const id of entries.keys()) {
    if (done.has(id)) continue;
    const path = new Map<string, number>();
    let current: string | null = id;
    while (current && entries.has(current) && !done.has(current) && !path.has(current)) {
      path.set(current, path.size); current = entries.get(current)!.parent;
    }
    const cycleStart = current ? path.get(current) : undefined;
    for (const [key, position] of path) {
      const entry = entries.get(key)!;
      if (!entries.has(entry.parent ?? '') || (cycleStart !== undefined && position >= cycleStart)) entry.parent = null;
      done.add(key);
    }
  }
  const roots: string[] = [];
  for (const [id, entry] of entries) (entry.parent ? entries.get(entry.parent)!.children : roots).push(id);
  const compare = (a: string, b: string) => entries.get(a)!.run.start_time.localeCompare(entries.get(b)!.run.start_time) || a.localeCompare(b);
  roots.sort(compare); entries.forEach(entry => entry.children.sort(compare));
  const order = [...roots];
  for (let i = 0; i < order.length; i++) {
    const entry = entries.get(order[i])!;
    for (const child of entry.children) { entries.get(child)!.depth = entry.depth + 1; order.push(child); }
  }
  const groups = new Map<string, Entry[]>();
  entries.forEach(entry => {
    if (!entry.parent) return; // Roots have no sibling comparison context.
    const key = JSON.stringify([entry.run.trace_id, entry.parent, entry.run.run_type]);
    const group = groups.get(key) ?? []; group.push(entry); groups.set(key, group);
  });
  groups.forEach(group => {
    for (const metric of metrics) {
      const eligible = group.filter(entry => Number.isFinite(entry.metrics[metric]) && entry.metrics[metric] >= 0);
      detectOutliers(eligible, metric);
    }
  });
  return { entries, roots, order, types: [...types].sort(), statuses: [...statuses].sort() };
}
export function filterTrace(index: TraceIndex, query: string, type: string, state: string, focus: Set<string> | null) {
  const text = query.trim().toLowerCase();
  if (!text && !type && !state && !focus) return null;
  const matches = new Set<string>(), visible = new Set<string>();
  index.entries.forEach((entry, id) => {
    if (!entry.search.includes(text) || (type && entry.run.run_type !== type) || (state && status(entry.run) !== state) || (focus && !focus.has(id))) return;
    matches.add(id);
    let parent: string | null = id;
    while (parent && index.entries.has(parent) && !visible.has(parent)) { visible.add(parent); parent = index.entries.get(parent)!.parent; }
  });
  return { matches, visible };
}

export function subtreeIndex(index: TraceIndex, rootId: string | null): TraceIndex {
  if (!rootId || !index.entries.has(rootId)) return index;
  const order = [rootId], entries: TraceIndex['entries'] = new Map();
  for (let i = 0; i < order.length; i++) {
    const entry = index.entries.get(order[i])!;
    entries.set(order[i], entry); for (const child of entry.children) order.push(child);
  }
  return { ...index, roots: [rootId], entries, order };
}

export function setScopeCollapsed(current: Set<string>, scope: TraceIndex, collapse: boolean) {
  const next = new Set(current);
  for (const id of scope.entries.keys()) { if (collapse) next.add(id); else next.delete(id); }
  return next;
}

export function runPath(index: TraceIndex, id: string): string {
  const names: string[] = [], seen = new Set<string>();
  let current: string | null = id;
  while (current && !seen.has(current)) {
    const entry = index.entries.get(current);
    if (!entry) break;
    seen.add(current); names.push(entry.run.name); current = entry.parent;
  }
  return `${names.reverse().join(' → ')}\nRun ID: ${id}`;
}
