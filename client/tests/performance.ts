import { performance } from 'node:perf_hooks';
import { generateTrace } from '../src/dev/fixtures';
import { normalizeTrace, filterTrace } from '../src/lib/trace';
import { layoutTree, viewportItems } from '../src/lib/layout';
import { previewPayload } from '../src/lib/payload';

function median(work: () => unknown) {
  work();
  const samples = Array.from({ length: 7 }, () => { const start = performance.now(); work(); return performance.now() - start; });
  return +samples.sort((a, b) => a - b)[3].toFixed(2);
}
for (const size of [1000, 10000, 50000]) {
  const runs = generateTrace(size), index = normalizeTrace(runs);
  const collapsed = new Set(index.order.filter(id => index.entries.get(id)!.parent));
  const full = layoutTree(index, new Set());
  console.log(JSON.stringify({ size,
    normalizeAllMetricsMs: median(() => normalizeTrace(runs)),
    collapsedLayoutMs: median(() => layoutTree(index, collapsed)),
    expandedLayoutMs: median(() => layoutTree(index, new Set())),
    searchMs: median(() => filterTrace(index, 'llm run 997', '', '', null)),
    viewportMs: median(() => viewportItems(full, full.width / 2, full.height - 800, 1280, 800)),
    viewportCards: viewportItems(full, full.width / 2, full.height - 800, 1280, 800).length,
  }));
}
const payload = { docs: Array.from({ length: 50000 }, () => ({ content: 'x'.repeat(2000) })) };
console.log({ payloadPreviewMs: median(() => previewPayload(payload)) });
