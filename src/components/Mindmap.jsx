import React, {
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle
} from "react";
import cytoscape from "cytoscape";
import dagre from "cytoscape-dagre";
import data from "../data/mindmapData.json";

cytoscape.use(dagre);

const Mindmap = forwardRef(({ onNodeSelect }, ref) => {
  const cyRef = useRef(null);
  const cyInstance = useRef(null);
  const tooltipRef = useRef(null);

  /* ========== EXPOSE CONTROLS ========== */
  useImperativeHandle(ref, () => ({
    expandAll,
    collapseAll,
    drillDown,
    drillUp,
    fitView
  }));

  useEffect(() => {
    const elements = [];

    /* ---------- NODES ---------- */
    data.nodes.forEach((n) => {
      elements.push({
        data: {
          id: n.id,
          label: n.data.label,
          summary: n.data.summary
        }
      });
    });

    /* ---------- EDGES ---------- */
    data.edges.forEach((e, i) => {
      elements.push({
        data: {
          id: `e-${i}`,
          source: e.source,
          target: e.target
        }
      });
    });

    /* ---------- CYTOSCAPE INIT ---------- */
    const cy = cytoscape({
      container: cyRef.current,
      elements,
      style: [
        {
          selector: "node",
          style: {
            label: "data(label)",
            "background-color": "#6366f1",
            color: "#ffffff",

            /* TEXT FIT */
            "text-wrap": "wrap",
            "text-max-width": "110px",
            "text-valign": "center",
            "text-halign": "center",
            "font-size": "12px",
            "font-weight": 500,

            /* BOX FIT */
            width: "label",
            height: "label",
            padding: "14px",

            "border-radius": 10,
            "border-width": 2,
            "border-color": "#312e81"
          }
        },
        {
          selector: "edge",
          style: {
            width: 2,
            "line-color": "#94a3b8",
            "target-arrow-color": "#94a3b8",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier"
          }
        },
        {
          selector: ".hidden",
          style: { display: "none" }
        },
        {
          /* SELECTED GLOW */
          selector: ".cy-node-selected",
          style: {
            "border-width": 4,
            "border-color": "#facc15",
            "background-color": "#4f46e5"
          }
        }
      ],
      layout: {
        name: "dagre",
        rankDir: "TB",
        rankSep: 110,
        nodeSep: 60
      },
      zoomingEnabled: true,
      panningEnabled: true
    });

    cyInstance.current = cy;

    /* ========== TOOLTIP ========== */
    const tooltip = document.createElement("div");
    tooltip.className = "cy-tooltip";
    tooltip.style.pointerEvents = "none";
    tooltip.style.display = "none";
    document.body.appendChild(tooltip);
    tooltipRef.current = tooltip;

    const showTooltip = (node, evt) => {
      const type =
        node.id() === "root"
          ? "Root"
          : data.hierarchy[node.id()]
          ? "Category"
          : "Concept";

      tooltip.innerHTML = `
        <div class="tooltip-title">${node.data("label")}</div>
        <div class="tooltip-row"><span>Type</span><span>${type}</span></div>
        <div class="tooltip-row"><span>Connections</span><span>${node.connectedEdges().length}</span></div>
      `;

      tooltip.style.left = evt.originalEvent.clientX + 12 + "px";
      tooltip.style.top = evt.originalEvent.clientY + 12 + "px";
      tooltip.style.display = "block";
    };

    const hideTooltip = () => {
      tooltip.style.display = "none";
    };

    /* ========== HELPERS ========== */
    const hideChildren = (id) => {
      (data.hierarchy[id] || []).forEach((cid) => {
        const c = cy.getElementById(cid);
        if (c) {
          c.addClass("hidden");
          hideChildren(cid);
        }
      });
    };

    const showChildren = (id) => {
      (data.hierarchy[id] || []).forEach((cid) => {
        cy.getElementById(cid).removeClass("hidden");
      });
    };

    /* ========== EVENTS ========== */

    // 🔹 Hover → preview only
    cy.on("mouseover", "node", (e) => {
      showTooltip(e.target, e);
      onNodeSelect(e.target.data());
    });

    cy.on("mouseout", "node", hideTooltip);

    // 🔹 Click → select + expand/collapse
    cy.on("tap", "node", (e) => {
      const node = e.target;

      /* clear previous selection */
      cy.nodes().removeClass("cy-node-selected");

      /* mark selected */
      node.addClass("cy-node-selected");

      /* lock sidebar */
      onNodeSelect(node.data());

      const children = data.hierarchy[node.id()] || [];
      if (!children.length) return;

      const isExpanded = !cy
        .getElementById(children[0])
        .hasClass("hidden");

      isExpanded
        ? hideChildren(node.id())
        : showChildren(node.id());

      cy.layout({ name: "dagre", rankDir: "TB" }).run();
    });

    return () => {
      tooltip.remove();
      cy.destroy();
    };
  }, [onNodeSelect]);

  /* ========== CONTROLS ========== */
  const expandAll = () => {
    const cy = cyInstance.current;
    cy.nodes().removeClass("hidden");
    cy.layout({ name: "dagre" }).run();
  };

  const collapseAll = () => {
    const cy = cyInstance.current;
    cy.nodes().addClass("hidden");
    cy.getElementById("root").removeClass("hidden");
    cy.layout({ name: "dagre" }).run();
  };

  const drillDown = () => {
    const cy = cyInstance.current;
    const sel = cy.$(".cy-node-selected");
    if (!sel.length) return;

    const keep = new Set();
    const dfs = (n) => {
      keep.add(n.id());
      (data.hierarchy[n.id()] || []).forEach((c) =>
        dfs(cy.getElementById(c))
      );
    };
    dfs(sel[0]);

    cy.nodes().forEach((n) =>
      keep.has(n.id())
        ? n.removeClass("hidden")
        : n.addClass("hidden")
    );

    cy.layout({ name: "dagre" }).run();
  };

  const drillUp = () => expandAll();

  const fitView = () => {
    const cy = cyInstance.current;
    cy.fit(
      cy.nodes().filter((n) => !n.hasClass("hidden")),
      50
    );
  };

  return <div ref={cyRef} style={{ width: "100%", height: "100%" }} />;
});

export default Mindmap;
