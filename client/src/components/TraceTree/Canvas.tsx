import { Dispatch, SetStateAction, memo, useMemo, useCallback, useLayoutEffect, useRef, useState } from 'react';
import * as Tooltip from '@radix-ui/react-tooltip';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { RunNode } from '../../types';
import { OutlierMetric, OutlierThreshold, matchesOutlier, cost, duration, tokens, TraceIndex, Outlier } from '../../lib/trace';
import { CARD_HEIGHT, CARD_WIDTH, Layout, LEVEL_HEIGHT, viewportItems } from '../../lib/layout';
import RunStatus from '../RunStatus';
import { RunTypeIcon } from './RunTypeIcon';

function OutlierBadge({ outlier, threshold, keyboardOpen, onDismiss }: { outlier: Outlier; threshold: OutlierThreshold; keyboardOpen: boolean; onDismiss: () => void }) {
  const [hovered, setHovered] = useState(false);
  return <Tooltip.Root open={hovered || keyboardOpen} onOpenChange={setHovered}>
    <Tooltip.Trigger asChild>
      <span className={`outlier-badge highlight-${outlier.metric}`}>{outlier.metric === 'duration' ? 'Latency' : outlier.metric === 'tokens' ? 'Tokens' : 'Cost'} {outlier.ratio.toFixed(1)}×</span>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content className="outlier-tooltip" side="bottom" align="center" sideOffset={6} collisionPadding={12} onEscapeKeyDown={() => { setHovered(false); onDismiss(); }}>
        <strong>{outlier.heading}</strong>
        <p>{outlier.comparison}</p>
        <small>Flagged at ≥{threshold}× peer median. Different work can explain a spike. I: next badge; Esc: close.</small>
        <Tooltip.Arrow />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>;
}

function HighlightName({ name, query }: { name: string; query: string }) {
  if (!query) return <>{name}</>;
  const parts = [], lower = name.toLowerCase(), needle = query.toLowerCase();
  let start = 0, match = lower.indexOf(needle);
  while (match !== -1) {
    parts.push(name.slice(start, match), <mark key={match}>{name.slice(match, match + query.length)}</mark>);
    start = match + query.length; match = lower.indexOf(needle, start);
  }
  return <>{parts}{name.slice(start)}</>;
}

