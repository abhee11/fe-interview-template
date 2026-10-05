# Trace viewer performance and scalability

> Historical benchmark note: the measurements below were captured during the initial scalability pass, before later outlier, tooltip, and keyboard-navigation additions. Re-run benchmarks for final performance claims. The current UI uses selectable 2×/3×/4× peer-median outlier detection (default 3×), not depth maxima. Keyboard navigation now uses ARIA tree semantics; card navigation metadata and original outlier arrays now retain stable references between viewport renders.

## What the inspection found

- `App` rebuilt the complete tree on every selection; the tree component built it separately.
- Search, ancestor marking, and filter option discovery scanned the complete input during ordinary renders, including each keystroke.
- Each analysis mode independently traversed and regrouped the tree; timestamps were reparsed repeatedly.
- Collapsed descendants already stayed out of the DOM, but expand-all mounted every logically visible card and connector. Nested CSS layout became the dominant interactive bottleneck.
- Every tree card rerendered on selection. Formatted payloads recursively rendered every object; raw mode stringified the entire response.
- Fetch cancellation existed. The missing-payload response needed the same cancellation guard as successful responses.

## Performance architecture (concise section for the submission)

Normalize each trace response once into ID lookups, ordered child IDs, roots, depth, normalized names, and same-type sibling outliers. Cycle detection and depth assignment are iterative; sorting preserves start-time order. Normal navigation skips filtered-set construction entirely. Search is debounced by 200 ms, combines name/type/status/focus filters, and retains matching runs' ancestor paths. Cancelling the previous timer prevents stale search work.

Compute a flat coordinate layout from only the expanded hierarchy, while keeping the existing top-down diagram. Collapsed descendants are never visited by layout. The canvas uses sorted depth bands and binary search to mount only cards and connector segments intersecting the viewport plus 240 logical pixels of overscan. Scroll updates are coalesced with animation frames. Native buttons remain accessible; a focused card stays mounted outside overscan. Memoized cards receive stable run objects, callbacks, and primitive presentation flags, so unrelated cards can skip selection renders. Scrolling updates the canvas without rerendering filters or rebuilding the model.

All three outlier metrics are computed during normalization; changing the metric builds a memoized ID set from cached outliers. Search and analysis focus reuse that index, and full-trace comparisons remain independent of filters. Large payloads use bounded, explicitly labeled previews before React recursion or JSON formatting, with progressive disclosure. Existing abortable detail requests prevent stale data from replacing the current selection.

## Reproduce the measurements

```sh
npm run test --prefix client
npm run bench --prefix client
npm run lint --prefix client
npm run build --prefix client
```

Start the supplied API and Vite servers as described in README. Open `http://127.0.0.1:3000/?fixture=1000` (or 10000 / 50000). The Vite-only harness supplies deterministic, reverse-ordered four-way trees with mixed run types, errors, running runs, and realistic depth (up to nine levels at 50k). It also supplies a decoded detail object with 50,000 documents to exercise preview rendering. Neither the supplied endpoints nor their data contract is modified. The harness is dynamically imported only under `import.meta.env.DEV`; the production bundle contains no fixture generator or profiling panel.

The harness shows React render durations, DOM counts, and observed browser long tasks. Reset its measurements before an interaction, then read the panel after it refreshes (500 ms). The Node benchmark warms each function once and reports the median of seven samples. Zero there means below the two-decimal reporting precision, not free work.

## Observations on this machine

Baseline: expanding 1,000 runs mounted 1,000 cards / 16,597 elements, took approximately 87 ms of React rendering, and produced a 155 ms long task. Expanding 10,000 runs caused browser inspection to time out; no reliable completion measurement was recovered. A full 50k baseline expansion was deliberately not attempted after that failure. Baseline data preparation alone was much cheaper than its DOM rendering (a separate single-pass Node sample: 43 ms for tree construction plus 26 ms for all four analyses at 50k).

Historical browser smoke profile (before later UI features), Chromium in-app browser, 1280 × 800, Vite development build with React Strict Mode, no CPU throttling. Values below are the largest React render duration observed for each operation, not end-to-end latency or production guarantees. Timings vary with JIT/GC; these are a recorded run, not statistical percentiles. Search additionally has its intentional 200 ms delay. Initial loading includes development fixture preparation and Strict Mode work.

| Operation | 1,000 runs | 10,000 runs | 50,000 runs |
| --- | ---: | ---: | ---: |
| Initial render, ms | 7.5 | 25.9 | 109.1 |
| Expand all, ms | 2.6 | 6.1 | 20.2 |
| Scroll to bottom, ms | 1.7 | 1.5 | 1.3 |
| Search `llm run 997`, ms | 2.4 | 2.6 | 3.6 |
| Select run + large payload, ms | 2.4 | 2.0 | 2.2 |
| Enable analysis / switch to duration, ms | 1.4 | 1.6 | 0.8 |
| Collapse all, ms | 0.7 | 0.5 | 0.7 |
| Mounted cards after scrolling | 11 | 12 | 11 |
| Total elements after scrolling | 270 | 287 | 276 |

