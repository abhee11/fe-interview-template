import { TraceIndex } from './trace';

export const CARD_WIDTH = 220, CARD_HEIGHT = 156, LEVEL_HEIGHT = 216, CELL_WIDTH = 244;
export interface Placed { id: string; x: number; y: number; width: number; open: boolean; children: Placed[] }
export interface Layout { rows?: Placed[]; levels: Placed[][]; byId: Map<string, Placed>; width: number; height: number; count: number }
export function layoutTree(index: TraceIndex, collapsed: Set<string>, visible?: Set<string>, mode: 'tree' | 'list' = 'tree'): Layout {
  const roots: Placed[] = [], items: Placed[] = [];
  const stack = index.roots.slice().reverse().map(id => ({ id, depth: 0, siblings: roots }));
  while (stack.length) {
    const { id, depth, siblings } = stack.pop()!;
    if (visible && !visible.has(id)) continue;
    const item: Placed = { id, x: 0, y: depth * LEVEL_HEIGHT, width: CELL_WIDTH, open: !!visible || !collapsed.has(id), children: [] };
    siblings.push(item); items.push(item);
    if (item.open) {
      const children = index.entries.get(id)!.children;
      for (let i = children.length - 1; i >= 0; i--) stack.push({ id: children[i], depth: depth + 1, siblings: item.children });
    }
  }
  if (mode === 'list') {
    let width = 640;
    items.forEach((item, i) => { item.x = item.y / LEVEL_HEIGHT * 20; item.y = i * 64; width = Math.max(width, item.x + 640); });
    return { rows: items, levels: [], byId: new Map(items.map(item => [item.id, item])), width, height: Math.max(64, items.length * 64), count: items.length };
  }
  for (let i = items.length - 1; i >= 0; i--) {
    if (items[i].children.length) items[i].width = items[i].children.reduce((sum, child) => sum + child.width, 0);
  }
  const place = (siblings: Placed[], left: number) => {
    for (const child of siblings) { child.x = left + (child.width - CARD_WIDTH) / 2; left += child.width; }
  };
  place(roots, 0);
  const levels: Placed[][] = [], byId = new Map<string, Placed>();
  for (const item of items) {
    place(item.children, item.x - (item.width - CARD_WIDTH) / 2);
    (levels[item.y / LEVEL_HEIGHT] ??= []).push(item); byId.set(item.id, item);
  }
  return { levels, byId, width: Math.max(CELL_WIDTH, roots.reduce((sum, root) => sum + root.width, 0)), height: Math.max(CARD_HEIGHT, levels.length * LEVEL_HEIGHT), count: items.length };
}
// Each level is sorted by x. Binary search avoids scanning 50k items on scroll.
export function viewportItems(layout: Layout, left: number, top: number, width: number, height: number, padding = 240, branches = false) {
  if (layout.rows) return branches ? [] : layout.rows.slice(Math.max(0, Math.floor((top - padding) / 64)), Math.ceil((top + height + padding) / 64));
  const result: Placed[] = [];
  const first = Math.max(0, Math.floor((top - padding) / LEVEL_HEIGHT));
  const last = Math.min(layout.levels.length - 1, Math.floor((top + height + padding) / LEVEL_HEIGHT));
  for (let level = first; level <= last; level++) {
    const items = layout.levels[level];
    let low = 0, high = items.length;
    while (low < high) { const mid = (low + high) >>> 1; if ((branches ? items[mid].x + (items[mid].width + CARD_WIDTH) / 2 : items[mid].x + CARD_WIDTH) < left - padding) low = mid + 1; else high = mid; }
    for (let i = low; i < items.length && (branches ? items[i].x - (items[i].width - CARD_WIDTH) / 2 : items[i].x) <= left + width + padding; i++) result.push(items[i]);
  }
  return result;
}
