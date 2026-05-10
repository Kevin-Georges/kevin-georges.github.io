// =====================================================
// KEVIN GEORGES — Netflix-style portfolio
// =====================================================

const FULL_NAME = "KEVIN GEORGES";
const LOGO = "KEVIN GEORGES";

// Shared content shown to every profile — the profiles are just for the cool intro
const SHARED_HEADLINE = "Kevin Georges";
const SHARED_DESCRIPTION = "Software engineer, hackathon winner, and embedded systems enthusiast. Studying Computer Science at the University of Southampton. A reel of projects, work, and moments worth keeping.";

const PROFILES = {
  recruiter: { name: "recruiter", headline: SHARED_HEADLINE, description: SHARED_DESCRIPTION },
  stalker:   { name: "stalker",   headline: SHARED_HEADLINE, description: SHARED_DESCRIPTION },
  other:     { name: "other",     headline: SHARED_HEADLINE, description: SHARED_DESCRIPTION },
};

const ROW_DEFINITIONS = [
  { id: "featured", title: "Featured" },
  { id: "projects", title: "Projects & Work" },
  { id: "moments", title: "Moments" },
];

// Career timeline data — used by the Timeline view
const TIMELINE = [
  {
    year: "2026",
    rows: [
      { items: [
        { title: "HackUPC", sub: "Top 5 of 180 teams — HP Metal Jet Digital Twin", tag: "Apr · Hackathon", featured: true, win: true },
        { title: "Research Assistant", sub: "University of Southampton — Neuroimaging cohort harmonisation", tag: "Apr – Now · Internship" },
      ]},
      { items: [
        { title: "Royal Hackaway v9", sub: "Track winner + top 5 of 43 teams — Emergency Incident Intelligence", tag: "Feb · Hackathon", featured: true, win: true },
      ]},
    ]
  },
  {
    year: "2025",
    rows: [
      { items: [
        { title: "SUFST", sub: "Embedded Software Engineer (Part-Time) — Vehicle systems & VCU firmware", tag: "Oct – Now · Role" },
        { title: "GSA Spark", sub: "Score 31/35 + Prize winner — 3D printer project", tag: "Nov · Competition", win: true },
      ]},
      { items: [
        { title: "University of Southampton", sub: "BSc Computer Science — Expected: First Class", tag: "Sep · Education" },
        { title: "HackStart", sub: "4th place of 40 teams — Southampton Hackathon", tag: "Sep · Hackathon" },
      ]},
    ]
  },
  {
    year: "2024",
    rows: [
      { items: [
        { title: "CLS Group Insight Week", sub: "Technology, Software & Infrastructure — T-SQL optimisation (22% efficiency gain)", tag: "Jul · Internship" },
      ]},
    ]
  }
];

// Same project tiles for every profile — profiles are decorative
const SHARED_TILES = [
  {
    src: "images/mirror.png",
    title: "Mirror",
    description: "Real-time digital twin of the HP Metal Jet S100 industrial 3D printer. 25+ Blender components with live degradation, telemetry charts, and CSV export. Top 5 of 180 teams.",
    link: "https://github.com/Kevin-Georges/Mirror-HackUPC2026",
    tag: "Hackathon · Python",
  },
  {
    src: "images/emergency-incident-intelligence.png",
    title: "Emergency Incident Intelligence",
    description: "Backend that ingests emergency call transcripts, extracts structured claims, and merges them into probabilistic evidence with continuously-updating confidence. Track winner + top 5 of 43.",
    link: "https://github.com/Kevin-Georges/RoyalHackawayV9",
    tag: "Hackathon · Python",
  },
  {
    src: "images/ai-debug-duck.png",
    title: "AI Debug Duck",
    description: "Rubber-duck debugging assistant for embedded engineers — Llama 3.3 70B on Cloudflare Workers AI, WebSocket streaming chat, Durable Objects + SQLite for persistence, /report command for structured debug reports.",
    link: "https://github.com/Kevin-Georges/cf_ai_debug_duck",
    tag: "Cloudflare · TypeScript",
  },
  {
    src: "images/ec2-minecraft-neoforge.png",
    title: "EC2 Minecraft NeoForge",
    description: "Modded Minecraft server on AWS with cost-optimised auto-start/stop. Terraform-provisioned EC2, systemd boot service, Lambda APIs, and a Discord bot with /start and /status slash-commands.",
    link: "https://github.com/Kevin-Georges/EC2MinecraftNeoForge",
    tag: "AWS · Python · Terraform",
  },
  {
    src: "images/puzzle-game.png",
    title: "Puzzle Game",
    description: "2D platformer with integrated logic puzzles built in Unity. Custom puzzle system with configurable difficulty tiers, a scoring engine tracking completion time and accuracy, and adaptive difficulty progression scaling platformer challenge and time pressure across stages.",
    link: "https://github.com/Kevin-Georges/PuzzleGameLogic",
    tag: "Unity · C# · Shaders",
  },
];

