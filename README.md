# LangSmith Trace Viewer - Frontend Interview Assignment

## Overview

This is a **take-home frontend interview assignment** where candidates implement a hierarchical trace viewer for LangSmith execution traces. Users should be able to navigate through trace execution trees, view individual run details, and understand the flow of LLM app executions.

## 📋 Requirements
### Core Features (Must Have)

1. **Tree Visualization**: Render the complete trace tree showing:
    - Run names and types (chain, llm, tool, etc.)
    - Parent-child relationships
    - Show status/cost/token counts
2. **Interactive Navigation**:
    - Expandable/collapsible tree nodes
    - Click on any node to view detailed information
3. **Run Details Panel**: When a node is selected, display:
    - Formatted inputs and outputs for LLM calls
    - Error handling (if applicable)
4. **Search and Filter:**
    - Allow users to search/filter nodes by name, run type, and status

Note, this does not have to look like what exists in langsmith. Be creative.

## 🏗️ What's Provided

### Backend API (Complete)
- Express server with trace data and API endpoints
- Mock LangSmith trace data in `server/src/data/traceTree.ts`
  - Note the tree data isn't ordered, ordering the tree and structure is part of the assignment.
- Selected individual trace data in `server/src/data/singleRuns.ts`
- API endpoints for fetching trace trees and individual run details

### Frontend Skeleton
- React + TypeScript + Tailwind CSS application
- Basic `TraceViewer` component structure
- Basic `TraceTree` component that just renders items in a list
- Type definitions for trace data structures

## 📡 API Endpoints & Data Models

**Endpoints**:
- `GET /api/traces` - Get trace tree
- `GET /api/traces/:runId` - Get single trace information

**Key Data Models**:
```typescript
// New trace tree types
export interface RunNode {
  name: string;
  run_type: string;
  start_time: string;
  end_time: string | null;
  error: string | null;
  parent_run_id: string | null;
  trace_id: string;
  parent_run_ids: string[];
  total_tokens?: number;
  total_cost?: number;
  id: string;
  status: string;
}

export interface RunContent {
  id: string;
  inputs: Record<string, any>;
  outputs: Record<string, any>;
}

export type TraceTree = RunNode[];
```

## 🎨 Design Guidelines

### UI/UX Expectations
- Intuitive tree navigation with clear visual hierarchy
- Use consistent color coding for different run types
- Highlight selected nodes and maintain visual focus


## 🤔 Evaluation Criteria

- **Functionality**: Does the tree render correctly? Can you navigate and view run details?
- **Code Quality**: Is the code clean, well-structured, and maintainable?
- **Component Architecture**: Are components well-designed and reusable?
- **TypeScript Usage**: Are types used effectively throughout?
- **Visual Design**: Does the UI look polished and professional?

## 🚀 Implementation Suggestions

### Component Structure
Consider organizing your components like:
```
TraceViewer/
├── TraceTree/
│   ├── TreeNode/
│   └── RunTypeIcon/
├── RunDetailsPanel/
│   ├── InputsOutputs/
    └── ErrorDisplay/
```

### Git/version control

- start with a brand new repository with this code template.
- Make an initial commit with the code in the zip file
- make additional commits with your work
- share the repository with us

## Quick Start
1. **Install dependencies**:
    
    ```bash
    cd server && npm ci
    cd ../client && npm ci
    ```
    
2. **Start development servers**:
    
    ```bash
    # Terminal 1 - Backend
    cd server && npm run dev  # Port 3001
    # Terminal 2 - Frontend
    cd client && npm run dev  # Port 3000
    ```
    
3. **View the app**: Open http://localhost:3000

## Implementation notes

The viewer builds a parent/child forest from the unordered API response and sorts siblings by start time, with ID as a stable tie-breaker. Missing parents and cyclic ancestry are retained as roots so no run disappears. Search, type, and status filters combine; ancestor paths stay visible and expand while filtering. Clearing filters restores the previous expansion state.

The details panel formats both plain and serialized LangChain messages, including tool-call arguments, and offers a bounded JSON preview with progressive expansion. Copy JSON copies the full payload. Requests are aborted when selection changes. A 404 means the fixture has no payload, while other request failures offer a retry. Only three provided runs include payloads. Root metrics are displayed directly, without summing inclusive parent/child token or cost values. Durations use the fixture timestamps; these are not guaranteed to enclose all descendants.

### Validation

After installing dependencies in both folders:

```bash
npm run test --prefix client
npm run lint --prefix client
npm run build --prefix client
npm run build --prefix server
```

The small test suite uses the backend's existing `tsx` dependency (Node 20+) and covers unordered input, deterministic ordering, orphan/cyclic data, full fixture coverage, and metric/status edge cases. The UI uses labeled filters, visible focus styles, and ARIA tree items with hierarchy, selection, and expansion metadata. Off-screen cards are virtualized; keyboard focus is retained while scrolling. It stacks the tree and details on narrow screens. Arrow keys navigate and expand/collapse runs, Home/End move to the first/last expanded run, and Enter/Space selects and expands. A full screen-reader audit remains outstanding.


### Performance checks

See [DESIGN.md](./DESIGN.md) for measurements, trade-offs, and the scaling discussion. Run `npm run bench --prefix client` for deterministic CPU benchmarks. While the Vite development server is running, open `/?fixture=1000`, `/?fixture=10000`, or `/?fixture=50000` to use the separate synthetic-data harness and its React/long-task measurements. These fixtures do not alter the API and are excluded from production builds.

### Optional navigation and outliers

List view is the default at 100% zoom. Tree view supports cursor-centered Ctrl/Cmd + wheel zoom; physical trackpad pinch still needs manual verification. Focus subtree isolates the selected branch with a return action. Automatic badges flag duration, token, and cost values at least 3× the median of at least two other same-type siblings, excluding missing values and zero medians. Analysis filters these outliers; tooltips explain each comparison. Outliers are relative comparisons, not proof of failure.
