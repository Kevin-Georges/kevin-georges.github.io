// ---- Circuit-pattern generator ----
// Draws a "chip floorplan" — recursive rectangle subdivisions with thin borders,
// occasional accent fills, used as the banner and card backgrounds.

function drawCircuit(canvas, opts = {}) {
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.scale(dpr, dpr);

  const {
    bg = "#1d1530",
    line = "#5a3f88",
    accents = ["#b765d4", "#6ce078", "#f59f3a", "#7ad3f0", "#f5d24d"],
    minSize = 12,
    maxDepth = 6,
    accentRate = 0.06,
    seed = Math.random() * 1e9,
  } = opts;

  // Seeded PRNG so each canvas is stable per-load
  let s = seed >>> 0;
  const rand = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };

  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  ctx.lineWidth = 1;
  ctx.strokeStyle = line;

  function split(x, y, cw, ch, depth) {
    ctx.strokeRect(x + 0.5, y + 0.5, cw - 1, ch - 1);
    if (depth <= 0 || cw < minSize * 2 || ch < minSize * 2) {
      if (rand() < accentRate) {
        ctx.fillStyle = accents[Math.floor(rand() * accents.length)];
        ctx.globalAlpha = 0.35 + rand() * 0.4;
        ctx.fillRect(x + 1.5, y + 1.5, cw - 3, ch - 3);
        ctx.globalAlpha = 1;
      }
      return;
    }
    const horizontal = cw < ch ? rand() < 0.3 : rand() < 0.7;
    const t = 0.3 + rand() * 0.4;
    if (horizontal) {
      const cut = Math.floor(cw * t);
      split(x, y, cut, ch, depth - 1);
      split(x + cut, y, cw - cut, ch, depth - 1);
    } else {
      const cut = Math.floor(ch * t);
      split(x, y, cw, cut, depth - 1);
      split(x, y + cut, cw, ch - cut, depth - 1);
    }
  }

  split(0, 0, w, h, maxDepth);
}

function paintBanner() {
  const c = document.getElementById("banner-canvas");
  if (c) drawCircuit(c, { maxDepth: 7, minSize: 14, accentRate: 0.05, seed: 42 });
}

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