const DEFAULT_TILES = {
  recruiter: SHARED_TILES,
  stalker:   SHARED_TILES,
  other:     SHARED_TILES,
};

let currentProfile = null;
let modalState = null;

// =====================================================
// ROUTING
// =====================================================
function route() {
  const hash = window.location.hash.slice(1) || "profiles";
  const app = document.getElementById("app");

  if (hash === "splash") {
    app.innerHTML = renderSplash();
    setTimeout(() => { window.location.hash = "profiles"; }, 2400);
    return;
  }

  if (hash === "profiles") {
    currentProfile = null;
    app.innerHTML = renderProfiles();
    return;
  }

  if (hash.startsWith("profile/")) {
    const profile = hash.split("/")[1];
    if (PROFILES[profile]) {
      currentProfile = profile;
      app.innerHTML = renderProfilePage();
      attachNavScrollHandler();
      return;
    }
  }

  if (hash === "timeline") {
    if (!currentProfile) currentProfile = "recruiter";
    app.innerHTML = renderTimelinePage();
    attachNavScrollHandler();
    return;
  }

  // fallback
  window.location.hash = "profiles";
}

// =====================================================
// SPLASH
// =====================================================
function renderSplash() {
  return `
    <div class="splash">
      <div class="splash-logo">${LOGO}</div>
    </div>
  `;
}

// =====================================================
// PROFILES
// =====================================================
function renderProfiles() {
  const cards = Object.values(PROFILES).map(p => `
    <button class="profile-card" data-profile="${p.name}" onclick="window.location.hash = 'profile/${p.name}'">
      <div class="profile-avatar avatar-${p.name}">
        ${getAvatarSVG(p.name)}
      </div>
      <div class="profile-name">${p.name}</div>
    </button>
  `).join("");

  return `
    <div class="profiles">
      <div class="profiles-logo">
        <div class="kg-logo kg-logo-sm">${LOGO}</div>
      </div>

      <h1 class="profiles-title">Who's watching?</h1>

      <div class="profiles-grid">${cards}</div>

      <button class="manage-btn" onclick="openManageModal()">Manage Profiles</button>
    </div>

    ${modalState ? renderModal() : ""}
  `;
}

