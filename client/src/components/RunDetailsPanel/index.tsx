import { memo, useEffect, useMemo, useState } from 'react';
import { AlertCircle, ArrowDownLeft, ArrowUpRight, Copy, Check, FileJson } from 'lucide-react';
import { previewPayload } from '../../lib/payload';
import { RunContent, RunNode } from '../../types';
import { cost, duration, tokens, runPath, TraceIndex } from '../../lib/trace';
import RunStatus from '../RunStatus';
import { RunTypeIcon } from '../TraceTree/RunTypeIcon';

const record = (value: unknown): Record<string, unknown> => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
function Value({ value }: { value: unknown }) {
  if (typeof value === 'string') return <p className="prose-value">{value || '(empty)'}</p>;
  if (Array.isArray(value)) return <div className="value-list">{value.length ? value.map((v, i) => <Value key={i} value={v} />) : <span className="muted">Empty list</span>}</div>;
  const obj = record(value);
  const message = Object.keys(record(obj.kwargs)).length ? record(obj.kwargs) : obj;
  if ('content' in message) return <article className="message">
    <div className="message-role">{String(message.role || message.type || 'message')}</div>
    <Value value={message.content} />{Object.entries(message).filter(([key, v]) => ['tool_calls', 'additional_kwargs'].includes(key) && JSON.stringify(v) !== '[]' && JSON.stringify(v) !== '{}').map(([key, v]) => <div key={key}>
      <h4>{key}</h4>
      <pre>{JSON.stringify(v, null, 2)}</pre>
    </div>)}</article>;
  if (Object.keys(obj).length) return <div className="object-fields">{Object.entries(obj).map(([key, v]) => <div key={key}>
    <h4>{key.replace(/_/g, ' ')}</h4>
    <Value value={v} />
  </div>)}</div>;
  return <pre>{JSON.stringify(value, null, 2) ?? 'No value'}</pre>;
}
const Payload = memo(function Payload({ title, value, raw }: { title: string; value: unknown; raw: boolean }) {
  const [limit, setLimit] = useState(200);
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => {
    if (!copyStatus) return;
    const timer = setTimeout(() => setCopyStatus(''), 2500); return () => clearTimeout(timer);
  }, [copyStatus]);
  const preview = useMemo(() => previewPayload(value, limit), [value, limit]);
  const json = useMemo(() => raw ? JSON.stringify(preview.value, null, 2) : '', [raw, preview]);
  return <section className="payload">
    <h3>{title === 'Inputs' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />} {title}{value !== undefined && <button className="copy-json" aria-label={`Copy ${title.toLowerCase()} JSON`} title="Copy full JSON, including content outside the preview" onClick={async () => {
      try { await navigator.clipboard.writeText(JSON.stringify(value, null, 2)); setCopyStatus('Copied'); } catch { setCopyStatus('Copy failed'); }
    }}>{copyStatus === 'Copied' ? <Check size={13} /> : <Copy size={13} />} Copy JSON</button>}</h3>
    <span role="status" className="muted">{copyStatus}</span>
    {preview.truncated && <p className="muted">Partial preview. Expand to inspect more content.</p>}
    {raw ? <pre tabIndex={0} aria-label={`${title} JSON`}>{json}</pre> : <Value value={preview.value} />}
    {preview.truncated && <button className="button" onClick={() => setLimit(n => n * 2)}>Show more {title.toLowerCase()}</button>}
  </section>;
});
export default function RunDetailsPanel({ selectedNode: node, index, fixtureContent, raw, onRawChange }: { selectedNode: RunNode | null; index: TraceIndex; fixtureContent?: RunContent; raw: boolean; onRawChange: (raw: boolean) => void }) {
  const [content, setContent] = useState<RunContent | null>(null);
  const [phase, setPhase] = useState('loading');
  const [retry, setRetry] = useState(0);
  const [copied, setCopied] = useState('');
  const [pathStatus, setPathStatus] = useState('');
  useEffect(() => {
    if (!pathStatus) return;
    const timer = setTimeout(() => setPathStatus(''), 2500); return () => clearTimeout(timer);
  }, [pathStatus]);
  useEffect(() => {
    if (!node) return;
    if (fixtureContent) { setContent(fixtureContent); setPhase('ready'); return; }
    const controller = new AbortController();
    setContent(null); setPhase('loading');
    fetch(`/api/traces/${encodeURIComponent(node.id)}`, { signal: controller.signal }).then(async response => {
      if (response.status === 404) { if (!controller.signal.aborted) setPhase('missing'); return; }
      if (!response.ok) throw new Error('Request failed');
      const data: RunContent = await response.json();
      if (!controller.signal.aborted) { setContent(data); setPhase('ready'); }
    }).catch(() => { if (!controller.signal.aborted) setPhase('error'); });
    return () => controller.abort();
  }, [node, retry, fixtureContent]);
  if (!node) return <section className="details-panel empty">Select a run to inspect its inputs and outputs.</section>;
  return <section id="run-details" className="details-panel" aria-label="Run details">
    <span className="sr-only" role="status">Selected run: {node.name}. {phase === 'ready' ? 'Details loaded.' : phase === 'missing' ? 'No recorded content.' : ''}</span>
    <div className="detail-heading">
      <span className="eyebrow">RUN DETAILS</span>
      <div className="detail-name">
        <RunTypeIcon type={node.run_type} />
        <h2>{node.name}</h2>
        <RunStatus run={node} badge />
      </div>
      <div className="path-action">
        <button className="text-button" title="Copy full root-to-run path and run ID" onClick={async () => {
          try { await navigator.clipboard.writeText(runPath(index, node.id)); setPathStatus('Copied'); } catch { setPathStatus('Copy failed'); }
        }}>{pathStatus === 'Copied' ? <Check size={13} /> : <Copy size={13} />} Copy path</button>
        <span role="status">{pathStatus}</span>
      </div>
      <div className="run-id">
        <code>{node.id}</code>
        <button aria-label="Copy run ID" title={copied || 'Copy run ID'} onClick={async () => { try { await navigator.clipboard.writeText(node.id); setCopied('Copied'); } catch { setCopied('Copy failed'); } }}>{copied === 'Copied' ? <Check size={13} /> : <Copy size={13} />}</button>
        <span role="status">{copied}</span>
      </div>
      <div className="metrics">
        <div>
          <span>Duration</span>
          <strong>{duration(node)}</strong>
        </div>
        <div>
          <span>Total tokens</span>
          <strong>{tokens(node.total_tokens)}</strong>
        </div>
        <div>
          <span>Total cost</span>
          <strong>{cost(node.total_cost)}</strong>
        </div>
        <div>
          <span>Run type</span>
          <strong className="capitalize">{node.run_type}</strong>
        </div>
      </div>
    </div>
    <div className="detail-toolbar">
      <span>
        <FileJson size={15} /> Inputs & outputs</span>
      <div className="segmented" role="group" aria-label="Payload display format">
        <button className={!raw ? 'active' : ''} aria-pressed={!raw} onClick={() => onRawChange(false)}>Formatted</button>
        <button className={raw ? 'active' : ''} aria-pressed={raw} onClick={() => onRawChange(true)}>JSON</button>
      </div>
    </div>
    <div className="detail-scroll" tabIndex={0} role="region" aria-label="Run inputs and outputs" aria-busy={phase === 'loading'}>{node.error && <div className="error-box" role="alert">
      <strong>
        <AlertCircle size={16} /> Run failed</strong>
      <pre>{node.error.slice(0, 8000)}</pre>
    </div>}
      {phase === 'loading' && <div className="empty" role="status">
        <span className="spinner" /> Loading run content…</div>}
      {phase === 'missing' && <div className="empty">
        <FileJson size={28} />
        <h3>No recorded content</h3>
        <p>This fixture includes metadata for this run, but no detailed payload.</p>
      </div>}
      {phase === 'error' && <div className="empty" role="alert">Could not load run content.<button className="button" onClick={() => setRetry(r => r + 1)}>Try again</button>
      </div>}
      {phase === 'ready' && content && <>
        <Payload key={`${content.id}:inputs`} title="Inputs" value={content.inputs} raw={raw} />
        <Payload key={`${content.id}:outputs`} title="Outputs" value={content.outputs} raw={raw} /></>}
    </div>
    <footer>Started {node.start_time.replace('T', ' ')}<span>{node.end_time ? 'Completed' : 'In progress'}</span>
    </footer>
  </section>;
}
