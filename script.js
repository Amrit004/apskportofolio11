/* ══════════════════════════════════════════════════════
   APSK Portfolio — script.js
   ══════════════════════════════════════════════════════ */

'use strict';

/* ── SCROLL PROGRESS BAR ─────────────────────────── */
const scrollBar = document.getElementById('scrollBar');
const nav       = document.getElementById('nav');

window.addEventListener('scroll', () => {
  const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  scrollBar.style.width = scrolled + '%';
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ── 3D SCROLL REVEAL ────────────────────────────── */
// Add fade-in class to all cards/items that need animating
document.querySelectorAll(
  '.timeline-item:not(.fade-left):not(.fade-right), .edu-card, .project-card, .gh-card, .skill-group, .languages-highlight, .contact-card'
).forEach(el => {
  if (!el.classList.contains('fade-in') && !el.classList.contains('fade-left') && !el.classList.contains('fade-right')) {
    el.classList.add('fade-in');
  }
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px 0px 0px' });

// Observe everything — including elements already in viewport
document.querySelectorAll('.fade-in, .fade-left, .fade-right').forEach((el, i) => {
  // Stagger siblings within the same parent
  const siblings = el.parentElement ? el.parentElement.querySelectorAll('.fade-in, .fade-left, .fade-right') : [];
  const idx = Array.from(siblings).indexOf(el);
  if (!el.style.transitionDelay && idx > 0) {
    el.style.transitionDelay = `${idx * 0.07}s`;
  }
  revealObserver.observe(el);
});

/* ── 3D CARD TILT ON HOVER (desktop only) ────────── */
function addTilt(selector, maxTilt = 6) {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * maxTilt}deg) rotateX(${-dy * maxTilt}deg) translateZ(8px)`;
      card.style.boxShadow = `${-dx * 12}px ${dy * 12}px 40px rgba(0,0,0,0.4), 0 0 20px rgba(99,212,176,0.08)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.boxShadow = '';
    });
  });
}

addTilt('.project-card', 7);
addTilt('.timeline-item', 4);
addTilt('.edu-card', 5);
addTilt('.role-card', 6);



/* ── MOBILE NAVIGATION ───────────────────────────── */
const hamburger = document.getElementById('navHamburger');
const navMenu   = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

// Close nav when any link is clicked
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Close nav on Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    hamburger.focus();
  }
});

/* ── TARGET ROLES — TABS + SHOW MORE ────────────── */
const tabBtns    = document.querySelectorAll('.tab-btn');
const roleCards  = document.querySelectorAll('.role-card');
const showMoreBtn = document.getElementById('showMoreBtn');
let showingAll   = false;
let currentFilter = 'all';

function applyFilter(filter) {
  currentFilter = filter;
  roleCards.forEach(card => {
    const cat     = card.dataset.category;
    const isExtra = card.classList.contains('extra-role');
    const matches = (filter === 'all' || cat === filter);
    card.classList.toggle('visible', matches && (!isExtra || showingAll));
  });
}

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    applyFilter(btn.dataset.filter);
  });
});

showMoreBtn.addEventListener('click', () => {
  showingAll = !showingAll;
  showMoreBtn.textContent = showingAll ? '− Show fewer roles' : '+ Show all 12 roles';
  showMoreBtn.setAttribute('aria-expanded', showingAll);
  applyFilter(currentFilter);
});

/* ── GITHUB LIVE REPOS ───────────────────────────── */
// NOTE: Replace 'Amrit004' with your actual GitHub username if different.
// The live fetch populates the #ghGrid section.
// If the API rate-limits (60 req/hr unauthenticated), the hardcoded
// fallback projects will display automatically.

const GH_USERNAME   = 'Amrit004';
const GH_API        = `https://api.github.com/users/${GH_USERNAME}/repos?per_page=100&sort=pushed`;
const ghGrid        = document.getElementById('ghGrid');
const ghSortBtns    = document.querySelectorAll('.gh-sort-btn');

const LANG_COLOURS = {
  JavaScript: '#f1e05a',
  Python:     '#3572A5',
  Java:       '#b07219',
  HTML:       '#e34c26',
  CSS:        '#563d7c',
  TypeScript: '#2b7489',
  'C#':       '#178600',
  Shell:      '#89e051',
  Kotlin:     '#F18E33',
  Swift:      '#F05138',
};