const RunCard = memo(function RunCard({ run, selected, open, count, dimmed, filtering, navigation, tabIndex, outliers, metric, threshold, query, onSelect, onToggle }: {
  query: string; threshold: OutlierThreshold; outliers: Outlier[]; navigation: { level: number; position: number; size: number }; tabIndex: number; metric: OutlierMetric | 'all' | null; run: RunNode; selected: boolean; open: boolean; count: number; dimmed: boolean;
  filtering: boolean; onSelect: (run: RunNode) => void; onToggle: (id: string) => void;
}) {
  const [keyboardBadge, setKeyboardBadge] = useState<number | null>(null);
  const shown = useMemo(() => outliers.filter(outlier => matchesOutlier(outlier, metric, threshold)), [outliers, metric, threshold]);
  return <Tooltip.Provider delayDuration={250}>
    <div className={`tree-row ${selected ? 'selected' : ''} ${dimmed ? 'ancestor' : ''}`}>
      <button className="run-select" onPointerMove={() => setKeyboardBadge(null)} onFocus={() => setKeyboardBadge(null)} onBlur={() => setKeyboardBadge(null)} onKeyDown={event => {
        if (event.key.toLowerCase() === 'i' && !event.ctrlKey && !event.metaKey && !event.altKey && shown.length) { event.preventDefault(); event.stopPropagation(); setKeyboardBadge(i => i === null ? 0 : (i + 1) % shown.length); }
        if (event.key === 'Escape') setKeyboardBadge(null);
      }} role="treeitem" aria-keyshortcuts={shown.length ? "i" : undefined} tabIndex={tabIndex} aria-level={navigation.level} aria-posinset={navigation.position} aria-setsize={navigation.size} aria-describedby={shown.length ? `outliers-${run.id}` : undefined} aria-selected={selected} aria-expanded={count ? open : undefined} data-run-id={run.id} onClick={event => { event.currentTarget.focus({ preventScroll: true }); onSelect(run); if (count > 0 && !open && !filtering) onToggle(run.id); }}>
        <RunTypeIcon type={run.run_type} />
        <span className="run-label">
          <strong className="run-name">
            <span title={run.name}><HighlightName name={run.name} query={dimmed ? '' : query} /></span>
          </strong>
          <span>{run.run_type}</span>
          {shown.length > 0 && <span className="outlier-badges">{shown.map((outlier, i) => <OutlierBadge key={outlier.metric} outlier={outlier} threshold={threshold} keyboardOpen={keyboardBadge === i} onDismiss={() => setKeyboardBadge(null)} />)}</span>}</span>
        <span className="run-metrics">
          <span className="token-cell">
            <small>Tokens</small>{tokens(run.total_tokens)}</span>
          <span className="cost-cell">
            <small>Cost</small>{cost(run.total_cost)}</span>
        </span>
        <span className="row-time">
          <span className="duration-cell">
            <small>Duration</small>{duration(run)}</span>
          <RunStatus run={run} />
        </span>
      </button>
      {shown.length > 0 && <span id={`outliers-${run.id}`} className="sr-only">Threshold: ≥{threshold}×. {shown.map(outlier => outlier.explanation).join(" ")}</span>}
      {count > 0 && <button className="disclosure" tabIndex={-1} aria-label={`${open ? 'Collapse' : 'Expand'} ${run.name}`} aria-expanded={open} disabled={filtering} onClick={() => onToggle(run.id)}>
        {open ? <ChevronDown size={13} /> : <ChevronRight size={13} />} {count} children
      </button>}
    </div>
  </Tooltip.Provider>;
});
interface Props {
  query: string; focusRequest: { id: string } | null;
  threshold: OutlierThreshold; index: TraceIndex; layout: Layout; zoom: number; selectedNodeId?: string; metric: OutlierMetric | 'all' | null;
  onZoom: Dispatch<SetStateAction<number>>; matches?: Set<string>; onSelect: (run: RunNode) => void; onToggle: (id: string) => void;
}
export default memo(function Canvas({ index, layout, zoom, selectedNodeId, metric, threshold, matches, query, focusRequest, onSelect, onToggle, onZoom }: Props) {
  const canvas = useRef<HTMLDivElement>(null), frame = useRef(0);
  const pendingFocus = useRef<string | null>(null);
  const previous = useRef({ layout, zoom });
  const zoomAnchor = useRef<{ x: number; y: number; worldX: number; worldY: number } | null>(null);
  const [view, setView] = useState({ left: 0, top: 0, width: 800, height: 500 });
  const [focusedId, setFocusedId] = useState<string | null>(null);
  useLayoutEffect(() => {
    if (focusRequest) { pendingFocus.current = focusRequest.id; setFocusedId(focusRequest.id); }
  }, [focusRequest]);
  const measure = useCallback(() => {
    const el = canvas.current;
    if (el) setView({ left: el.scrollLeft / zoom, top: el.scrollTop / zoom, width: el.clientWidth / zoom, height: el.clientHeight / zoom });
  }, [zoom]);
  useLayoutEffect(() => {
    const el = canvas.current!;
    // Keep the diagram's horizontal center stable across expansion and zoom changes.
    const old = previous.current;
    const ratio = (el.scrollLeft + el.clientWidth / 2) / Math.max(el.clientWidth, old.layout.width * old.zoom);
    const anchor = zoomAnchor.current;
    if (anchor && !layout.rows) {
      const offset = Math.max(0, (el.clientWidth - layout.width * zoom) / 2);
      el.scrollLeft = anchor.worldX * zoom + offset - anchor.x;
      el.scrollTop = anchor.worldY * zoom - anchor.y;
      zoomAnchor.current = null;
    } else {
      el.scrollLeft = layout.rows ? 0 : Math.max(0, ratio * layout.width * zoom - el.clientWidth / 2);
      el.scrollTop = Math.min(el.scrollTop, Math.max(0, layout.height * zoom - el.clientHeight + 24));
    }
    previous.current = { layout, zoom };
    measure();
    const observer = new ResizeObserver(measure); observer.observe(el);
    return () => { observer.disconnect(); cancelAnimationFrame(frame.current); };
  }, [layout, zoom, measure]);
  useLayoutEffect(() => {
    const el = canvas.current!;
    if (layout.rows) return;
    // Native non-passive listener lets trackpad pinch override browser page zoom.
    const wheel = (event: WheelEvent) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? el.clientHeight : 1);
      const next = Math.max(0.35, Math.min(1.25, zoom * Math.exp(-Math.max(-100, Math.min(100, delta)) * 0.005)));
      if (next === zoom) { zoomAnchor.current = null; return; }
      const rect = el.getBoundingClientRect(), x = event.clientX - rect.left - el.clientLeft;
      const y = event.clientY - rect.top - el.clientTop - parseFloat(getComputedStyle(el).paddingTop);
      const offset = Math.max(0, (el.clientWidth - layout.width * zoom) / 2);
      zoomAnchor.current = { x, y, worldX: (el.scrollLeft + x - offset) / zoom, worldY: (el.scrollTop + y) / zoom };
      onZoom(next);
    };
    el.addEventListener('wheel', wheel, { passive: false });
    return () => el.removeEventListener('wheel', wheel);
  }, [layout, zoom, onZoom]);
  const offset = layout.rows ? 0 : Math.max(0, (view.width - layout.width) / 2);
  const left = view.left - offset;
  const items = viewportItems(layout, left, view.top, view.width, view.height);
  // A keyboard-focused card remains mounted even if scrolled beyond overscan.
  const focused = layout.byId.get(focusedId ?? selectedNodeId ?? index.roots[0]);
  if (focused && !items.includes(focused)) items.push(focused);
  const navigation = useMemo(() => {
    const ids = [...layout.byId.keys()], groups = new Map<string, string[]>();
    for (const id of ids) {
      const parent = index.entries.get(id)!.parent ?? '';
      const group = groups.get(parent) ?? []; group.push(id); groups.set(parent, group);
    }
    const metadata = new Map<string, { level: number; position: number; size: number }>();
    groups.forEach(group => group.forEach((id, i) => metadata.set(id, { level: index.entries.get(id)!.depth - index.entries.get(index.roots[0])!.depth + 1, position: i + 1, size: group.length })));
    return { ids, metadata, positions: new Map(ids.map((id, i) => [id, i])) };
  }, [layout, index]);
  const activeId = focusedId && layout.byId.has(focusedId) ? focusedId : selectedNodeId && layout.byId.has(selectedNodeId) ? selectedNodeId : navigation.ids[0];
  const activeItem = layout.byId.get(activeId);
  if (activeItem && !items.includes(activeItem)) items.push(activeItem);
  items.sort((a, b) => navigation.positions.get(a.id)! - navigation.positions.get(b.id)!);
  useLayoutEffect(() => {
    if (!pendingFocus.current) return;
    const target = [...canvas.current!.querySelectorAll<HTMLElement>('[role="treeitem"]')].find(el => el.dataset.runId === pendingFocus.current);
    if (target) { target.focus({ preventScroll: true }); target.scrollIntoView({ block: 'nearest', inline: 'nearest' }); pendingFocus.current = null; }
  }, [focusedId, layout, focusRequest]);
  const branches = viewportItems(layout, left, view.top, view.width, view.height, 240, true);
  return <div className={`tree-scroll ${layout.rows ? 'nested-list' : ''}`} ref={canvas} aria-label={layout.rows ? 'Scrollable nested list' : 'Scrollable tree diagram'}
    onKeyDown={event => {
      const source = (event.target as HTMLElement).closest<HTMLElement>('[role="treeitem"]');
      const id = source?.dataset.runId, item = id && layout.byId.get(id);
      if (!id || !item || event.altKey || event.ctrlKey || event.metaKey) return;
      const position = navigation.positions.get(id)!;
      let next: string | undefined;
      switch (event.key) {
        case 'ArrowDown': next = navigation.ids[position + 1]; break;
        case 'ArrowUp': next = navigation.ids[position - 1]; break;
        case 'Home': next = navigation.ids[0]; break;
        case 'End': next = navigation.ids[navigation.ids.length - 1]; break;
        case 'ArrowRight': if (!item.open && !matches && index.entries.get(id)!.children.length) onToggle(id); else next = item.children[0]?.id; break;
        case 'ArrowLeft': if (item.open && item.children.length && !matches) onToggle(id); else next = index.entries.get(id)!.parent ?? undefined; break;
        default: return;
      }
      event.preventDefault();
      if (next && layout.byId.has(next)) { pendingFocus.current = next; setFocusedId(next); }
    }}
    onScroll={() => {
      cancelAnimationFrame(frame.current); frame.current = requestAnimationFrame(measure);
    }}>
    <span id="tree-keyboard-help" className="sr-only">Up and Down navigate runs. Right expands or moves to a child. Left collapses or moves to the parent. Home and End jump to the first or last visible run. Enter or Space selects, opens details and expands. I cycles through outlier explanations; Escape closes them. Tab leaves the tree.</span>
    <div className="tree-stage" role="tree" aria-label="Execution runs" aria-describedby="tree-keyboard-help" style={{ width: Math.max(layout.width * zoom, view.width * zoom), height: layout.height * zoom }}>
      {!layout.rows && <svg className="tree-connectors" aria-hidden="true" width={view.width * zoom} height={view.height * zoom}
        style={{ left: view.left * zoom, top: view.top * zoom }} viewBox={`${left} ${view.top} ${view.width} ${view.height}`}>
        {branches.filter(item => item.children.length).map(item => {
          const x = item.x + CARD_WIDTH / 2, y = item.y + CARD_HEIGHT, mid = item.y + LEVEL_HEIGHT - 30;
          return <path key={item.id} d={`M${x},${y}V${mid} M${item.children[0].x + CARD_WIDTH / 2},${mid}H${item.children[item.children.length - 1].x + CARD_WIDTH / 2}`} />;
        })}
        {items.filter(item => layout.byId.has(index.entries.get(item.id)!.parent ?? '')).map(item => <path key={item.id} d={`M${item.x + CARD_WIDTH / 2},${item.y - 30}V${item.y}`} />)}
      </svg>}
      {items.map(item => <div role="none" key={item.id} className="placed-run" data-run-id={item.id}
        style={{ width: layout.rows ? Math.max(layout.width, view.width) - item.x : CARD_WIDTH, height: layout.rows ? 60 : CARD_HEIGHT, left: (item.x + offset) * zoom, top: item.y * zoom, transform: `scale(${zoom})` }}
        onFocusCapture={() => setFocusedId(item.id)}>
        <RunCard outliers={index.entries.get(item.id)!.outliers} metric={metric} threshold={threshold} query={query} navigation={navigation.metadata.get(item.id)!} tabIndex={item.id === activeId ? 0 : -1} run={index.entries.get(item.id)!.run} selected={selectedNodeId === item.id} open={item.open}
          count={index.entries.get(item.id)!.children.length}
          dimmed={!!matches && !matches.has(item.id)} filtering={!!matches} onSelect={onSelect} onToggle={onToggle} />
      </div>)}
    </div>
    {layout.count === 0 && <div className="empty">No matching runs.<br />Try another name or clear the filters.</div>}
  </div>;
});