// =====================================================
// PROFILE PAGE (main content)
// =====================================================
function renderProfilePage() {
  const profile = PROFILES[currentProfile];
  const tiles = getProfileTiles(currentProfile);
  const featured = tiles[0] || null;
  const navAvatarSVG = getAvatarSVG(currentProfile);

  const heroBg = featured?.src
    ? `style="background-image: url('${escapeAttr(featured.src)}')"`
    : `style="background: linear-gradient(135deg, #2d0709 0%, #141414 60%, #000 100%)"`;

  // If there's a featured tile, show its title/description in hero instead of the profile blurb
  const heroTitle = featured?.title || profile.headline;
  const heroDescription = featured?.description || profile.description;
  const heroLink = featured?.link;

  return `
    <nav class="app-nav" id="appNav">
      <div class="nav-logo">
        <div class="kg-logo kg-logo-md">${LOGO}</div>
      </div>
      <div class="nav-links">
        <a class="active" onclick="window.location.hash = 'profile/${currentProfile}'">Home</a>
        <a onclick="window.location.hash = 'timeline'">Timeline</a>
        <a onclick="alert('Films view coming soon')">Films</a>
        <a onclick="alert('My List coming soon')">My List</a>
      </div>
      <div class="nav-right">
        <button class="nav-icon-btn" onclick="openAddModal()" title="Add image">+</button>
        <button class="nav-icon-btn" title="Search">⌕</button>
        <button class="nav-profile avatar-${currentProfile}" onclick="window.location.hash = 'profiles'" title="Switch profile">${navAvatarSVG}</button>
      </div>
    </nav>

    <section class="hero">
      <div class="hero-bg" ${heroBg}></div>
      <div class="hero-content">
        <div class="hero-eyebrow">A ${LOGO} Original</div>
        <h1 class="hero-title">${heroTitle}</h1>
        <p class="hero-description">${heroDescription}</p>
        <div class="hero-actions">
          ${heroLink
            ? `<a class="btn-hero btn-play" href="${escapeAttr(heroLink)}" target="_blank" rel="noopener">
                <span class="btn-icon">▶</span><span>View on GitHub</span>
              </a>`
            : `<button class="btn-hero btn-play" onclick="alert('Press space to imagine a trailer playing.')">
                <span class="btn-icon">▶</span><span>Play</span>
              </button>`
          }
          <button class="btn-hero btn-info" onclick="openAddModal()">
            <span class="btn-icon">+</span>
            <span>Add Content</span>
          </button>
        </div>
      </div>
    </section>

    ${ROW_DEFINITIONS.map(row => renderRow(row, tiles)).join("")}

    <footer class="footer">
      <div class="footer-links">
        <a href="https://github.com/Kevin-Georges" target="_blank" rel="noopener">GitHub</a>
        <a href="https://www.linkedin.com/in/kevingeorges8/" target="_blank" rel="noopener">LinkedIn</a>
        <a href="mailto:kevingeorges8@outlook.com">Email</a>
      </div>
      <div>© ${new Date().getFullYear()} Kevin Georges. A streaming portfolio.</div>
    </footer>

    ${modalState ? renderModal() : ""}
  `;
}

// =====================================================
// TIMELINE PAGE
// =====================================================
function renderTimelinePage() {
  const navAvatarSVG = getAvatarSVG(currentProfile);

  const yearBlocks = TIMELINE.map(group => {
    const cardsHTML = group.rows.map(row => {
      const items = row.items.map(item => {
        const cls = ["tl-card"];
        if (item.featured) cls.push("featured");
        const subCls = item.win ? "tl-card-sub win" : "tl-card-sub";
        return `
          <div class="${cls.join(" ")}">
            <div class="tl-card-tag">${escapeAttr(item.tag)}</div>
            <div class="tl-card-title">${escapeAttr(item.title)}</div>
            <div class="${subCls}">${escapeAttr(item.sub)}</div>
          </div>
        `;
      }).join("");
      return `<div class="tl-row">${items}</div>`;
    }).join("");

    return `
      <div class="tl-year-section">
        <div class="tl-year-label">${group.year}</div>
        <div class="tl-year-cards">${cardsHTML}</div>
      </div>
    `;
  }).join("");

  return `
    <nav class="app-nav scrolled" id="appNav">
      <div class="nav-logo">
        <div class="kg-logo kg-logo-md">${LOGO}</div>
      </div>
      <div class="nav-links">
        <a onclick="window.location.hash = 'profile/${currentProfile}'">Home</a>
        <a class="active" onclick="window.location.hash = 'timeline'">Timeline</a>
        <a onclick="alert('Films view coming soon')">Films</a>
        <a onclick="alert('My List coming soon')">My List</a>
      </div>
      <div class="nav-right">
        <button class="nav-icon-btn" onclick="openAddModal()" title="Add image">+</button>
        <button class="nav-icon-btn" title="Search">⌕</button>
        <button class="nav-profile avatar-${currentProfile}" onclick="window.location.hash = 'profiles'" title="Switch profile">${navAvatarSVG}</button>
      </div>
    </nav>

    <section class="timeline-page">
      <header class="tl-header">
        <div class="hero-eyebrow">A ${LOGO} Original Series</div>
        <h1 class="tl-title">Timeline</h1>
        <p class="tl-subtitle">A scrolling reel of education, work, hackathons, and the moments in between.</p>
      </header>

      <div class="tl-track">${yearBlocks}</div>
    </section>

    ${modalState ? renderModal() : ""}
  `;
}