No long tasks were observed in those interaction windows after loading. The 50k initial load still produced a 113 ms long task. Collapsing returned all three fixtures to one mounted root card. Enabling details and analysis kept the 50k fixture below 420 elements in these samples. JSON selection initially exposed about 12.7k characters, increasing to about 25k after one explicit Show more action, instead of formatting the 50,000-document object at once.

Historical warmed Node medians (ms):

| Operation | 1k | 10k | 50k |
| --- | ---: | ---: | ---: |
| Normalize + all analysis metrics | 1.40 | 7.81 | 50.95 |
| Fully expanded coordinate layout | 0.87 | 1.07 | 9.82 |
| Search + ancestor closure | 0.03 | 0.21 | 0.64 |
| Collapsed layout / viewport lookup | <0.01 | <0.01 | <0.01 |

## Deliberate trade-offs and remaining limits

- No Web Worker: the measured interactive bottleneck was DOM rendering. Virtualization fixed it; mode switches and searches are inexpensive. A worker could help the remaining one-time normalization cost (about 152 ms in the latest 50k Node sample), but introduces transfer, synchronization, and cancellation complexity. Reconsider if 50k initial-load responsiveness or frequent streamed reindexing becomes a product requirement. This is not a claim that initial loading is nonblocking.
- No heavy graph/virtualization dependency, deep prop comparisons, global state library, payload syntax highlighter, or speculative request cache.
- No incremental layout engine: expand/collapse recomputes coordinates in O(V), where V is the logically expanded/filtered tree, not the total source when branches are collapsed. Expanding all 50k is still O(N) CPU and layout storage even though DOM remains bounded. Immutable expansion sets can also require O(N) copying.
- Normalization is O(N) plus sibling and peer-metric sorting; search is O(N), debounced rather than asynchronous. Ancestor closure stops at already-retained nodes. Outlier metric selection scans cached results to build an ID set; an active outlier-only filter also requires filtering/layout.
- The API still delivers the entire trace and entire selected payload. JSON parsing, transfer size, and retained decoded objects are not virtualized. Previewing bounds subsequent formatting/rendering, not network or parsing costs. Repeated explicit Show more actions can eventually become expensive.
- Layout uses fixed-height cards (full names via accessible text, hover title, and details). Very wide top-down trees remain visually spread out; search/focus/collapse help navigation but do not solve that information-design limit. Larger traces can also hit browser scroll-coordinate limits. Keyboard navigation uses a roving Tab stop, arrows, Home/End, and Enter/Space. Focus targets are mounted before focus moves. I cycles badge explanations; Escape dismisses them. A full screen-reader audit remains outstanding.
- The performance harness is a deterministic smoke profile, not an automated cross-browser benchmark. It does not model network latency, mobile CPU throttling, a production trace distribution, or heap/GC stress over a long session.
- Production lazy fetching needs child-count/loading metadata and a paginated child endpoint. Streaming updates would require updating affected index entries, revalidating depth/metrics, and invalidating affected layout. Very large server-side searches should return matched IDs plus ancestor paths. None of those endpoint changes are part of this assignment.

## Interview talking points

- “I measured first: 1k expanded nodes created 16.6k elements, and 10k expansion stalled inspection. Rendering was the first bottleneck.”
- “I kept the diagram UX and virtualized in two dimensions. Scrolling looks up depth bands and x ranges instead of rendering every logical node.”
- “Normalization and analysis happen once per response. Selection reuses stable references; changing a metric is a presentation change.”
- “Large payloads are bounded before formatting, but I do not claim to stream JSON that the API sends as one object.”
- “At 50k, interactions stayed small in this profile, but loading still blocked briefly. A worker or server-side paging would be driven by that next measured budget, not added speculatively.”

## Alternate nested list view

The Tree/List switch shares the same index, filters, analysis, selection, and expansion state. List mode lays out expanded nodes in depth-first preorder with indentation, then renders only fixed-height rows within the viewport plus overscan. Switching layouts resets the viewport without resetting the shared state. The diagram measurements above predate this alternate layout; the test suite separately verifies list ordering, collapse behavior, and bounded viewport candidates at 50k.

## Cleanup verification (2026-10-04)

Removed unused maximum-per-group highlight calculations and token-bar metadata. Both views now use explicit expansion. Subtree bulk controls preserve expansion outside the scope; JSON display preference lives in App. The synthetic fixture now has same-type siblings and deliberate 8× spikes, verified by tests for every metric. Tooltip data has structured headings/comparisons instead of parsing strings.

Latest Node medians after the cleanup, using the revised fixtures:

| Operation | 1k | 10k | 50k |
| --- | ---: | ---: | ---: |
| Normalize and detect outliers, ms | 2.92 | 25.95 | 151.70 |
| Expanded layout, ms | 0.31 | 1.07 | 10.27 |
| Search, ms | 0.03 | 0.22 | 0.73 |
| Viewport candidate count | 11 | 11 | 10 |

These are CPU measurements, not new browser render timings. The revised fixtures exercise outlier formatting work that the earlier fixtures did not. Number formatting shares an Intl.NumberFormat instance. CSS overrides were consolidated and obsolete rules removed; JSX was expanded for readability. Full JSON copy still serializes the original payload synchronously and can be expensive for very large payloads.
