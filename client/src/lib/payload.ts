// Bound work before stringify or React recursion; never stringify the original just to size it.
export function previewPayload(value: unknown, limit = 200) {
  let remaining = limit, characters = limit * 60, truncated = false;
  const stop = () => { truncated = true; return '… preview limit'; };
  const visit = (item: unknown, depth: number): unknown => {
    if (--remaining < 0 || characters <= 0 || depth > 6 + Math.log2(limit / 200)) return stop();
    if (typeof item === 'string') {
      const shown = item.slice(0, Math.min(characters, limit * 10)); characters -= shown.length;
      return shown.length < item.length ? `${shown}${stop()}` : shown;
    }
    if (!item || typeof item !== 'object') return item;
    if (Array.isArray(item)) {
      const result: unknown[] = [];
      for (let i = 0; i < item.length; i++) {
        if (i >= limit / 8 || remaining <= 0 || characters <= 0) { result.push(`${item.length - i} more items · ${stop()}`); break; }
        result.push(visit(item[i], depth + 1));
      }
      return result;
    }
    const result: Record<string, unknown> = {};
    let count = 0;
    for (const key in item) {
      if (!Object.prototype.hasOwnProperty.call(item, key)) continue;
      if (++count > limit / 8 || remaining <= 0 || characters <= 0) { result['…'] = stop(); break; }
      const shownKey = key.slice(0, Math.min(characters, 200)); characters -= shownKey.length;
      if (shownKey !== key) truncated = true;
      Object.defineProperty(result, shownKey, { value: visit((item as Record<string, unknown>)[key], depth + 1), enumerable: true, configurable: true, writable: true });
    }
    return result;
  };
  return { value: visit(value, 0), truncated };
}
