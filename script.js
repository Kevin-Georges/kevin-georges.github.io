// ---- Neural-network visualization ----
// Layered nodes connected by edges. Edge stroke width = |weight|,
// color = sign (green positive, pink negative). Seeded per-canvas.

function drawNetwork(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  if (w === 0 || h === 0) return;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const {
    bg = "#1d1530",
    layers = [4, 6, 6, 4],
    posColor = "108, 224, 120",   // green rgb
    negColor = "224, 112, 200",   // pink rgb
    nodeColor = "#f5d24d",
    nodeStroke = "#1d1530",
    showWeights = false,
    padX = 24,
    padY = 18,
    seed = Math.random() * 1e9,
  } = opts;

  // Seeded PRNG (LCG) — stable across redraws
  let s = (seed >>> 0) || 1;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
  // Gaussian-ish for weights (Box-Muller)
  const gauss = () => {
    const u = Math.max(rand(), 1e-9);
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Layout: equally-spaced layers in X, nodes vertically centered
  const innerW = Math.max(w - padX * 2, 1);
  const innerH = Math.max(h - padY * 2, 1);
  const positions = layers.map((count, li) => {
    const x = layers.length === 1 ? w / 2 : padX + (innerW * li) / (layers.length - 1);
    const gap = innerH / (count + 1);
    return Array.from({ length: count }, (_, i) => ({
      x,
      y: padY + gap * (i + 1)
    }));
  });

  // Edges (drawn first so nodes sit on top)
  const nodeR = Math.max(2.2, Math.min(innerH / 18, 5.5));
  for (let li = 0; li < positions.length - 1; li++) {
    const A = positions[li];
    const B = positions[li + 1];
    for (const a of A) {
      for (const b of B) {
        const wgt = gauss();        // ~N(0,1)
        const mag = Math.min(Math.abs(wgt), 2.5) / 2.5; // 0..1
        const rgb = wgt >= 0 ? posColor : negColor;
        ctx.strokeStyle = `rgba(${rgb}, ${0.15 + mag * 0.65})`;
        ctx.lineWidth = 0.4 + mag * 1.6;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();

        if (showWeights && mag > 0.55) {
          ctx.fillStyle = `rgba(${rgb}, 0.85)`;
          ctx.font = '9px "JetBrains Mono", monospace';
          const mx = (a.x + b.x) / 2;
          const my = (a.y + b.y) / 2;
          ctx.fillText(wgt.toFixed(2), mx + 2, my - 2);
        }
      }
    }
  }

  // Nodes
  for (const layer of positions) {
    for (const n of layer) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, nodeR, 0, Math.PI * 2);
      ctx.fillStyle = nodeColor;
      ctx.fill();
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = nodeStroke;
      ctx.stroke();
    }
  }
}

function paintBanner() {
  const c = document.getElementById("banner-canvas");
  if (c) drawNetwork(c, {
    layers: [5, 9, 9, 9, 5],
    showWeights: true,
    padX: 40,
    padY: 28,
    seed: 42,
  });
}

// Back-compat alias for the timeline renderer below
const drawCircuit = (canvas, opts = {}) => drawNetwork(canvas, {
  layers: [3, 5, 4],
  padX: 14,
  padY: 12,
  ...opts,
});

// ---- Timeline data ----
const timeline = [
  {
    year: "2026",
    rows: [
      { full: true, items: [
        { title: "Featured Project", sub: "Description of your headline project goes here", tag: "Jan – Now | Project", featured: true, icons: [] }
      ]}
    ]
  },
  {
    year: "2025",
    rows: [
      { items: [
        { title: "Cool Side Project", sub: "Short blurb", tag: "Nov | Build", icons: ["gh"] },
        { title: "Hackathon Win", sub: "Track winner", tag: "Nov | Hackathon", subClass: "win", icons: ["in", "gh"] },
      ]},
      { solo: true, items: [
        { title: "Open Source", sub: "Contribution / library", tag: "Oct | OSS", icons: ["gh"] }
      ]},
      { items: [
        { title: "Internship", sub: "Where you worked, what you did", tag: "Jun – Aug | Internship", icons: ["in"] },
        { title: "Talk / Event", sub: "Conference or meetup", tag: "May | Event", icons: ["in"] },
      ]},
    ]
  },
  {
    year: "2024",
    rows: [
      { items: [
        { title: "First Big Project", sub: "What it was", tag: "Hackathon", icons: ["gh"] },
        { title: "Course / Cert", sub: "Achievement", tag: "Course", icons: [] },
      ]},
      { solo: true, items: [
        { title: "Origin Project", sub: "The thing that got you started", tag: "Oct | Build", icons: ["gh"] }
      ]},
    ]
  },
  {
    year: "2023",
    rows: [
      { items: [
        { title: "Competition", sub: "Result", tag: "Competition", subClass: "win", icons: [] },
        { title: "Olympiad", sub: "Result", tag: "Competition", subClass: "win", icons: [] },
      ]},
    ]
  }
];

function iconHTML(kind) {
  const map = { in: "in", gh: "gh", web: "@" };
  return `<span>${map[kind] || kind}</span>`;
}

function renderCard(item, seed) {
  const cls = ["card"];
  if (item.featured) cls.push("featured");
  const icons = (item.icons || []).map(iconHTML).join("");
  const subClass = item.subClass ? `card-sub ${item.subClass}` : "card-sub";
  return `
    <a class="${cls.join(" ")}" href="#" data-seed="${seed}">
      <canvas class="card-bg"></canvas>
      <div class="card-icons">${icons}</div>
      <div class="card-tag">${item.tag}</div>
      <div class="card-title">${item.title}</div>
      <div class="${subClass}">${item.sub}</div>
    </a>
  `;
}

function renderTimeline() {
  const root = document.getElementById("timeline");
  if (!root) return;

  let html = "";
  let seed = 100;
  timeline.forEach(group => {
    const rowsHTML = group.rows.map(row => {
      const rowCls = ["year-row"];
      if (row.solo) rowCls.push("solo");
      if (row.full) rowCls.push("full");
      const cards = row.items.map(it => renderCard(it, seed++)).join("");
      return `<div class="${rowCls.join(" ")}">${cards}</div>`;
    }).join("");
    html += `
      <div class="year-cell">${group.year}</div>
      <div class="year-block">${rowsHTML}</div>
    `;
  });
  root.innerHTML = html;

  // paint each card's circuit background
  root.querySelectorAll(".card").forEach(card => {
    const canvas = card.querySelector(".card-bg");
    const seed = parseInt(card.dataset.seed, 10);
    requestAnimationFrame(() => {
      drawCircuit(canvas, { maxDepth: 5, minSize: 8, accentRate: 0.12, seed });
    });
  });
}

// ---- Theme toggle ----
function setupTheme() {
  const btn = document.getElementById("theme-toggle");
  const saved = localStorage.getItem("theme");
  if (saved) document.documentElement.setAttribute("data-theme", saved);
  const updateLabel = () => {
    const t = document.documentElement.getAttribute("data-theme");
    btn.textContent = t === "light" ? "light mode" : "dark mode";
  };
  updateLabel();
  btn.addEventListener("click", () => {
    const cur = document.documentElement.getAttribute("data-theme");
    const next = cur === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    updateLabel();
    paintBanner();
    renderTimeline();
  });
}

// ---- Init ----
window.addEventListener("load", () => {
  paintBanner();
  renderTimeline();
  setupTheme();
});

window.addEventListener("resize", () => {
  paintBanner();
});
