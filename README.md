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
    cd server && pnpm install
    cd ../client && pnpm install
    ```
    
2. **Start development servers**:
    
    ```bash
    # Terminal 1 - Backend
    cd server && pnpm run dev  # Port 3001
    # Terminal 2 - Frontend
    cd client && pnpm run dev  # Port 3000
    ```
    
3. **View the app**: Open http://localhost:3000
