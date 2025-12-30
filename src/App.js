import { useRef, useState, useEffect } from "react";
import Mindmap from "./components/Mindmap";
import Sidebar from "./components/Sidebar";
import "./styles.css";

function App() {
  const mindmapRef = useRef();
  const [activeNode, setActiveNode] = useState(null);
  const [dark, setDark] = useState(false);

  // 🔹 Dark mode toggle on body
  useEffect(() => {
    document.body.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <div className="app-container">
      <div className="mindmap-container">
        <div className="top-bar">
          <h1>Interactive Mindmap</h1>

          <div className="controls">
            <button onClick={() => mindmapRef.current.expandAll()}>
              Expand
            </button>
            <button onClick={() => mindmapRef.current.collapseAll()}>
              Collapse
            </button>
            <button onClick={() => mindmapRef.current.drillDown()}>
              Drill Down
            </button>
            <button onClick={() => mindmapRef.current.drillUp()}>
              Drill Up
            </button>
            <button onClick={() => mindmapRef.current.fitView()}>
              Fit
            </button>

            {/* 🌙 Dark / Light Toggle */}
            <button onClick={() => setDark(!dark)}>
              {dark ? "☀️ Light" : "🌙 Dark"}
            </button>
          </div>
        </div>

        <div className="mindmap-wrapper">
          <Mindmap ref={mindmapRef} onNodeSelect={setActiveNode} />
        </div>
      </div>

      <div className="sidebar">
        <Sidebar node={activeNode} />
      </div>
    </div>
  );
}

export default App;
