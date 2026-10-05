import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, GitBranch } from 'lucide-react';
import RunDetailsPanel from './components/RunDetailsPanel';
import TraceTree from './components/TraceTree';
import { RunContent, RunNode } from './types';
import { normalizeTrace, cost, duration, tokens } from './lib/trace';

export default function App({ fixture, fixtureContent }: { fixture?: RunNode[]; fixtureContent?: RunContent }) {
  const [nodes, setNodes] = useState<RunNode[]>([]);
  const [selected, setSelected] = useState<RunNode | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [phase, setPhase] = useState('loading');
  const [refresh, setRefresh] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    if (fixture) { setNodes(fixture); setSelected(fixture.find(n => !n.parent_run_id) ?? null); setPhase('ready'); return; }
    setPhase('loading');
    fetch('/api/traces', { signal: controller.signal }).then(async response => {
      if (!response.ok) throw new Error('Failed to load trace');
      const data: RunNode[] = await response.json();
      if (!Array.isArray(data)) throw new Error('Invalid trace');
      if (!controller.signal.aborted) {
        setNodes(data);
        setSelected(previous => data.find(n => n.id === previous?.id) || null);
        setPhase('ready');
      }
    }).catch(() => { if (!controller.signal.aborted) setPhase('error'); });
    return () => controller.abort();
  }, [refresh, fixture]);
  const index = useMemo(() => normalizeTrace(nodes), [nodes]);
  const root = index.entries.get(index.roots[0])?.run;
  const active = selected ?? root ?? null;
  const selectRun = useCallback((node: RunNode) => { setSelected(node); setShowDetails(true); }, []);
  return <div className="app-shell">
    <header className="app-header"><a className="brand" href="/" aria-label="Trace viewer home"><span className="brand-icon"><Activity size={20}/></span>LangSmith<span className="brand-divider"/> <span className="workspace-name">Trace explorer</span></a><span className="environment"><span/> Local workspace</span></header>
    <main>
      {root && <div className="trace-summary"><div className="trace-title"><span className="summary-icon"><GitBranch size={19}/></span><div><strong>{root.name}</strong><span>{root.start_time.slice(0, 10)} <i>·</i> {nodes.length} runs</span></div></div><div className="summary-stats"><div><span>ROOT DURATION</span><strong>{duration(root)}</strong></div><div><span>ROOT TOKENS</span><strong>{tokens(root.total_tokens)}</strong></div><div><span>ROOT COST</span><strong>{cost(root.total_cost)}</strong></div></div><button className="button" aria-expanded={showDetails} aria-controls={showDetails ? "run-details" : undefined} onClick={() => setShowDetails(v => !v)}>{showDetails ? 'Hide details' : 'Show details'}</button></div>}
      {phase === 'loading' ? <div className="workspace empty" role="status"><span className="spinner"/> Loading execution trace…</div> : phase === 'error' ? <div className="workspace empty" role="alert"><h2>Could not load the trace</h2><p>Check that the API server is running on port 3001.</p><button className="button" onClick={() => setRefresh(r => r + 1)}>Try again</button></div> : !nodes.length ? <div className="workspace empty">No runs found.</div> : <div className={`workspace ${showDetails ? '' : 'tree-only'}`}><TraceTree index={index} selectedNodeId={active?.id} onNodeSelect={selectRun}/>{showDetails && <RunDetailsPanel key={active?.id} selectedNode={active} fixtureContent={fixtureContent}/>}</div>}
      <div className="page-footer"><span><span className="live-dot"/> {phase === 'ready' ? 'Local trace data loaded' : phase === 'error' ? 'API unavailable' : 'Connecting to local API'}</span><span>Built for the details.</span></div>
    </main>
  </div>;
}
