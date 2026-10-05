import { Profiler, useEffect, useMemo, useRef, useState } from 'react';
import App from '../App';
import { generateTrace } from './fixtures';

const fresh = () => ({ commits: 0, renderMs: 0, maxRenderMs: 0, lastRenderMs: 0, baseMs: 0, longTasks: 0, maxTaskMs: 0 });
export default function PerformanceHarness() {
  const size = Number(new URLSearchParams(location.search).get('fixture'));
  const runs = useMemo(() => generateTrace([1000, 10000, 50000].includes(size) ? size : 1000), [size]);
  const content = useMemo(() => ({ id: 'synthetic-payload', inputs: { messages: [{ role: 'user', content: 'Inspect this trace' }] },
    outputs: { documents: Array.from({ length: 50000 }, (_, i) => ({ id: i, content: 'Synthetic payload '.repeat(100) })) } }), []);
  const app = useMemo(() => <App fixture={runs} fixtureContent={content}/>, [runs, content]);
  const stats = useRef(fresh());
  const [report, setReport] = useState('');
  useEffect(() => {
    const observer = new PerformanceObserver(list => list.getEntries().forEach(entry => {
      stats.current.longTasks++;
      stats.current.maxTaskMs = Math.max(stats.current.maxTaskMs, entry.duration);
    }));
    if (PerformanceObserver.supportedEntryTypes.includes('longtask')) observer.observe({ type: 'longtask' });
    const timer = setInterval(() => setReport(JSON.stringify({ ...stats.current,
      cards: document.querySelectorAll('.run-select').length,
      elements: document.querySelectorAll('#root *').length,
    })), 500);
    return () => { observer.disconnect(); clearInterval(timer); };
  }, []);
  return <><Profiler id="viewer" onRender={(_id, _phase, actual, base) => {
    if (actual < 0.01) return;
    const s = stats.current; s.commits++; s.renderMs += actual;
    s.lastRenderMs = actual; s.baseMs = base; s.maxRenderMs = Math.max(s.maxRenderMs, actual);
  }}>{app}</Profiler><aside style={{ position: 'fixed', bottom: 0, left: 0, zIndex: 10, background: '#fff', fontSize: 10, maxWidth: '100%' }}>
    <button onClick={() => { stats.current = fresh(); }}>Reset measurements</button>
    <output aria-label="Performance measurements">{report}</output>
  </aside></>;
}
