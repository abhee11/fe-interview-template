import assert from 'node:assert/strict';
import { test } from 'node:test';
import { runPath, matchesOutlier, normalizeTrace, subtreeIndex, setScopeCollapsed, filterTrace, cost, duration, status, tokens } from '../src/lib/trace';
import { layoutTree, viewportItems, CARD_WIDTH } from '../src/lib/layout';
import { previewPayload } from '../src/lib/payload';
import { generateTrace } from '../src/dev/fixtures';
import { traceTree } from '../../server/src/data/traceTree';
import type { RunNode } from '../src/types';
const run = (id: string, parent: string | null = null, time = '2025-01-01T00:00:00'): RunNode => ({ id, parent_run_id: parent, name: id, run_type: 'chain', start_time: time, end_time: null, error: null, trace_id: 'root', parent_run_ids: [], status: 'running' });
test('unordered children attach to parents and sort by timestamp, then ID', () => {
  const index = normalizeTrace([run('late', 'root', '2025-01-02'), run('b', 'root'), run('root'), run('a', 'root')]);
  assert.deepEqual(index.roots, ['root']);
  assert.deepEqual(index.entries.get('root')!.children, ['a', 'b', 'late']);
});
test('orphan/cycle nodes remain visible and descendants retain valid relationships', () => {
  const index = normalizeTrace([run('orphan', 'missing'), run('a', 'b'), run('b', 'a'), run('self', 'self'), run('child', 'a')]);
  assert.equal(index.roots.length, 4);
  assert.equal(index.entries.get('child')!.parent, 'a');
  assert.equal(normalizeTrace([]).roots.length, 0);
});
test('fixture appears exactly once and collapsed descendants do not enter layout', () => {
  const index = normalizeTrace(traceTree);
  const full = layoutTree(index, new Set());
  assert.equal(full.count, traceTree.length);
  assert.equal(full.byId.size, traceTree.length);
  assert.equal(layoutTree(index, new Set(index.roots)).count, index.roots.length);
  for (const level of full.levels) {
    for (let i = 1; i < level.length; i++) assert.ok(level[i].x >= level[i - 1].x + CARD_WIDTH);
  }
});
test('metrics distinguish unavailable values, zero, errors, and running runs', () => {
  assert.equal(tokens(0), '0'); assert.equal(tokens(null), '—');
  assert.equal(cost(0), '$0.00000'); assert.equal(cost(null), '—');
  assert.equal(duration(run('a')), 'Running');
  assert.equal(duration({ ...run('failed'), status: 'failed' }), '—');
  assert.equal(status({ ...run('a'), error: 'Oops', status: 'success' }), 'error');
});
test('combined filters preserve ancestors without matching siblings', () => {
  const index = normalizeTrace([run('root'), { ...run('match', 'root'), run_type: 'llm', status: 'success' }, run('other', 'root')]);
  const result = filterTrace(index, 'MATCH', 'llm', 'success', new Set(['match']))!;
  assert.deepEqual([...result.matches], ['match']);
  assert.deepEqual([...result.visible].sort(), ['match', 'root']);
  assert.equal(filterTrace(index, '', '', '', null), null);
  assert.equal(filterTrace(index, 'absent', '', '', null)!.matches.size, 0);
});
test('50k fully expanded diagram keeps viewport candidates bounded and handles offscreen parents', () => {
  const index = normalizeTrace(generateTrace(50000));
  const layout = layoutTree(index, new Set());
  assert.equal(layout.count, 50000);
  for (const left of [0, layout.width / 2, layout.width - 1200]) {
    const items = viewportItems(layout, left, 800, 1200, 800);
    assert.ok(items.length < 100);
    assert.ok(items.every(item => item.x + CARD_WIDTH >= left - 240 && item.x <= left + 1440));
  }
  assert.ok(viewportItems(layout, 0, 0, 1200, 800, 240, true).some(item => item.id === index.roots[0]));
});
test('deep traces normalize and lay out iteratively without stack overflow', () => {
  const index = normalizeTrace(Array.from({ length: 10000 }, (_, i) => run(String(i), i ? String(i - 1) : null)));
  assert.equal(layoutTree(index, new Set()).count, 10000);
});
test('large payload preview is bounded and can progressively reveal more', () => {
  const input = { documents: Array.from({ length: 50000 }, () => ({ content: 'x'.repeat(5000) })) };
  const small = previewPayload(input), bigger = previewPayload(input, 400);
  assert.ok(small.truncated);
  assert.ok(JSON.stringify(small.value).length < 15000);
  assert.ok(JSON.stringify(bigger.value).length > JSON.stringify(small.value).length);
  assert.deepEqual(previewPayload({ answer: 'hello' }), { value: { answer: 'hello' }, truncated: false });
});
test('nested list preserves preorder, indentation, collapse and viewport bounds', () => {
  const index = normalizeTrace([run('b', 'root'), run('child', 'a'), run('root'), run('a', 'root')]);
  const list = layoutTree(index, new Set(), undefined, 'list');
  assert.deepEqual(list.rows!.map(item => [item.id, item.x]), [['root', 0], ['a', 20], ['child', 40], ['b', 20]]);
  assert.deepEqual(layoutTree(index, new Set(['a']), undefined, 'list').rows!.map(item => item.id), ['root', 'a', 'b']);
  const large = layoutTree(normalizeTrace(generateTrace(50000)), new Set(), undefined, 'list');
  assert.ok(viewportItems(large, 0, 1000000, 1200, 800).length < 25);
});