// Hardcoded fallback repos shown if API fails
const FALLBACK_REPOS = [
  { name: 'CipherOS',      description: 'Browser-based cryptographic toolkit — AES-256, SHA/MD5, JWT decoder, password analyser using Web Crypto API.', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Amrit004', fork: false, updated_at: new Date().toISOString() },
  { name: 'NetScan-Pro',   description: 'Network vulnerability scanner simulation — 4 scan modes, CVE database (Log4Shell, EternalBlue), OS fingerprinting.', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Amrit004', fork: false, updated_at: new Date().toISOString() },
  { name: 'Wandr',         description: 'AI-powered travel PWA with offline support, natural language queries and budget planning.', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Amrit004', fork: false, updated_at: new Date().toISOString() },
  { name: 'CodeFlow',      description: 'Full-stack Kanban project manager — JWT auth, drag-and-drop, multi-project support.', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Amrit004', fork: false, updated_at: new Date().toISOString() },
  { name: 'DevMetrics',    description: 'Real-time GitHub analytics dashboard — language charts, contribution heatmap, developer score.', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Amrit004', fork: false, updated_at: new Date().toISOString() },
  { name: 'SecureVault',   description: 'Cloud security SOC dashboard simulating AWS monitoring — live threat feed, IAM charts, compliance scoring.', language: 'JavaScript', stargazers_count: 0, forks_count: 0, html_url: 'https://github.com/Amrit004', fork: false, updated_at: new Date().toISOString() },
];

let allRepos     = [];
let sortMode     = 'pushed'; // 'pushed' | 'stars'

function relativeDate(iso) {
  const d   = new Date(iso);
  const now = new Date();
  const ms  = now - d;
  const days = Math.floor(ms / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function renderRepos(repos) {
  if (!repos.length) {
    ghGrid.innerHTML = '<div class="gh-error">No public repositories found.</div>';
    return;
  }
  ghGrid.innerHTML = repos.map(repo => {
    const langColour = LANG_COLOURS[repo.language] || '#8b949e';
    const langClass  = (repo.language || 'default').replace(/[^a-zA-Z]/g, '');
    return `
      <a class="gh-card fade-in" href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="${repo.name} on GitHub">
        <div class="gh-card-header">
          <span class="gh-repo-name">${repo.name}</span>
          ${repo.fork ? '<span class="gh-fork-badge">fork</span>' : ''}
        </div>
        <p class="gh-desc">${repo.description || 'No description provided.'}</p>
        <div class="gh-meta">
          ${repo.language ? `
            <span class="gh-lang">
              <span class="lang-dot" style="background:${langColour}" aria-hidden="true"></span>
              ${repo.language}
            </span>` : ''}
          <span class="gh-stat" title="Stars">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            ${repo.stargazers_count}
          </span>
          <span class="gh-stat" title="Forks">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M18 9a9 9 0 01-9 9"/></svg>
            ${repo.forks_count}
          </span>
          <span class="gh-updated">${relativeDate(repo.updated_at)}</span>
        </div>
      </a>`;
  }).join('');

  // Re-observe new cards for 3D reveal
  ghGrid.querySelectorAll('.fade-in').forEach(el => revealObserver.observe(el));
}

function sortRepos(repos, mode) {
  return [...repos].sort((a, b) =>
    mode === 'stars'
      ? b.stargazers_count - a.stargazers_count
      : new Date(b.updated_at) - new Date(a.updated_at)
  );
}

async function fetchGitHubRepos() {
  if (!ghGrid) return;

  ghGrid.innerHTML = `
    <div class="gh-loading">
      <div class="gh-spinner" role="status" aria-label="Loading repositories"></div>
      <p>Loading from GitHub…</p>
    </div>`;

  try {
    const res = await fetch(GH_API);
    if (!res.ok) throw new Error(`GitHub API: ${res.status}`);
    const data = await res.json();
    allRepos = data.filter(r => !r.fork); // exclude forks by default
    if (!allRepos.length) allRepos = data; // if all are forks, show them
    renderRepos(sortRepos(allRepos, sortMode));
  } catch (err) {
    console.warn('GitHub API unavailable, using fallback:', err.message);
    allRepos = FALLBACK_REPOS;
    renderRepos(sortRepos(allRepos, sortMode));
  }
}

// Sort button handlers
ghSortBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    ghSortBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    sortMode = btn.dataset.sort;
    renderRepos(sortRepos(allRepos, sortMode));
  });
});

fetchGitHubRepos();

/* ── ACCESSIBILITY PANEL ─────────────────────────── */
const a11yToggle = document.getElementById('a11yToggle');
const a11yPanel  = document.getElementById('a11yPanel');

a11yToggle.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = a11yPanel.classList.toggle('open');
  a11yToggle.setAttribute('aria-expanded', isOpen);
});

document.addEventListener('click', (e) => {
  if (!a11yToggle.contains(e.target) && !a11yPanel.contains(e.target)) {
    a11yPanel.classList.remove('open');
    a11yToggle.setAttribute('aria-expanded', 'false');
  }
});

document.getElementById('highContrastBtn').addEventListener('click', () => {
  document.body.classList.toggle('high-contrast');
});

let fontSize = 16;
document.getElementById('fontIncBtn').addEventListener('click', () => {
  fontSize = Math.min(fontSize + 1, 22);
  document.body.style.fontSize = fontSize + 'px';
});
document.getElementById('fontDecBtn').addEventListener('click', () => {
  fontSize = Math.max(fontSize - 1, 12);
  document.body.style.fontSize = fontSize + 'px';
});
document.getElementById('fontResetBtn').addEventListener('click', () => {
  fontSize = 16;
  document.body.style.fontSize = '';
});

/* ── ACTIVE NAV LINK HIGHLIGHT ───────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
