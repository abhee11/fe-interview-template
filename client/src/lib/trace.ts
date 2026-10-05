import { RunNode } from '../types';

export const status = (run: RunNode) => run.error ? 'error' : run.status || (run.end_time ? 'success' : 'running');
export const elapsed = (run: RunNode) => run.end_time ? Date.parse(run.end_time) - Date.parse(run.start_time) : NaN;
export const duration = (run: RunNode) => {
  const ms = elapsed(run);
  return !run.end_time ? 'Running' : !Number.isFinite(ms) ? '—' : ms < 1000 ? `${Math.max(0, ms)} ms` : `${(ms / 1000).toFixed(2)} s`;
};
export const tokens = (value?: number | null) => value == null ? '—' : value.toLocaleString();
export const cost = (value?: number | null) => value == null ? '—' : `$${value.toFixed(5)}`;
export type AnalysisMetric = 'tokens' | 'duration' | 'cost' | 'errors';
export const analysisLabels: Record<AnalysisMetric, string> = {
  tokens: 'Most tokens among peers', duration: 'Longest among peers', cost: 'Highest cost among peers', errors: 'Run error',
};
const metrics = Object.keys(analysisLabels) as AnalysisMetric[];
export type OutlierMetric = Exclude<AnalysisMetric, 'errors'>;
export interface Outlier { metric: OutlierMetric; ratio: number; explanation: string }
export interface Entry {
  run: RunNode; parent: string | null; children: string[]; depth: number; search: string;
  outliers: Outlier[]; metrics: Record<AnalysisMetric, number>; tokenMaximum?: number;
}
export interface TraceIndex {
  entries: Map<string, Entry>; roots: string[]; order: string[];
  highlights: Record<AnalysisMetric, Set<string>>; types: string[]; statuses: string[];
}
// Sort once per peer group; median excluding each candidate is then O(1).
function detectOutliers(eligible: Entry[], metric: OutlierMetric) {
  if (eligible.length < 3) return;
  const sorted = [...eligible].sort((a, b) => a.metrics[metric] - b.metrics[metric]);
  const peers = sorted.length - 1, lower = Math.floor((peers - 1) / 2), upper = Math.floor(peers / 2);
  const format = (value: number) => metric === 'duration' ? `${Number((value / 1000).toPrecision(4))} s` : `${metric === 'cost' ? '$' : ''}${value.toLocaleString(undefined, { maximumSignificantDigits: 6 })}${metric === 'tokens' ? ' tokens' : ''}`;
  sorted.forEach((entry, i) => {
    const at = (position: number) => sorted[position >= i ? position + 1 : position].metrics[metric];
    const median = (at(lower) + at(upper)) / 2, value = entry.metrics[metric];
    if (median <= 0 || value / median < 3) return;
    const label = metric === 'duration' ? 'Latency outlier' : metric === 'tokens' ? 'Token spike' : 'Cost spike';
    entry.outliers.push({ metric, ratio: value / median, explanation: `${label}: ${format(value)} is ${(value / median).toFixed(1)}× the median of ${peers} other same-type siblings (${format(median)}). Threshold: ≥3×. Compared before filtering. ${metric === 'duration' ? 'Completed elapsed time, not waiting time.' : 'Reported totals may include child runs.'} Relative outlier, not necessarily a problem.` });
  });
}
export function normalizeTrace(runs: RunNode[]): TraceIndex {
  const entries = new Map<string, Entry>();
  const types = new Set<string>(), statuses = new Set<string>();
  for (const run of runs) {
    types.add(run.run_type); statuses.add(status(run));
    entries.set(run.id, { run, parent: run.parent_run_id, children: [], depth: 0, outliers: [], search: run.name.toLowerCase(),
      metrics: { tokens: run.total_tokens ?? NaN, cost: run.total_cost ?? NaN, duration: elapsed(run), errors: ['error', 'failed'].includes(status(run)) ? 1 : 0 } });
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
  const highlights: TraceIndex['highlights'] = { tokens: new Set(), duration: new Set(), cost: new Set(), errors: new Set() };
  const groups = new Map<string, Entry[]>();
  entries.forEach(entry => {
    if (entry.metrics.errors) highlights.errors.add(entry.run.id);
    if (!entry.parent) return; // Roots have no sibling comparison context.
    const key = JSON.stringify([entry.run.trace_id, entry.parent, entry.run.run_type]);
    const group = groups.get(key) ?? []; group.push(entry); groups.set(key, group);
  });
  groups.forEach(group => {
    for (const metric of metrics.filter(metric => metric !== 'errors')) {
      const eligible = group.filter(entry => Number.isFinite(entry.metrics[metric]) && entry.metrics[metric] >= 0);
      if (eligible.length < 2) continue;
      detectOutliers(eligible, metric);
      const maximum = eligible.reduce((max, entry) => Math.max(max, entry.metrics[metric]), 0);
      for (const entry of eligible) {
        if (metric === 'tokens' && maximum > 0) entry.tokenMaximum = maximum;
        if (maximum > 0 && entry.metrics[metric] === maximum) highlights[metric].add(entry.run.id);
      }
    }
  });
  return { entries, roots, order, highlights, types: [...types].sort(), statuses: [...statuses].sort() };
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
