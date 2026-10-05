import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Search, UnfoldVertical, FoldVertical } from 'lucide-react';
import { RunNode } from '../../types';
import { OutlierMetric, OutlierThreshold, matchesOutlier, filterTrace, subtreeIndex, setScopeCollapsed, TraceIndex } from '../../lib/trace';
import { layoutTree } from '../../lib/layout';
import Canvas from './Canvas';

interface Props { index: TraceIndex; onNodeSelect: (node: RunNode) => void; selectedNodeId?: string }
export default memo(function TraceTree({ index, onNodeSelect, selectedNodeId }: Props) {
  const [collapsed, setCollapsed] = useState(() => new Set(index.order.filter(id => index.entries.get(id)!.parent)));
  const [mode, setMode] = useState<'tree' | 'list'>('list');
  const [zoom, setZoom] = useState(1);
  const [query, setQuery] = useState(''), [debounced, setDebounced] = useState('');
  const [focusRequest, setFocusRequest] = useState<{ id: string } | null>(null);
  const [type, setType] = useState(''), [state, setState] = useState('');
  const [analysis, setAnalysis] = useState(false);
  const [metric, setMetric] = useState<OutlierMetric | 'all'>('all');
  const [threshold, setThreshold] = useState<OutlierThreshold>(3);
  const [subtree, setSubtree] = useState<string | null>(null);
  const scoped = useMemo(() => subtreeIndex(index, subtree), [index, subtree]);
  useEffect(() => { const timer = setTimeout(() => setDebounced(query), 200); return () => clearTimeout(timer); }, [query]);
  const highlights = useMemo(() => new Set(index.order.filter(id => index.entries.get(id)!.outliers.some(outlier => matchesOutlier(outlier, metric, threshold)))), [index, metric, threshold]);
  const focusSet = analysis ? highlights : null;
  const filtered = useMemo(() => filterTrace(scoped, debounced, type, state, focusSet), [scoped, debounced, type, state, focusSet]);
  const highlightCount = [...(filtered?.matches ?? scoped.entries.keys())].filter(id => highlights.has(id)).length;
  const filtering = !!filtered;
  const layout = useMemo(() => layoutTree(scoped, collapsed, filtered?.visible, mode), [scoped, collapsed, filtered, mode]);
  const toggle = useCallback((id: string) => setCollapsed(old => {
    const next = new Set(old); next.has(id) ? next.delete(id) : next.add(id); return next;
  }), []);
  return <section className="tree-panel" aria-label="Execution tree">
    <div className="panel-title">
      <h2>Execution tree <span className="count">{index.entries.size}</span>
      </h2>
      <div className="actions">
        <div className="segmented" role="group" aria-label="Tree layout">
          <button className={mode === 'tree' ? 'active' : ''} aria-pressed={mode === 'tree'} onClick={() => setMode('tree')}>Tree</button>
          <button className={mode === 'list' ? 'active' : ''} aria-pressed={mode === 'list'} onClick={() => { setMode('list'); setZoom(1); }}>List</button>
        </div>
        <button className="analysis-toggle" aria-pressed={analysis} onClick={() => { if (!analysis) setMetric('all'); setAnalysis(a => !a); }}>Outliers</button>
        <button title="Expand all" aria-label="Expand all" disabled={filtering} onClick={() => setCollapsed(old => setScopeCollapsed(old, scoped, false))}>
          <UnfoldVertical size={16} />
        </button>
        <button title="Collapse all" aria-label="Collapse all" disabled={filtering} onClick={() => setCollapsed(old => setScopeCollapsed(old, scoped, true))}>
          <FoldVertical size={16} />
        </button>
      </div>
    </div>
    <div className="filters">
      <label className="search">
        <Search size={16} />
        <input aria-label="Search runs by name" placeholder="Search runs…" value={query} aria-describedby="search-help" onChange={e => setQuery(e.target.value)} onKeyDown={event => {
          if (!query.trim() || event.shiftKey || event.ctrlKey || event.metaKey || event.altKey || event.nativeEvent.isComposing || !['Tab', 'ArrowDown'].includes(event.key)) return;
          const result = filterTrace(scoped, query, type, state, focusSet);
          const first = [...layoutTree(scoped, collapsed, result?.visible, mode).byId.keys()].find(id => result?.matches.has(id));
          if (first) { event.preventDefault(); setDebounced(query); setFocusRequest({ id: first }); }
        }} />
        <span id="search-help" className="sr-only">With search results, Tab or Down moves to the first match. Arrow keys navigate the tree; Tab then leaves the tree. Shift Tab moves backward through controls.</span>
        <kbd>⌕</kbd>
      </label>
      <div className="filter-row">
        <select aria-label="Run type" value={type} onChange={e => setType(e.target.value)}>
          <option value="">All run types</option>{index.types.map(t => <option key={t}>{t}</option>)}</select>
        <select aria-label="Status" value={state} onChange={e => setState(e.target.value)}>
          <option value="">All statuses</option>{index.statuses.map(s => <option key={s}>{s}</option>)}</select>{(query || type || state) && <button className="text-button" onClick={() => { setQuery(''); setDebounced(''); setType(''); setState(''); }}>Clear filters</button>}</div>
    </div>
    {analysis && <div className="analysis-controls">
      <div className="analysis-options" role="group" aria-label="Outlier metric">{(['all', 'tokens', 'duration', 'cost'] as const).map(option => <button key={option} className={`analysis-chip highlight-${option}`} aria-pressed={metric === option} onClick={() => setMetric(option)}>{option === 'all' ? 'All outliers' : option === 'duration' ? 'Duration' : option === 'tokens' ? 'Tokens' : 'Cost'}</button>)}</div>
      <span className="threshold-label">Minimum spike</span>
      <div className="segmented outlier-threshold" role="group" aria-label="Outlier threshold">{([2, 3, 4] as const).map(value => <button key={value} className={threshold === value ? 'active' : ''} aria-pressed={threshold === value} aria-label={`At least ${value} times peer median`} onClick={() => setThreshold(value)}>{value}×</button>)}</div>
      <span className="outlier-results" role="status">{highlightCount} matching {highlightCount === 1 ? 'run' : 'runs'}</span>
      <button className="text-button" onClick={() => setAnalysis(false)}>Exit outliers</button>
      <p title="Compared against the median of at least two other same-type siblings, before filtering. Relative spikes do not prove inefficiency. Hover a badge or press I on a run for details.">Showing ≥{threshold}× peer median · ancestors shown for context</p>
    </div>}
    <div className="graph-toolbar">
      <div className="actions">
        <button className="subtree-action" disabled={!subtree && !selectedNodeId} onClick={() => {
          if (subtree) { setSubtree(null); return; }
          if (!selectedNodeId) return;
          setSubtree(selectedNodeId); setCollapsed(old => { const next = new Set(old); next.delete(selectedNodeId); return next; });
        }}>{subtree ? 'Back to full trace' : 'Focus subtree'}</button>
        <span title={subtree ? index.entries.get(subtree)?.run.name : undefined}>{subtree ? `Subtree · ${scoped.entries.size} runs` : ''}</span>
      </div>
      <span>{mode === 'tree' ? '↓ Parent → child · Siblings: earlier → later' : 'Indented hierarchy · Siblings ordered by start time'}</span>
      <div className="actions">
        <button aria-label="Zoom out" disabled={zoom <= 0.35} onClick={() => setZoom(z => Math.max(0.35, z - 0.1))}>−</button>
        <button aria-label={`Reset zoom to 100 percent; current zoom ${Math.round(zoom * 100)} percent`} onClick={() => setZoom(1)}>{Math.round(zoom * 100)}%</button>
        <button aria-label="Zoom in" disabled={zoom >= 1.25} onClick={() => setZoom(z => Math.min(1.25, z + 0.1))}>+</button>
      </div>
    </div>
    <Canvas key={`${mode}:${subtree ?? "full"}`} index={scoped} layout={layout} zoom={zoom} onZoom={setZoom} selectedNodeId={selectedNodeId} metric={analysis ? metric : null} threshold={threshold}
      matches={filtered?.matches} query={debounced.trim()} focusRequest={focusRequest} onSelect={onNodeSelect} onToggle={toggle} />
    <footer>{filtering ? `${filtered?.matches.size ?? 0} matches · ancestors shown for context` : mode === 'list' ? 'Use arrows to expand or collapse branches' : 'Expand branches explicitly · Pinch or Ctrl/Cmd + scroll to zoom'}<span>{scoped.entries.size} runs</span>
    </footer>
  </section>;
});