test('subtree isolates descendants, rebases both layouts and preserves analysis', () => {
  const full = normalizeTrace([run('root'), { ...run('a', 'root'), total_tokens: 5 }, { ...run('b', 'root'), total_tokens: 10 }, run('child', 'a')]);
  const scoped = subtreeIndex(full, 'a');
  assert.deepEqual([...scoped.entries.keys()], ['a', 'child']);
  assert.equal(scoped.entries.get('a'), full.entries.get('a'));
  const filtered = filterTrace(scoped, 'child', '', '', null)!;
  assert.deepEqual([...filtered.visible].sort(), ['a', 'child']);
  assert.equal(filterTrace(scoped, 'b', '', '', null)!.matches.size, 0);
  assert.deepEqual(layoutTree(scoped, new Set(), undefined, 'list').rows!.map(item => item.x), [0, 20]);
  assert.equal(layoutTree(scoped, new Set()).byId.get('a')!.y, 0);
  assert.equal(layoutTree(scoped, new Set(['a'])).count, 1);
  assert.equal(subtreeIndex(full, null), full);
  assert.equal(full.entries.size, 4);
});

test('outliers compare against other same-type siblings and retain full-trace baselines', () => {
  const sample = (id: string, value: number): RunNode => ({ ...run(id, 'root'), total_tokens: value, total_cost: value, end_time: new Date(Date.parse('2025-01-01T00:00:00') + value * 1000).toISOString() });
  const index = normalizeTrace([run('root'), sample('a', 10), sample('b', 20), sample('spike', 45), { ...sample('other-type', 999), run_type: 'tool' }, run('missing', 'root')]);
  assert.deepEqual(index.entries.get('spike')!.outliers.map(o => o.metric).sort(), ['cost', 'duration', 'tokens']);
  assert.match(index.entries.get('spike')!.outliers[0].explanation, /3\.0× the median of 2 other same-type siblings/);
  for (const id of ['root', 'a', 'b', 'other-type', 'missing']) assert.equal(index.entries.get(id)!.outliers.length, 0);
  assert.equal(subtreeIndex(index, 'spike').entries.get('spike')!.outliers, index.entries.get('spike')!.outliers);
});
test('outlier medians exclude the candidate for odd/even groups; skip insufficient or zero baselines', () => {
  for (const values of [[1, 2], [0, 0, 100], [10, 20, 44], [1, 2, 3, 30], [1, 2, 3, 4, 30], [5, 5, 5], [NaN, -1, 100]]) {
    const index = normalizeTrace([run('root'), ...values.map((value, i) => ({ ...run(String(i), 'root'), total_tokens: value }))]);
    values.forEach((value, i) => {
      const peers = values.filter((v, j) => j !== i && Number.isFinite(v) && v >= 0).sort((a, b) => a - b);
      const median = (peers[Math.floor((peers.length - 1) / 2)] + peers[Math.floor(peers.length / 2)]) / 2;
      const expected = Number.isFinite(value) && value >= 0 && peers.length >= 2 && median > 0 && value / median >= 3;
      assert.equal(index.entries.get(String(i))!.outliers.some(o => matchesOutlier(o, 'tokens')), expected);
    });
  }
});