// =====================================================
// ROW
// =====================================================
function renderRow(row, allTiles) {
  // Distribute tiles across rows: featured = first 5, projects = next, moments = remaining
  const buckets = {
    featured: allTiles.slice(0, 5),
    projects: allTiles.slice(5, 12),
    moments: allTiles.slice(12),
  };
  const tiles = buckets[row.id] || [];

  // Always render at least 5 slots, fill with empty placeholders
  const minSlots = 5;
  const emptyCount = Math.max(minSlots - tiles.length, 0);

  const tileHTML = tiles.map((tile, i) => {
    const src = escapeAttr(tile.src);
    const title = escapeAttr(tile.title || `${row.title} ${i + 1}`);
    const tag = tile.tag ? `<div class="tile-overlay-tag">${escapeAttr(tile.tag)}</div>` : "";
    const wrapper = tile.link
      ? `<a class="tile" href="${escapeAttr(tile.link)}" target="_blank" rel="noopener">`
      : `<div class="tile">`;
    const closer = tile.link ? `</a>` : `</div>`;
    return `
      ${wrapper}
        <img class="tile-img" src="${src}" alt="${title}" loading="lazy" onerror="this.style.display='none'; this.parentElement.querySelector('.tile-fallback').style.display='flex';" />
        <div class="tile-fallback" style="display:none;">
          <div class="tile-fallback-title">${title}</div>
        </div>
        <div class="tile-overlay">
          <div class="tile-overlay-title">${title}</div>
          ${tag}
        </div>
      ${closer}
    `;
  }).join("");

  const emptyHTML = Array(emptyCount).fill(0).map(() => `
    <div class="tile" onclick="openAddModal()">
      <div class="tile-empty">
        <div class="tile-empty-plus">+</div>
        <div class="tile-empty-text">Add</div>
      </div>
    </div>
  `).join("");

  const trackId = `track-${row.id}`;

  return `
    <section class="row">
      <h2 class="row-title">${row.title}</h2>
      <div class="row-track-wrap">
        <button class="row-arrow left" onclick="scrollRow('${trackId}', -1)">‹</button>
        <div class="row-track" id="${trackId}">${tileHTML}${emptyHTML}</div>
        <button class="row-arrow right" onclick="scrollRow('${trackId}', 1)">›</button>
      </div>
    </section>
  `;
}

function scrollRow(id, dir) {
  const track = document.getElementById(id);
  if (!track) return;
  const amount = track.clientWidth * 0.85 * dir;
  track.scrollBy({ left: amount, behavior: "smooth" });
}

// =====================================================
// NAV SCROLL HANDLER
// =====================================================
function attachNavScrollHandler() {
  const nav = document.getElementById("appNav");
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 80) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
  };
  onScroll();
  window.removeEventListener("scroll", window._navScrollHandler || (() => {}));
  window._navScrollHandler = onScroll;
  window.addEventListener("scroll", onScroll, { passive: true });
}

// =====================================================
// MODALS
// =====================================================
function renderModal() {
  if (modalState === "add") return renderAddModal();
  if (modalState === "manage") return renderManageModal();
  return "";
}

function renderAddModal() {
  const profileSelector = !currentProfile ? `
    <div class="field">
      <label>Profile</label>
      <select id="modalProfile" style="padding: 0.7rem 0.9rem; background: var(--bg-2); border: 1px solid var(--bg-3); border-radius: 4px; color: var(--fg); font-family: inherit; font-size: 0.95rem;">
        ${Object.keys(PROFILES).map(p => `<option value="${p}">${p}</option>`).join("")}
      </select>
    </div>
  ` : "";

  return `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModal()">×</button>
        <h2>Add image</h2>
        ${profileSelector}
        <div class="field">
          <label>Image URL or path</label>
          <input type="text" id="modalUrl" placeholder="images/${currentProfile || 'recruiter'}/photo.jpg" autofocus />
        </div>
        <div class="modal-actions">
          <button class="btn-modal secondary" onclick="closeModal()">Cancel</button>
          <button class="btn-modal primary" onclick="submitAdd()">Add</button>
        </div>
      </div>
    </div>
  `;
}

