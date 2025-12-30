const Sidebar = ({ node }) => {
  if (!node) {
    return (
      <div className="empty-state">
        <h2>Mindmap Explorer</h2>
        <p>Hover to preview, click to lock details.</p>
      </div>
    );
  }

  return (
    <div className="sidebar-card">
      {/* Title */}
      <h2 className="sidebar-title">{node.label}</h2>

      {/* Badges */}
      <div className="badge-row">
        <span className="badge badge-primary">Selected</span>
      </div>

      <div className="divider" />

      {/* Overview */}
      <div className="sidebar-section">
        <h4>Overview</h4>
        <p className="sidebar-text">
          {node.summary || "No description available."}
        </p>
      </div>

      {/* Details */}
      <div className="sidebar-section muted">
        <h4>Details</h4>
        <ul className="detail-list">
          <li><strong>ID:</strong> {node.id}</li>
          <li><strong>Label:</strong> {node.label}</li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
