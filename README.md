# Trace Explorer

A React + TypeScript viewer for LangSmith execution traces. It reconstructs the unordered API response into a navigable hierarchy, with run details and filters for debugging an LLM application's execution.

## Run locally

Use Node.js 20+ and npm. Run all commands below from the repository root.

Install both sets of dependencies:

```bash
npm ci --prefix server
npm ci --prefix client
```

Start the backend in one terminal:

```bash
npm run dev --prefix server
```

Start the frontend in a second terminal, also from the repository root:

```bash
npm run dev --prefix client
```

Open [http://localhost:3000](http://localhost:3000). The backend runs on port 3001; Vite proxies `/api` requests to it. Keep both terminals running and make sure those ports are available. No API keys or environment variables are required.

The supplied backend exposes `GET /api/traces` and `GET /api/traces/:runId`. Its source and trace data are unchanged.

## Explore a trace

- **Navigate:** List is the default view. Tree provides a top-down diagram. Siblings are ordered by start time, with IDs breaking ties; this does not imply sequential execution.
- **Inspect:** Click a run to select it, open its details, and expand it if collapsed. Use its disclosure arrow to collapse it. Names, types, status, tokens, cost, and duration are shown.
- **Search and filter:** Combine name, run type, and status filters. Matching name text is highlighted. Nonmatching ancestors remain dimmed for context, and matching paths expand automatically. Collapse controls are disabled while filtering; removing filters restores the previous expansion state.
- **Read payloads:** Switch between Formatted and JSON views. Large payloads use labeled previews with “Show more”; Copy JSON copies the full payload, including content outside the preview.
- **Share context:** Copy path in the details panel copies the full root-to-run path and selected run ID, even when a subtree is focused. Run IDs can also be copied separately.
- **Focus a branch:** Select a run, then choose Focus subtree. Selecting a child changes the details without changing the focused root. Back to full trace exits the subtree; direct refocusing within an existing subtree is not implemented.
- **Zoom:** Use the zoom buttons, or Ctrl/Cmd + scroll in Tree view. Zoom is centered on the cursor for modified scrolling. Switching to List resets zoom to 100%. Physical trackpad pinch still needs manual verification.

## Investigate outliers

Open **Outliers**, choose All outliers, Tokens, Duration, or Cost, and select a minimum spike of **2×, 3×, or 4×**. The default is 3×. This immediately filters to qualifying runs and their ancestors; the matching count excludes ancestors that do not qualify. Exit outliers removes this filter while retaining other search/filter settings.

A run is compared with the median of at least two other same-type siblings, excluding itself. Comparisons use the original trace before search or subtree filtering. Missing metrics, unfinished durations, and zero peer medians do not produce ratio-based outliers. Hover a badge for its comparison, or use the keyboard shortcut below.

An outlier is an investigation hint, not proof of failure or inefficiency: siblings may perform different work. Parent and child totals can overlap and are not summed together.

## Keyboard controls

| Location | Keys | Action |
|---|---|---|
| Search with matching results | Tab or ↓ | Focus the first matching run |
| Tree/List | ↑ / ↓ | Move through visible rows, including ancestors |
| Tree/List | → / ← | Expand or move to a child; collapse or move to the parent |
| Tree/List | Home / End | Focus the first or last displayed row in the hierarchy |
| Focused run | Enter / Space | Select, show details, and expand if collapsed |
| Run with outlier badges | I / Escape | Cycle badge explanations / dismiss them |
| Tree/List | Tab | Leave the tree for the next focusable control |

Typing keeps focus in search. With no search matches, Tab follows the normal control order. Shift+Tab moves backward through controls. Controls have accessible names, selection/expansion states, and visible focus; a full screen-reader audit remains outstanding.

## Validate

After installing dependencies in **both** folders, run these from the repository root:

```bash
npm run test --prefix client
npm run lint --prefix client
npm run build --prefix client
npm run build --prefix server
```

The client tests use the backend's installed `tsx` dependency. The 16 tests cover hierarchy construction, chronological ordering, orphan/cycle handling, combined filters, missing versus zero metrics, subtree scope, outlier thresholds, path copying, bounded payload previews, and layout/viewport behavior for 50,000 runs and 10,000-level nesting. These are not a complete browser or API integration test suite.

For the separate CPU benchmark:

```bash
npm run bench --prefix client
```

## Synthetic scenarios

With the frontend development server running, open one of:

- [1,000 runs](http://localhost:3000/?fixture=1000)
- [10,000 runs](http://localhost:3000/?fixture=10000)
- [50,000 runs](http://localhost:3000/?fixture=50000)

These development-only fixtures bypass the API and are excluded from the production build. A small measurement panel reports rendering statistics.

For a quick check on the 1,000-run fixture:

1. Filter status to **error**, select a failed run, and inspect “Synthetic tool failure.”
2. Clear filters, open **Outliers**, and keep **All outliers** selected. At 2×, 3×, and 4×, expect 249, 166, and 83 matching runs respectively. Spikes vary between approximately 2.5×, 3.5×, and 8×.
3. Search for `run 96`, then press Tab or ↓ to focus a match.
4. Filter status to **running** to inspect unfinished runs.

The synthetic payload is shared placeholder content, cost is proportional to tokens, and missing token/cost values are not deliberately generated. These fixtures exercise controls and scale; they cannot realistically explain why a particular prompt was expensive.

Return to [the original trace](http://localhost:3000/) for API testing. Only three supplied runs include detailed payloads; “No recorded content” for other runs is expected. To check recovery, stop the backend, reload the original trace, then restart it and choose Try again. To check a detail-request failure, stop the backend after the tree loads and select a different run. Do not use synthetic mode for these checks.

## Limitations and design notes

Missing metrics display “—”, while zero remains zero. Run errors, missing detail payloads, request failures, loading, and empty results have distinct states. Selection changes cancel pending detail requests. Validation of malformed individual API records and automated outage/recovery coverage remain areas for improvement.

The hierarchy preserves orphaned runs and repairs cycles rather than silently discarding runs. Supplied timestamps may not enclose every descendant. Virtualized rendering and bounded previews limit routine rendering work, but copying an entire very large payload still serializes it in the browser.

- [THOUGHTS.md](./THOUGHTS.md): priorities, decisions, tradeoffs, and possible next steps.
- [DESIGN.md](./DESIGN.md): the earlier scalability investigation; its benchmark numbers are historical, not measurements of every subsequent UI change.

The client currently contains 1,402 physical lines, including tests, fixtures, configuration, styles, blank lines, and comments. This excludes documentation, dependencies, lockfiles, and build artifacts. The supplied server adds 1,738 lines, mostly fixture data; the full repository count under those exclusions is 3,140. This distinction is recorded explicitly rather than assuming the provided backend is excluded from the assignment limit.
