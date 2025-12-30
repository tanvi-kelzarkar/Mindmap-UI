# Interactive Mindmap UI

## Objective
The objective of this assignment is to build a complex, interactive, and data-driven user interface that visualizes hierarchical information in the form of a mindmap. The application focuses on clean UX, scalability, and clarity of interactions.

---

## Problem Statement
Design and implement a seamless, interactive Mindmap UI similar to the provided reference HTML file, supporting exploration of hierarchical data with rich user interactions.

---

## Solution Description

### Technologies & Libraries
- **Frontend Framework:** React
- **Visualization Library:** Cytoscape.js
- **Layout Algorithm:** cytoscape-dagre
- **Styling:** Custom CSS
- **Data Source:** JSON (`mindmapData.json`)

---

### Architecture
The application follows a component-based architecture:

- **App.js**  
  Acts as the main container and manages shared state such as the currently selected node.

- **Mindmap.jsx**  
  Responsible for rendering the mindmap using Cytoscape.js.  
  Handles interactions such as hover, click, expand/collapse, drill-down, zoom, and pan.

- **Sidebar.jsx**  
  Displays detailed information about the currently hovered or selected node.

---

### Data Flow
1. Mindmap data is stored in a JSON file (`mindmapData.json`).
2. The JSON is parsed into nodes and edges for Cytoscape.
3. User interactions (hover/click) trigger events in the Mindmap component.
4. Selected node data is passed to the Sidebar via React state.
5. The UI updates dynamically based on the JSON data.

> The UI is fully data-driven. Updating the JSON file automatically updates the visualization without any UI code changes.

---

## Features Implemented
- Hierarchical mindmap visualization
- Hover tooltips with contextual information
- Click to select and highlight nodes
- Expand and collapse branches
- Drill Down and Drill Up navigation
- Pan and zoom support
- Fit view functionality
- Detailed side panel for selected nodes
- Clean and responsive UI
