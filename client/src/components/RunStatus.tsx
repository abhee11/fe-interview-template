import { RunNode } from '../types';
import { status } from '../lib/trace';

export default function RunStatus({ run, badge = false }: { run: RunNode; badge?: boolean }) {
  const value = status(run);
  const label = value === 'error' || value === 'failed' ? 'Failed' : value;
  return <span className={`run-status status-text ${value}${badge ? ' badge' : ''}`}>
    <span className="status-dot" aria-hidden="true"/>{label}
  </span>;
}