function renderManageModal() {
  const list = Object.keys(PROFILES).map(p => {
    const count = getProfileImages(p).length;
    return `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem; background: var(--bg-2); border-radius: 4px; margin-bottom: 0.5rem;">
        <div>
          <div style="font-weight: 600; text-transform: capitalize;">${p}</div>
          <div style="font-size: 0.8rem; color: var(--muted);">${count} image${count === 1 ? '' : 's'}</div>
        </div>
        <button class="btn-modal secondary" style="padding: 0.4rem 0.8rem; font-size: 0.85rem; flex: 0 0 auto;" onclick="clearProfileImages('${p}')">Clear</button>
      </div>
    `;
  }).join("");

  return `
    <div class="modal-backdrop" onclick="closeModal()">
      <div class="modal" onclick="event.stopPropagation()">
        <button class="modal-close" onclick="closeModal()">×</button>
        <h2>Manage profiles</h2>
        ${list}
        <div class="modal-actions">
          <button class="btn-modal secondary" onclick="closeModal()">Done</button>
        </div>
      </div>
    </div>
  `;
}

function openAddModal() {
  modalState = "add";
  rerender();
}

function openManageModal() {
  modalState = "manage";
  rerender();
}

function closeModal() {
  modalState = null;
  rerender();
}

function submitAdd() {
  const url = document.getElementById("modalUrl")?.value.trim();
  if (!url) { alert("Please enter an image URL"); return; }

  const profile = currentProfile || document.getElementById("modalProfile")?.value;
  if (!profile) return;

  const images = getProfileImages(profile);
  images.push(url);
  saveProfileImages(profile, images);

  closeModal();
}

function clearProfileImages(profile) {
  if (confirm(`Remove all images from "${profile}"?`)) {
    saveProfileImages(profile, []);
    rerender();
  }
}

// =====================================================
// STORAGE
// =====================================================
function getStorage() {
  try { return JSON.parse(localStorage.getItem("kg-portfolio") || "{}"); }
  catch { return {}; }
}

function setStorage(data) {
  localStorage.setItem("kg-portfolio", JSON.stringify(data));
}

function getProfileImages(profile) {
  const data = getStorage();
  return (data.images && data.images[profile]) || [];
}

function saveProfileImages(profile, images) {
  const data = getStorage();
  if (!data.images) data.images = {};
  data.images[profile] = images;
  setStorage(data);
}

// Returns combined tiles: seed projects + user-added images.
// User images are normalized into tile objects.
function getProfileTiles(profile) {
  const seeds = DEFAULT_TILES[profile] || [];
  const userImages = getProfileImages(profile).map(src => ({
    src,
    title: src.split("/").pop().split("?")[0],
    description: null,
    link: null,
    tag: null,
  }));
  return [...seeds, ...userImages];
}

function getProfileAvatar(profile) {
  const tiles = getProfileTiles(profile);
  return tiles[0]?.src || null;
}