test('bulk expansion changes only the focused subtree', () => {
  const index = normalizeTrace([run('root'), run('a', 'root'), run('b', 'root'), run('child', 'a')]);
  const scoped = subtreeIndex(index, 'a'), original = new Set(['b']);
  const collapsed = setScopeCollapsed(original, scoped, true);
  assert.deepEqual([...collapsed].sort(), ['a', 'b', 'child']);
  assert.deepEqual([...setScopeCollapsed(collapsed, scoped, false)], ['b']);
  assert.deepEqual([...original], ['b']);
});
test('synthetic fixtures produce fewer matches at each threshold for every metric', () => {
  const index = normalizeTrace(generateTrace(1000));
  for (const metric of ['tokens', 'cost', 'duration'] as const) {
    const counts = ([2, 3, 4] as const).map(threshold => [...index.entries.values()].filter(entry => entry.outliers.some(outlier => matchesOutlier(outlier, metric, threshold))).length);
    assert.ok(counts[0] > counts[1] && counts[1] > counts[2] && counts[2] > 0, `${metric}: ${counts}`);
  }
});

test('threshold presets include boundaries and filter matching runs with ancestors', () => {
  for (const ratio of [1.99, 2, 2.99, 3, 3.99, 4]) {
    const index = normalizeTrace([run('root'), ...[10, 10, ratio * 10].map((value, i) => ({ ...run(String(i), 'root'), total_tokens: value, total_cost: value }))]);
    for (const threshold of [2, 3, 4] as const) {
      const ids = new Set(index.order.filter(id => index.entries.get(id)!.outliers.some(o => matchesOutlier(o, 'tokens', threshold))));
      assert.equal(ids.has('2'), ratio >= threshold);
      assert.equal(ids.size, ratio >= threshold ? 1 : 0);
      assert.deepEqual([...filterTrace(index, '', '', '', ids)!.visible].sort(), ratio >= threshold ? ['2', 'root'] : []);
      assert.equal(index.entries.get('2')!.outliers.some(o => matchesOutlier(o, 'cost', threshold)), ratio >= threshold);
      assert.equal(index.entries.get('2')!.outliers.some(o => matchesOutlier(o, 'duration', threshold)), false);
    }
  }
});

test('copy path follows full ancestry, preserving original names and a distinct run ID', () => {
  const index = normalizeTrace([run('leaf', 'child'), run('root'), { ...run('child', 'root'), name: 'same_name' }]);
  assert.equal(runPath(index, 'leaf'), 'root → same_name → leaf\nRun ID: leaf');
  assert.equal(runPath(index, 'root'), 'root\nRun ID: root');
  const repaired = normalizeTrace([run('orphan', 'missing'), run('a', 'b'), run('b', 'a')]);
  assert.equal(runPath(repaired, 'orphan'), 'orphan\nRun ID: orphan');
  assert.equal(runPath(repaired, 'a'), 'a\nRun ID: a');
});