// =====================================================
// AVATARS — Netflix-style animated SVG faces
// =====================================================
function getAvatarSVG(profile) {
  // Recruiter: Carmen-Sandiego-style (red coat, hat, mysterious smile)
  if (profile === "recruiter") {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kg-avatar-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="100" height="100" fill="#e50914"/>
        <!-- hat brim -->
        <ellipse cx="50" cy="32" rx="34" ry="6" fill="#1a0204"/>
        <!-- hat top -->
        <path d="M 26 32 Q 28 14 50 14 Q 72 14 74 32 Z" fill="#1a0204"/>
        <!-- hat band -->
        <rect x="26" y="28" width="48" height="4" fill="#7a0408"/>
        <!-- face -->
        <ellipse cx="50" cy="56" rx="18" ry="22" fill="#f4c4a1"/>
        <!-- shadow under hat -->
        <ellipse cx="50" cy="42" rx="18" ry="6" fill="#000" opacity="0.3"/>
        <!-- eyes -->
        <g class="kg-blink">
          <ellipse cx="42" cy="52" rx="2.2" ry="3"  fill="#1a0204"/>
          <ellipse cx="58" cy="52" rx="2.2" ry="3" fill="#1a0204"/>
        </g>
        <!-- lips -->
        <path d="M 44 66 Q 50 70 56 66 Q 50 64 44 66 Z" fill="#9a0a18"/>
        <!-- coat collar -->
        <path d="M 28 88 Q 50 76 72 88 L 72 100 L 28 100 Z" fill="#1a0204"/>
        <path d="M 36 92 L 50 84 L 64 92" fill="none" stroke="#7a0408" stroke-width="1.5"/>
      </svg>
    `;
  }

  // Stalker: hooded ninja figure (dark blue)
  if (profile === "stalker") {
    return `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kg-avatar-svg" preserveAspectRatio="xMidYMid meet">
        <rect width="100" height="100" fill="#1a73e8"/>
        <!-- hood outer -->
        <path d="M 22 100 Q 18 36 50 30 Q 82 36 78 100 Z" fill="#0a1c40"/>
        <!-- face oval -->
        <ellipse cx="50" cy="58" rx="14" ry="17" fill="#f4c4a1"/>
        <!-- hood inner shadow on face -->
        <path d="M 36 50 Q 50 38 64 50 Q 64 44 50 38 Q 36 44 36 50 Z" fill="#0a1c40" opacity="0.6"/>
        <!-- mask (covers nose and mouth) -->
        <path d="M 36 60 Q 50 56 64 60 L 64 76 Q 50 78 36 76 Z" fill="#0a1c40"/>
        <!-- mask top edge -->
        <path d="M 36 60 Q 50 58 64 60" fill="none" stroke="#1a73e8" stroke-width="1"/>
        <!-- eyes (glowing) -->
        <g class="kg-blink">
          <ellipse cx="43" cy="55" rx="2.5" ry="2.8" fill="#fff"/>
          <ellipse cx="57" cy="55" rx="2.5" ry="2.8" fill="#fff"/>
          <circle cx="43" cy="55" r="1.2" fill="#0a1c40"/>
          <circle cx="57" cy="55" r="1.2" fill="#0a1c40"/>
        </g>
        <!-- eyebrows (suspicious) -->
        <path d="M 39 49 L 47 50" stroke="#0a1c40" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M 53 50 L 61 49" stroke="#0a1c40" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    `;
  }

  // Other: friendly monster (yellow/teal)
  return `
    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="kg-avatar-svg" preserveAspectRatio="xMidYMid meet">
      <rect width="100" height="100" fill="#f5d24d"/>
      <!-- body -->
      <ellipse cx="50" cy="60" rx="30" ry="32" fill="#2bb6a8"/>
      <!-- belly -->
      <ellipse cx="50" cy="68" rx="18" ry="20" fill="#a7e8df"/>
      <!-- horns -->
      <path d="M 28 38 L 22 22 L 36 32 Z" fill="#2bb6a8"/>
      <path d="M 72 38 L 78 22 L 64 32 Z" fill="#2bb6a8"/>
      <!-- big eyes -->
      <g class="kg-blink">
        <ellipse cx="40" cy="52" rx="6" ry="7" fill="#fff"/>
        <ellipse cx="60" cy="52" rx="6" ry="7" fill="#fff"/>
        <circle cx="41" cy="53" r="3" fill="#1a1a1a"/>
        <circle cx="61" cy="53" r="3" fill="#1a1a1a"/>
        <circle cx="42" cy="52" r="0.9" fill="#fff"/>
        <circle cx="62" cy="52" r="0.9" fill="#fff"/>
      </g>
      <!-- mouth (open, smiling) -->
      <path d="M 40 68 Q 50 78 60 68 Q 50 74 40 68 Z" fill="#1a1a1a"/>
      <!-- tooth -->
      <rect x="44" y="68" width="3" height="4" fill="#fff"/>
      <!-- cheek blush -->
      <circle cx="32" cy="62" r="3" fill="#ff8aa3" opacity="0.6"/>
      <circle cx="68" cy="62" r="3" fill="#ff8aa3" opacity="0.6"/>
    </svg>
  `;
}

// =====================================================
// HELPERS
// =====================================================
function escapeAttr(s) {
  return String(s).replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function rerender() {
  route();
}

// =====================================================
// INIT
// =====================================================
window.addEventListener("hashchange", route);
document.addEventListener("DOMContentLoaded", route);
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && modalState) closeModal();
});
