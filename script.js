/* ══════════════════════════════════════════════════
   APSK Portfolio — script.js
   Redesigned 2026
══════════════════════════════════════════════════ */

(function () {
    'use strict';

    /* ── Scroll Progress Bar ─────────────────────── */
    const scrollBar = document.getElementById('scrollBar');
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        const pct = total > 0 ? (scrolled / total) * 100 : 0;
        scrollBar.style.width = pct + '%';
        scrollBar.setAttribute('aria-valuenow', Math.round(pct));
    }, { passive: true });

    /* ── Smooth Scroll ───────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.setAttribute('tabindex', '-1');
            target.focus({ preventScroll: true });
            // close mobile nav if open
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    /* ── Mobile Hamburger Nav ────────────────────── */
    const hamburger = document.getElementById('hamburger');
    const navMenu   = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        const isOpen = navMenu.classList.toggle('open');
        hamburger.classList.toggle('open', isOpen);
        hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close nav on outside click
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('open');
            hamburger.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });

    /* ── Accessibility Panel ─────────────────────── */
    const a11yToggle    = document.getElementById('a11yToggle');
    const a11yControls  = document.getElementById('a11yControls');
    const highContrastBtn = document.getElementById('highContrastBtn');
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    const resetFontBtn    = document.getElementById('resetFontBtn');
    let fontSize = 100;

    a11yToggle.addEventListener('click', () => {
        const hidden = a11yControls.classList.toggle('hidden');
        a11yToggle.setAttribute('aria-expanded', String(!hidden));
    });

    highContrastBtn.addEventListener('click', () => {
        document.body.classList.toggle('high-contrast');
        const pressed = document.body.classList.contains('high-contrast');
        highContrastBtn.setAttribute('aria-pressed', String(pressed));
    });

    increaseFontBtn.addEventListener('click', () => {
        fontSize = Math.min(fontSize + 10, 150);
        document.documentElement.style.fontSize = fontSize + '%';
    });

    decreaseFontBtn.addEventListener('click', () => {
        fontSize = Math.max(fontSize - 10, 80);
        document.documentElement.style.fontSize = fontSize + '%';
    });

    resetFontBtn.addEventListener('click', () => {
        fontSize = 100;
        document.documentElement.style.fontSize = '100%';
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !a11yControls.classList.contains('hidden')) {
            a11yControls.classList.add('hidden');
            a11yToggle.setAttribute('aria-expanded', 'false');
            a11yToggle.focus();
        }
    });

    /* ── Intersection Observer — Fade In on Scroll ─ */
    const fadeEls = document.querySelectorAll(
        '.edu-card, .tl-card, .role-card, .proj-card, .skill-cat, .github-card, .ach-item'
    );

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    fadeEls.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    /* Also animate sections */
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity   = '0';
        section.style.transform = 'translateY(24px)';
        section.style.transition = 'opacity 0.55s ease, transform 0.55s ease';
        observer.observe(section);
    });
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0)';
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    document.querySelectorAll('section').forEach(s => sectionObserver.observe(s));

    /* ── Animate stat numbers (count-up) ─────────── */
    function animateNumber(el, target, isFloat) {
        const duration = 1400;
        const start    = performance.now();
        const isAWS    = el.dataset.val === 'AWS';
        if (isAWS) return; // Already text

        function step(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.querySelector('.ach-num').textContent =
                current + (el.dataset.plus ? '+' : '');
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    const achObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el  = entry.target;
                const val = el.dataset.val;
                const plus = el.dataset.plus;
                if (!val || isNaN(val)) return;
                animateNumber(el, parseInt(val), false);
                achObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.ach-item').forEach(item => {
        achObserver.observe(item);
    });

    /* ── Theme Toggle (Light / Dark) ─────────────── */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon   = themeToggle.querySelector('.theme-icon');

    function applyTheme(dark) {
        document.body.classList.toggle('dark', dark);
        themeIcon.textContent = dark ? '☀️' : '🌙';
        themeToggle.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
        try { localStorage.setItem('apsk-theme', dark ? 'dark' : 'light'); } catch(e) {}
    }

    // Load saved preference, default to light
    (function() {
        let saved = 'light';
        try { saved = localStorage.getItem('apsk-theme') || 'light'; } catch(e) {}
        applyTheme(saved === 'dark');
    })();

    themeToggle.addEventListener('click', () => {
        applyTheme(!document.body.classList.contains('dark'));
    });

    /* ── Role Category Tabs ──────────────────────── */
    const roleTabs = document.querySelectorAll('.rtab');
    const roleCards = document.querySelectorAll('#rolesGrid .role-card');

    roleTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            roleTabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
            tab.classList.add('active');
            tab.setAttribute('aria-selected', 'true');
            const cat = tab.dataset.cat;
            roleCards.forEach(card => {
                const cardCats = card.dataset.cat || '';
                if (cat === 'all' || cardCats.includes(cat)) {
                    card.classList.remove('hidden-cat');
                } else {
                    card.classList.add('hidden-cat');
                }
            });
        });
    });

    /* ── GitHub Repositories ─────────────────────── */
    async function fetchGitHubRepos() {
        const username = 'Amrit004';
        const container = document.getElementById('githubProjects');
        if (!container) return;

        function fetchWithTimeout(url, opts = {}, ms = 8000) {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), ms);
            return fetch(url, { ...opts, signal: controller.signal })
                   .finally(() => clearTimeout(timer));
        }

        try {
            const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`;
            let response;

            try {
                response = await fetchWithTimeout(apiUrl, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                });
            } catch {
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
                const pr = await fetchWithTimeout(proxyUrl, {}, 10000);
                if (!pr.ok) throw new Error('Network error. Both fetch methods failed.');
                const pd = await pr.json();
                response = { ok: true, json: async () => JSON.parse(pd.contents) };
            }

            if (response.status === 403) throw new Error('GitHub rate limit reached. Visit GitHub directly.');
            if (!response.ok && response.status)  throw new Error(`GitHub API error: ${response.status}`);

            let repos = await response.json();
            repos = repos.filter(r => !r.fork)
                         .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            if (repos.length === 0) {
                container.innerHTML = `<p style="grid-column:1/-1;text-align:center;color:var(--text-2)">
                    No public repos yet. <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color:var(--green)">Visit GitHub →</a>
                </p>`;
                return;
            }

            container.innerHTML = repos.map(repo => `
                <article class="github-card" role="listitem">
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:0.8rem;margin-bottom:0.7rem;">
                        <h4>${repo.name.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                        ${repo.language ? `<span class="tag" style="flex-shrink:0;font-size:0.65rem;">${repo.language}</span>` : ''}
                    </div>
                    <p>${repo.description || 'A project showcasing practical development skills.'}</p>
                    <div class="github-stats">
                        <span class="github-stat" aria-label="${repo.stargazers_count} stars">⭐ ${repo.stargazers_count}</span>
                        <span class="github-stat" aria-label="${repo.forks_count} forks">🍴 ${repo.forks_count}</span>
                        <span class="github-stat">📅 ${new Date(repo.updated_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                    </div>
                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer"
                       style="display:inline-flex;align-items:center;gap:0.4rem;margin-top:1rem;
                              color:var(--green);text-decoration:none;font-size:0.8rem;
                              font-family:var(--font-mono);border:1px solid var(--border-2);
                              padding:0.3rem 0.8rem;border-radius:6px;transition:all 0.2s;"
                       onmouseover="this.style.background='rgba(26,143,94,0.08)'"
                       onmouseout="this.style.background='transparent'">
                        View on GitHub →
                    </a>
                </article>
            `).join('');

            // Observe new cards for fade-in
            container.querySelectorAll('.github-card').forEach(card => {
                card.classList.add('fade-in');
                observer.observe(card);
            });

        } catch (err) {
            console.error('GitHub fetch error:', err);
            container.innerHTML = `
                <div style="grid-column:1/-1;text-align:center;padding:3rem;">
                    <p style="font-size:2rem;margin-bottom:0.8rem;">🔗</p>
                    <p style="color:var(--text-2);margin-bottom:0.5rem;">${err.message || 'Could not load repositories.'}</p>
                    <p style="color:var(--text-3);font-size:0.85rem;margin-bottom:1.5rem;">Browse all projects directly on GitHub.</p>
                    <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer"
                       style="display:inline-block;background:var(--green);color:var(--bg);
                              padding:0.7rem 1.8rem;border-radius:10px;text-decoration:none;
                              font-weight:700;font-size:0.9rem;">
                        Visit github.com/${username} →
                    </a>
                </div>`;
        }
    }

    if (document.readyState === 'complete') {
        fetchGitHubRepos();
    } else {
        window.addEventListener('load', fetchGitHubRepos);
    }

    /* ── Active Nav Link Highlighting ───────────── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('#mainNav a[href^="#"]');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                navLinks.forEach(a => a.removeAttribute('aria-current'));
                const active = document.querySelector(`#mainNav a[href="#${entry.target.id}"]`);
                if (active) active.setAttribute('aria-current', 'page');
            }
        });
    }, { threshold: 0.35 });
    sections.forEach(s => navObserver.observe(s));

    /* ── Download CV ─────────────────────────────── */
    window.downloadCV = function () {
        const cv = `AMRITPAL SINGH KAUR
MSc Advanced Computer Science Student

CONTACT
Email:     ap.singhkaur@gmail.com / sharysingh1144@gmail.com
Location:  London, United Kingdom
Portfolio: apskportofolio11.vercel.app
LinkedIn:  linkedin.com/in/amritpal-singh-kaur-b54b9a1b1
GitHub:    github.com/Amrit004

PROFESSIONAL SUMMARY
Multilingual Graduate Software Engineer (EN ES CA PA HI) with an MSc in Advanced Computer Science
at Queen Mary University of London (2026) and a BSc 2:1 from Staffordshire University. Enterprise IT
experience across regulated financial services (Bank of America), global travel technology (Amadeus)
and energy (ENI). Author of 18 public GitHub repositories spanning cloud security, cryptography,
AI-powered PWAs, full-stack applications and data analytics. Seeking graduate roles in software
engineering, cloud/DevOps, data, or cybersecurity.

PROFESSIONAL EXPERIENCE

Deployment / Breakfix Engineer — Bank of America
• Supported enterprise desktop systems in a secure, highly-regulated financial environment,
  ensuring compliance with industry standards.
• Diagnosed and resolved complex hardware and software issues, minimising downtime across
  multiple business units.
• Led large-scale deployment initiatives and asset management programmes supporting hundreds
  of end-users.
• Implemented security patches and system updates in line with financial industry regulations.

Field Support Technician (Level 2) — Amadeus Global Travel Technology
• Delivered secure laptop and mobile device replacements with enterprise application installations
  adhering to strict security protocols.
• Provided escalation support for complex technical issues, collaborating with cross-functional
  teams to resolve incidents efficiently.
• Maintained detailed documentation of system configurations and troubleshooting procedures.

IT Technician / Support — ENI Energy
• Provided frontline support for hardware, software and network connectivity, maintaining high
  system availability.
• Proactively monitored enterprise system uptime and documented technical procedures for the
  team knowledge base.

EDUCATION

MSc Advanced Computer Science — Queen Mary University of London (2025 – Present)
Modules: Cloud Computing, Machine Learning, Security & Auth, Functional Programming,
         Data Analytics, Research Project

BSc (Hons) Computer Science — 2:1 Honours, Staffordshire University (2022 – 2025)
Modules: Full-Stack Dev, Cloud Computing, AI, Cybersecurity, Mobile Dev, Databases,
         Networking, UX Design

TECHNICAL SKILLS

Programming:       Java, JavaScript (ES6+), TypeScript, Python, C# (.NET), HTML5, CSS3,
                   REST APIs, Functional Programming
Cloud & DevOps:    AWS (EC2, S3, Lambda, IAM, CloudWatch), Docker, Kubernetes (basics),
                   Linux/Unix, Windows Server, CI/CD
Security:          Network Security, IAM, AES-256 Encryption, JWT Auth, CVE Analysis,
                   Secure Design Patterns, FinTech Compliance
AI & Data:         Machine Learning, NLP, Statistical Analysis, Data Visualisation,
                   Predictive Modelling, Model Evaluation, AI Integration
Frameworks & Libs: Node.js, React, Express.js, NumPy, Pandas, Scikit-learn,
                   Matplotlib, Android SDK
Databases:         SQL, MySQL, PostgreSQL, SQLite, Database Design, ER Modelling,
                   Query Optimisation, Data Structures & Algorithms
Web & Mobile:      Progressive Web Apps, Service Workers, Android Development,
                   Responsive Design, WCAG Accessibility, Canvas API, UX/UI
Tools & Workflow:  Git & GitHub, VS Code, Android Studio, Figma, Agile/Scrum,
                   JIRA, Postman, Chrome DevTools, Vercel, Netlify

FEATURED PROJECTS

CipherOS — Cryptography Toolkit
Browser-based cryptographic toolkit with AES-256 encryption, SHA/MD5 hashing, JWT decoder,
password strength analyser and key generator using the Web Crypto API. Retro CRT terminal UI.

NetScan Pro — Network Vulnerability Scanner
Nmap/Nessus-style scanner simulation with 4 scan modes, CVE database of 12 vulnerabilities
(Log4Shell, EternalBlue), OS fingerprinting and professional security reports.

Wandr / AiTravel — AI Travel Planner PWA
Installable Progressive Web App with client-side AI matching engine, NLP query processing,
budget planning and full offline support via service workers. Cross-device responsive.

SecureVault — Cloud Security Dashboard
AWS SOC simulation with live threat feed, world threat map, IAM activity charts and compliance
scoring. Directly inspired by enterprise security workflows at Bank of America.

DevMetrics — GitHub Analytics Dashboard
Real-time GitHub REST API consumer with Canvas-based language charts, contribution heatmap,
repository metrics and a computed developer score algorithm (0–100).

CodeFlow — Full-Stack Project Management
Kanban board with JWT auth, drag-and-drop columns, multi-project support and activity
logging — built from scratch with no external UI frameworks.

LANGUAGES SPOKEN
English (Native) | Spanish (Native) | Catalan (Native) | Punjabi (Native) | Hindi (Professional)
`;
        const blob = new Blob([cv], { type: 'text/plain;charset=utf-8' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url;
        a.download = 'Amritpal_Singh_Kaur_CV.txt';
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };

})();

/* ══════════════════════════════════════════════════
   LIVE DEMO MODAL SYSTEM
══════════════════════════════════════════════════ */

(function () {
    'use strict';

    const DEMOS = {
        cipheros:    { title: '// CipherOS — Cryptography Toolkit',              fn: renderCipherOS    },
        netscan:     { title: '// NetScan Pro — Network Vulnerability Scanner',  fn: renderNetScan     },
        wandr:       { title: '// Wandr — AI Travel Planner PWA',                fn: renderWandr       },
        codeflow:    { title: '// CodeFlow — Kanban Project Manager',            fn: renderCodeFlow    },
        devmetrics:  { title: '// DevMetrics — GitHub Analytics Dashboard',      fn: renderDevMetrics  },
        securevault: { title: '// SecureVault — Cloud Security Dashboard',       fn: renderSecureVault }
    };

    let _svInterval = null;

    window.openDemo = function (key) {
        const demo = DEMOS[key];
        if (!demo) return;
        if (_svInterval) { clearInterval(_svInterval); _svInterval = null; }
        const modal = document.getElementById('demoModal');
        const title = document.getElementById('demoModalTitle');
        const body  = document.getElementById('demoModalBody');
        title.textContent = demo.title;
        body.innerHTML = '';
        demo.fn(body);
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeDemo = function () {
        document.getElementById('demoModal').style.display = 'none';
        document.body.style.overflow = '';
        if (_svInterval) { clearInterval(_svInterval); _svInterval = null; }
    };

    document.addEventListener('DOMContentLoaded', function () {
        const closeBtn = document.getElementById('demoModalClose');
        if (closeBtn) closeBtn.addEventListener('click', window.closeDemo);

        const modal = document.getElementById('demoModal');
        if (modal) {
            modal.addEventListener('click', function (e) {
                if (e.target === modal) window.closeDemo();
            });
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') window.closeDemo();
    });

    /* ════════════════════════════════════════════
       CIPHEROS — Cryptography Toolkit
    ════════════════════════════════════════════ */
    function renderCipherOS(container) {
        container.innerHTML = `
        <div class="cipher-terminal">
            <div class="cipher-chrome">
                <div class="demo-traffic-lights">
                    <span class="dtl dtl-r"></span>
                    <span class="dtl dtl-y"></span>
                    <span class="dtl dtl-g"></span>
                </div>
                <span class="cipher-chrome-title">CipherOS v2.1.0 — Web Crypto API</span>
            </div>
            <div class="cipher-tabs">
                <button class="ctab-btn active" data-mode="encrypt">🔒 AES-256 Encrypt</button>
                <button class="ctab-btn" data-mode="decrypt">🔓 AES Decrypt</button>
                <button class="ctab-btn" data-mode="hash">🔐 Hash (SHA/MD5)</button>
                <button class="ctab-btn" data-mode="jwt">🪪 JWT Decoder</button>
                <button class="ctab-btn" data-mode="keygen">🗝 Key Generator</button>
                <button class="ctab-btn" data-mode="strength">💪 Password Strength</button>
            </div>
            <div class="cipher-output" id="cipherOut"><span class="c-green">CipherOS v2.1.0</span> — Browser-based Cryptography Toolkit
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="c-yellow">⚡ Powered by the native Web Crypto API</span>
<span class="c-dim">All operations run client-side. Nothing leaves your browser.</span>

Select a tool above, enter input below, then press <span class="c-green">Run</span>.</div>
            <div class="cipher-input-row">
                <span class="cipher-prompt">cipher &gt;</span>
                <input type="text" id="cipherIn" placeholder="Enter text here..." autocomplete="off" spellcheck="false"/>
                <button class="cipher-run-btn" id="cipherRunBtn">Run ↵</button>
            </div>
        </div>`;

        let mode = 'encrypt';
        const out   = container.querySelector('#cipherOut');
        const input = container.querySelector('#cipherIn');
        const runBtn= container.querySelector('#cipherRunBtn');

        const placeholders = {
            encrypt:  'Enter plaintext to encrypt with AES-256-GCM...',
            decrypt:  'Decrypt not available without key — use Encrypt first',
            hash:     'Enter any text to hash with SHA-256 and SHA-1...',
            jwt:      'Paste a JWT token here (header.payload.signature)...',
            keygen:   'Press Run to generate a cryptographic key...',
            strength: 'Enter a password to analyse its strength...'
        };

        container.querySelectorAll('.ctab-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                container.querySelectorAll('.ctab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                mode = this.dataset.mode;
                input.placeholder = placeholders[mode] || '';
                out.innerHTML = `<span class="c-green">Mode: ${mode.toUpperCase()}</span> — Ready.\n<span class="c-dim">Enter input and press Run.</span>`;
            });
        });

        async function runCipher() {
            const val = input.value.trim();
            out.innerHTML = '<span class="c-yellow">⟳ Processing...</span>';
            try {
                if (mode === 'encrypt') {
                    if (!val) { out.innerHTML = '<span class="c-red">✗ Please enter some text to encrypt.</span>'; return; }
                    const enc = new TextEncoder();
                    const iv  = crypto.getRandomValues(new Uint8Array(12));
                    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt']);
                    const ct  = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(val));
                    const raw = await crypto.subtle.exportKey('raw', key);
                    const b64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
                    out.innerHTML = `<span class="c-green">✓ AES-256-GCM Encryption Complete</span>
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="c-yellow">Algorithm:</span>   <span class="c-white">AES-256-GCM (authenticated encryption)</span>
<span class="c-yellow">Input:</span>       <span class="c-white">${val.length} characters → ${enc.encode(val).length} bytes</span>

<span class="c-yellow">Ciphertext (Base64):</span>
<span class="c-white">${b64(ct)}</span>

<span class="c-yellow">IV (Base64):</span>   <span class="c-white">${b64(iv)}</span>
<span class="c-yellow">Key (Base64):</span>  <span class="c-white">${b64(raw).substring(0,44)}...</span>
<span class="c-dim">⚠ Key + IV required for decryption. Store securely.</span>`;
                } else if (mode === 'hash') {
                    if (!val) { out.innerHTML = '<span class="c-red">✗ Please enter some text to hash.</span>'; return; }
                    const enc = new TextEncoder();
                    const [b256, b1] = await Promise.all([
                        crypto.subtle.digest('SHA-256', enc.encode(val)),
                        crypto.subtle.digest('SHA-1',   enc.encode(val))
                    ]);
                    const hex = buf => Array.from(new Uint8Array(buf)).map(x => x.toString(16).padStart(2,'0')).join('');
                    out.innerHTML = `<span class="c-green">✓ Hashing Complete</span>
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="c-yellow">Input:</span>    <span class="c-white">"${val.substring(0,50)}${val.length>50?'...':''}"</span>
<span class="c-yellow">Length:</span>   <span class="c-white">${val.length} chars</span>

<span class="c-yellow">SHA-256 (256-bit):</span>
<span class="c-white">${hex(b256)}</span>

<span class="c-yellow">SHA-1 (160-bit):</span>
<span class="c-white">${hex(b1)}</span>
<span class="c-dim">Note: SHA-1 is deprecated for security use. Use SHA-256+.</span>`;
                } else if (mode === 'jwt') {
                    if (!val) { out.innerHTML = '<span class="c-red">✗ Please paste a JWT token.</span>'; return; }
                    const parts = val.split('.');
                    if (parts.length !== 3) { out.innerHTML = '<span class="c-red">✗ Invalid JWT — expected 3 dot-separated parts (header.payload.signature)</span>'; return; }
                    const decode = s => { try { return JSON.parse(atob(s.replace(/-/g,'+').replace(/_/g,'/'))); } catch { return null; } };
                    const header  = decode(parts[0]);
                    const payload = decode(parts[1]);
                    if (!header || !payload) { out.innerHTML = '<span class="c-red">✗ Could not decode JWT parts. Check the token is valid.</span>'; return; }
                    const exp = payload.exp ? new Date(payload.exp * 1000).toUTCString() : 'No expiry set';
                    const iat = payload.iat ? new Date(payload.iat * 1000).toUTCString() : 'Unknown';
                    const expired = payload.exp && Date.now() > payload.exp * 1000;
                    out.innerHTML = `<span class="c-green">✓ JWT Decoded</span>
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="c-yellow">Algorithm:</span>  <span class="c-white">${header.alg || 'unknown'}</span>
<span class="c-yellow">Type:</span>       <span class="c-white">${header.typ || 'JWT'}</span>
<span class="c-yellow">Issued:</span>     <span class="c-white">${iat}</span>
<span class="c-yellow">Expires:</span>    <span class="${expired?'c-red':'c-white'}">${exp}${expired?' ⚠ EXPIRED':''}</span>

<span class="c-yellow">Payload:</span>
<span class="c-white">${JSON.stringify(payload, null, 2)}</span>
<span class="c-dim">⚠ Signature not verified (client-side only)</span>`;
                } else if (mode === 'keygen') {
                    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt','decrypt']);
                    const raw = await crypto.subtle.exportKey('raw', key);
                    const hex = Array.from(new Uint8Array(raw)).map(x => x.toString(16).padStart(2,'0')).join('');
                    const b64 = btoa(String.fromCharCode(...new Uint8Array(raw)));
                    const iv  = crypto.getRandomValues(new Uint8Array(12));
                    const ivHex = Array.from(iv).map(x=>x.toString(16).padStart(2,'0')).join('');
                    out.innerHTML = `<span class="c-green">✓ Cryptographic Keys Generated</span>
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="c-yellow">AES-256 Key (hex):</span>
<span class="c-white">${hex}</span>

<span class="c-yellow">AES-256 Key (Base64):</span>
<span class="c-white">${b64}</span>

<span class="c-yellow">Random IV (96-bit / hex):</span>
<span class="c-white">${ivHex}</span>
<span class="c-dim">Algorithm: AES-GCM | Key size: 256 bits | IV size: 96 bits</span>
<span class="c-dim">Click Run again to generate a new key pair.</span>`;
                } else if (mode === 'strength') {
                    if (!val) { out.innerHTML = '<span class="c-red">✗ Please enter a password to analyse.</span>'; return; }
                    const checks = [
                        { pass: val.length >= 8,           label: 'Length ≥ 8 characters'       },
                        { pass: val.length >= 12,          label: 'Length ≥ 12 characters'      },
                        { pass: val.length >= 16,          label: 'Length ≥ 16 characters'      },
                        { pass: /[A-Z]/.test(val),         label: 'Contains uppercase letters'  },
                        { pass: /[a-z]/.test(val),         label: 'Contains lowercase letters'  },
                        { pass: /[0-9]/.test(val),         label: 'Contains digits'             },
                        { pass: /[^A-Za-z0-9]/.test(val), label: 'Contains special characters' },
                        { pass: !/(.)\1{2}/.test(val),     label: 'No repeated characters ×3'  }
                    ];
                    const score = checks.filter(c => c.pass).length;
                    const labels = ['','Very Weak','Weak','Fair','Moderate','Good','Strong','Strong','Excellent'];
                    const colours= ['','c-red','c-red','c-red','c-yellow','c-yellow','c-green','c-green','c-green'];
                    const bar = '█'.repeat(score) + '░'.repeat(8 - score);
                    out.innerHTML = `<span class="c-green">✓ Password Strength Analysis</span>
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
<span class="c-yellow">Strength:</span> <span class="${colours[score]}">${labels[score]}  [${bar}]  ${score}/8</span>
<span class="c-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
${checks.map(c => `<span class="${c.pass?'c-green':'c-red'}">${c.pass?'✓':'✗'} ${c.label}</span>`).join('\n')}`;
                } else {
                    out.innerHTML = '<span class="c-red">✗ Decrypt requires the original key — use AES-256 Encrypt first to generate one.</span>';
                }
            } catch (e) {
                out.innerHTML = `<span class="c-red">✗ Error: ${e.message}</span>`;
            }
        }

        runBtn.addEventListener('click', runCipher);
        input.addEventListener('keydown', e => { if (e.key === 'Enter') runCipher(); });
    }

    /* ════════════════════════════════════════════
       NETSCAN PRO — Network Vulnerability Scanner
    ════════════════════════════════════════════ */
    function renderNetScan(container) {
        const CVES = [
            { id:'CVE-2021-44228', name:'Log4Shell',          sev:'CRITICAL', score:10.0, port:8080, svc:'Apache Log4j'   },
            { id:'CVE-2017-0144',  name:'EternalBlue',        sev:'CRITICAL', score:9.8,  port:445,  svc:'SMBv1'          },
            { id:'CVE-2021-26855', name:'ProxyLogon',         sev:'CRITICAL', score:9.8,  port:443,  svc:'Exchange'       },
            { id:'CVE-2022-1388',  name:'F5 BIG-IP Bypass',   sev:'CRITICAL', score:9.8,  port:443,  svc:'BIG-IP'         },
            { id:'CVE-2021-21985', name:'vCenter RCE',        sev:'CRITICAL', score:9.8,  port:443,  svc:'VMware'         },
            { id:'CVE-2020-0796',  name:'SMBGhost',           sev:'CRITICAL', score:10.0, port:445,  svc:'SMBv3'          },
            { id:'CVE-2022-26134', name:'Confluence RCE',     sev:'CRITICAL', score:9.8,  port:8443, svc:'Confluence'     },
            { id:'CVE-2020-1472',  name:'Zerologon',          sev:'CRITICAL', score:10.0, port:389,  svc:'Netlogon'       },
            { id:'CVE-2021-40444', name:'MSHTML RCE',         sev:'HIGH',     score:8.8,  port:80,   svc:'IIS'            },
            { id:'CVE-2022-3786',  name:'OpenSSL X.509 BO',   sev:'HIGH',     score:7.5,  port:443,  svc:'OpenSSL'        },
            { id:'CVE-2021-41773', name:'Apache Path Trav.',  sev:'HIGH',     score:7.5,  port:80,   svc:'Apache HTTPd'   },
            { id:'CVE-2019-19781', name:'Citrix Shitrix',     sev:'CRITICAL', score:9.8,  port:443,  svc:'Citrix ADC'     }
        ];

        container.innerHTML = `
        <div class="netscan-wrap">
            <div class="ns-chrome">
                <div class="demo-traffic-lights">
                    <span class="dtl dtl-r"></span><span class="dtl dtl-y"></span><span class="dtl dtl-g"></span>
                </div>
                <span class="ns-title">NetScan Pro</span>
                <span class="ns-subtitle">Network Vulnerability Scanner v3.2 — CVE Database: ${CVES.length} entries</span>
            </div>
            <div class="ns-target-row">
                <span>Target:</span>
                <input type="text" id="nsTarget" value="192.168.1.0/24" spellcheck="false"/>
                <button class="ns-scan-btn" id="nsScanBtn">▶ Run Scan</button>
            </div>
            <div class="ns-controls">
                <button class="ns-btn active" data-mode="quick">⚡ Quick Scan</button>
                <button class="ns-btn" data-mode="full">🔍 Full Port Scan</button>
                <button class="ns-btn" data-mode="vuln">🛡 Vuln Scan</button>
                <button class="ns-btn" data-mode="stealth">👁 Stealth (-sS)</button>
            </div>
            <div class="ns-body" id="nsOut"><span class="ns-blue">NetScan Pro</span> — Nmap/Nessus-style Scanner
<span class="ns-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>
CVE database loaded: <span class="ns-white">${CVES.length} vulnerabilities</span>
Set target and scan mode, then click <span class="ns-yellow">Run Scan</span>.</div>
        </div>`;

        let scanMode = 'quick';
        const out    = container.querySelector('#nsOut');

        container.querySelectorAll('.ns-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                container.querySelectorAll('.ns-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                scanMode = this.dataset.mode;
            });
        });

        container.querySelector('#nsScanBtn').addEventListener('click', async function () {
            const target = container.querySelector('#nsTarget').value || '192.168.1.0/24';
            const PORTS = {
                quick:   [22, 80, 443, 445, 3389, 8080],
                full:    [21, 22, 23, 25, 53, 80, 110, 143, 443, 445, 3306, 3389, 5432, 6379, 8080, 8443],
                vuln:    [80, 443, 445, 8080, 8443, 389],
                stealth: [22, 80, 443]
            };
            const SVC = {22:'ssh',80:'http',443:'https',445:'smb',3389:'rdp',8080:'http-proxy',
                         21:'ftp',23:'telnet',25:'smtp',53:'dns',110:'pop3',143:'imap',
                         3306:'mysql',5432:'postgresql',6379:'redis',8443:'https-alt',389:'ldap'};
            const ports = PORTS[scanMode] || PORTS.quick;
            const hosts = ['192.168.1.1','192.168.1.10','192.168.1.25','192.168.1.50','192.168.1.100'];
            const typeLabel = {quick:'TCP Quick (-T4)',full:'TCP Full (-sV -A)',vuln:'Vuln Scan (--script vuln)',stealth:'SYN Stealth (-sS)'};

            out.textContent = '';
            const line = html => { out.innerHTML += html + '\n'; out.scrollTop = out.scrollHeight; };

            line(`<span class="ns-yellow">Starting ${scanMode.toUpperCase()} scan on ${target}...</span>`);
            line(`<span class="ns-dim">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</span>`);
            line(`<span class="ns-blue">Scan type:</span> <span class="ns-white">${typeLabel[scanMode]}</span>`);
            line(`<span class="ns-blue">Ports:</span>     <span class="ns-white">${ports.join(', ')}</span>\n`);

            for (const host of hosts) {
                await new Promise(r => setTimeout(r, 180));
                const open = ports.filter(() => Math.random() > 0.52);
                if (open.length === 0) {
                    line(`<span class="ns-dim">HOST ${host}  —  filtered / no open ports</span>`);
                } else {
                    line(`<span class="ns-green">HOST ${host}  —  ${open.length} open port(s)</span>`);
                    for (const p of open) {
                        line(`  <span class="ns-white">${String(p).padEnd(5)}/tcp</span>  open  <span class="ns-yellow">${SVC[p]||'unknown'}</span>`);
                    }
                }
            }

            if (scanMode === 'vuln' || scanMode === 'full') {
                await new Promise(r => setTimeout(r, 300));
                const found = CVES.filter(() => Math.random() > 0.55).slice(0, 5);
                line(`\n<span class="ns-dim">━━ VULNERABILITY REPORT ━━━━━━━━━━━━━━━━━━━</span>`);
                if (found.length) {
                    for (const v of found) {
                        const col = v.sev === 'CRITICAL' ? 'ns-red' : 'ns-yellow';
                        line(`<span class="${col}">⚠ ${v.id}</span>  <span class="ns-white">${v.name}</span>`);
                        line(`  <span class="ns-dim">Port: ${v.port}  |  Service: ${v.svc}  |  CVSS: ${v.score}  |  Severity: ${v.sev}</span>`);
                    }
                } else {
                    line(`<span class="ns-green">✓ No known CVEs detected on scanned surface.</span>`);
                }
            }

            line(`\n<span class="ns-green">✓ Scan complete</span> — <span class="ns-white">${hosts.length} hosts</span> | <span class="ns-white">${ports.length} ports/host</span> | Elapsed: ${(Math.random()*3+1).toFixed(2)}s`);
        });
    }

    /* ════════════════════════════════════════════
       WANDR — AI Travel Planner PWA
    ════════════════════════════════════════════ */
    function renderWandr(container) {
        const DESTS = [
            { emoji:'🗼', name:'Paris',        country:'France',      tags:['Culture','Food','Romance'],   budget:'£800–1,200/wk'  },
            { emoji:'🏯', name:'Kyoto',        country:'Japan',       tags:['History','Nature','Food'],    budget:'£900–1,400/wk'  },
            { emoji:'🌆', name:'New York',     country:'USA',         tags:['City','Art','Shopping'],      budget:'£1,200–2,000/wk'},
            { emoji:'🏖️', name:'Bali',         country:'Indonesia',   tags:['Beach','Wellness','Budget'],  budget:'£400–700/wk'    },
            { emoji:'🌃', name:'Barcelona',    country:'Spain',       tags:['Architecture','Food','City'], budget:'£600–1,000/wk'  },
            { emoji:'🏔️', name:'Banff',        country:'Canada',      tags:['Nature','Adventure','Hiking'],budget:'£700–1,100/wk'  },
            { emoji:'🕌', name:'Istanbul',     country:'Turkey',      tags:['Culture','History','Food'],   budget:'£450–750/wk'    },
            { emoji:'🌅', name:'Santorini',    country:'Greece',      tags:['Romance','Beach','Views'],    budget:'£900–1,500/wk'  },
            { emoji:'🦁', name:'Nairobi',      country:'Kenya',       tags:['Safari','Nature','Adventure'],budget:'£800–1,300/wk'  },
            { emoji:'🏙️', name:'Singapore',    country:'Singapore',   tags:['City','Food','Modern'],       budget:'£1,000–1,600/wk'},
            { emoji:'🎭', name:'Edinburgh',    country:'Scotland',    tags:['Culture','History','City'],   budget:'£550–900/wk'    },
            { emoji:'🌊', name:'Lisbon',       country:'Portugal',    tags:['Food','Beach','Budget'],      budget:'£450–750/wk'    }
        ];

        container.innerHTML = `
        <div class="wandr-wrap">
            <div class="wandr-header">
                <span class="wandr-logo">✈ Wandr</span>
                <span class="wandr-badge">AI Travel Planner</span>
                <span class="wandr-badge">PWA · Offline-Ready</span>
                <span class="wandr-badge" style="margin-left:auto;color:#4caf50;border-color:rgba(76,175,80,0.3);background:rgba(76,175,80,0.1)">🟢 Live</span>
            </div>
            <div class="wandr-body">
                <div class="wandr-search">
                    <span style="color:#607d8b;font-size:0.9rem">🔍</span>
                    <input type="text" id="wandrQ" placeholder="Search by destination, country or vibe (e.g. 'beach', 'food')..." />
                    <button class="wandr-sbtn" id="wandrSearchBtn">Search</button>
                </div>
                <div class="wandr-filters" id="wandrFilters">
                    <span class="wf-chip active" data-tag="All">All</span>
                    <span class="wf-chip" data-tag="Beach">🏖 Beach</span>
                    <span class="wf-chip" data-tag="Culture">🏛 Culture</span>
                    <span class="wf-chip" data-tag="Adventure">🏔 Adventure</span>
                    <span class="wf-chip" data-tag="Food">🍜 Food</span>
                    <span class="wf-chip" data-tag="Budget">💰 Budget</span>
                    <span class="wf-chip" data-tag="Romance">💕 Romance</span>
                    <span class="wf-chip" data-tag="City">🌆 City</span>
                    <span class="wf-chip" data-tag="Nature">🌿 Nature</span>
                </div>
                <div class="wandr-results" id="wandrResults"></div>
            </div>
        </div>`;

        let activeTag = 'All';

        function renderCards() {
            const q   = (container.querySelector('#wandrQ').value || '').toLowerCase();
            const res = container.querySelector('#wandrResults');
            const filtered = DESTS.filter(d => {
                const mQ = !q || d.name.toLowerCase().includes(q) || d.country.toLowerCase().includes(q) || d.tags.some(t => t.toLowerCase().includes(q));
                const mT = activeTag === 'All' || d.tags.includes(activeTag);
                return mQ && mT;
            });
            if (!filtered.length) {
                res.innerHTML = '<div class="wandr-empty">No destinations match — try a different search or filter.</div>';
            } else {
                res.innerHTML = filtered.map(d => `
                    <div class="wr-card">
                        <div class="wr-emoji">${d.emoji}</div>
                        <div class="wr-name">${d.name}</div>
                        <div class="wr-country">${d.country}</div>
                        <div class="wr-tags">${d.tags.map(t=>`<span class="wr-tag">${t}</span>`).join('')}</div>
                        <div class="wr-budget">💷 ${d.budget}</div>
                    </div>`).join('');
            }
        }

        container.querySelectorAll('.wf-chip').forEach(chip => {
            chip.addEventListener('click', function () {
                container.querySelectorAll('.wf-chip').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
                activeTag = this.dataset.tag;
                renderCards();
            });
        });

        container.querySelector('#wandrSearchBtn').addEventListener('click', renderCards);
        container.querySelector('#wandrQ').addEventListener('input', renderCards);
        container.querySelector('#wandrQ').addEventListener('keydown', e => { if (e.key === 'Enter') renderCards(); });

        renderCards();
    }

    /* ════════════════════════════════════════════
       CODEFLOW — Kanban Project Manager
    ════════════════════════════════════════════ */
    function renderCodeFlow(container) {
        const COLS = [
            {
                id: 'backlog', label: '📋 Backlog',
                cards: [
                    { title: 'Implement OAuth2 login',       tags:['Auth','Backend'],   p:'pm' },
                    { title: 'Add dark mode toggle',         tags:['Frontend','UI'],    p:'pl' },
                    { title: 'Fix CORS on API gateway',      tags:['Bug','Critical'],   p:'ph' },
                    { title: 'Write API documentation',      tags:['Docs'],             p:'pl' }
                ]
            },
            {
                id: 'progress', label: '🔄 In Progress',
                cards: [
                    { title: 'Deploy to AWS Lambda',         tags:['Cloud','DevOps'],   p:'ph' },
                    { title: 'Write unit tests for parser',  tags:['Testing','QA'],     p:'pm' }
                ]
            },
            {
                id: 'review', label: '👀 In Review',
                cards: [
                    { title: 'Refactor auth middleware',     tags:['Refactor'],         p:'pm' }
                ]
            },
            {
                id: 'done', label: '✅ Done',
                cards: [
                    { title: 'Set up CI/CD pipeline',        tags:['DevOps'],           p:'pl' },
                    { title: 'Database schema design',       tags:['DB','Architecture'],p:'pl' },
                    { title: 'Project kickoff meeting',      tags:['Management'],       p:'pl' }
                ]
            }
        ];

        const colsHTML = COLS.map(col => `
            <div class="cf-col" id="cfcol-${col.id}" data-col="${col.id}">
                <div class="cf-col-head">${col.label} <span class="cf-count" id="cfcount-${col.id}">${col.cards.length}</span></div>
                ${col.cards.map(card => `
                    <div class="cf-card ${card.p}" draggable="true" data-col="${col.id}">
                        <div class="cf-card-title">${card.title}</div>
                        ${card.tags.map(t=>`<span class="cf-tag">${t}</span>`).join('')}
                    </div>`).join('')}
                <button class="cf-add" data-col="${col.id}">+ Add task</button>
            </div>`).join('');

        container.innerHTML = `
        <div class="codeflow-wrap">
            <div class="cf-header">
                <span class="cf-logo">⬡ CodeFlow</span>
                <span class="cf-meta"><div class="cf-avatar">AP</div> Amritpal's Workspace</span>
            </div>
            <div class="cf-body">${colsHTML}</div>
        </div>`;

        // Drag and drop
        let dragged = null;
        container.addEventListener('dragstart', e => {
            if (e.target.classList.contains('cf-card')) { dragged = e.target; e.target.style.opacity = '0.4'; }
        });
        container.addEventListener('dragend', e => {
            if (e.target.classList.contains('cf-card')) e.target.style.opacity = '1';
            dragged = null;
        });
        container.addEventListener('dragover', e => e.preventDefault());
        container.addEventListener('drop', e => {
            e.preventDefault();
            if (!dragged) return;
            const col = e.target.closest('.cf-col');
            if (!col || col === dragged.closest('.cf-col')) return;
            const addBtn = col.querySelector('.cf-add');
            const newColId = col.dataset.col;
            const oldColId = dragged.dataset.col;
            dragged.dataset.col = newColId;
            col.insertBefore(dragged, addBtn);
            updateCount(oldColId);
            updateCount(newColId);
        });

        function updateCount(colId) {
            const col = container.querySelector(`#cfcol-${colId}`);
            const cnt = container.querySelector(`#cfcount-${colId}`);
            if (col && cnt) cnt.textContent = col.querySelectorAll('.cf-card').length;
        }

        container.querySelectorAll('.cf-add').forEach(btn => {
            btn.addEventListener('click', function () {
                const colId = this.dataset.col;
                const title = prompt('New task title:');
                if (!title || !title.trim()) return;
                const card = document.createElement('div');
                card.className = 'cf-card pl';
                card.draggable = true;
                card.dataset.col = colId;
                card.innerHTML = `<div class="cf-card-title">${title.trim()}</div><span class="cf-tag">New</span>`;
                this.parentElement.insertBefore(card, this);
                updateCount(colId);
            });
        });
    }

    /* ════════════════════════════════════════════
       DEVMETRICS — GitHub Analytics Dashboard
    ════════════════════════════════════════════ */
    function renderDevMetrics(container) {
        const langs = [
            { name:'JavaScript', color:'#f1e05a', pct:38 },
            { name:'Python',     color:'#3572A5', pct:24 },
            { name:'Java',       color:'#b07219', pct:18 },
            { name:'TypeScript', color:'#2b7489', pct:10 },
            { name:'CSS',        color:'#563d7c', pct:6  },
            { name:'Other',      color:'#6e7681', pct:4  }
        ];
        const stats = [
            ['Public Repos','18'],['Total Stars','52'],['Total Forks','27'],
            ['Followers','34'],['Following','31'],['Gists','5']
        ];

        // Generate heatmap cells
        const cells = Array.from({length: 91}, () => {
            const v = Math.random();
            const c = v < 0.45 ? '#161b22' : v < 0.65 ? '#0e4429' : v < 0.80 ? '#006d32' : v < 0.92 ? '#26a641' : '#39d353';
            return `<div class="dm-cell" style="background:${c}" title="${Math.random()>0.45?Math.floor(Math.random()*8)+1:0} contributions"></div>`;
        }).join('');

        container.innerHTML = `
        <div class="devmetrics-wrap">
            <div class="dm-header">
                <div>
                    <div class="dm-title">📊 DevMetrics — github.com/Amrit004</div>
                    <div class="dm-sub">Real-time GitHub Analytics · Canvas-based visualisation</div>
                </div>
                <div class="dm-score">Developer Score: 84 / 100</div>
            </div>
            <div class="dm-grid">
                <div class="dm-card">
                    <div class="dm-card-title">Top Languages</div>
                    ${langs.map(l=>`
                    <div class="dm-lang-row">
                        <div class="dm-lang-bar" style="width:${l.pct * 2}px;background:${l.color}"></div>
                        <span class="dm-lang-label">${l.name} — ${l.pct}%</span>
                    </div>`).join('')}
                </div>
                <div class="dm-card">
                    <div class="dm-card-title">Repository Statistics</div>
                    ${stats.map(([k,v])=>`
                    <div class="dm-stat-row">
                        <span class="dm-stat-key">${k}</span>
                        <span class="dm-stat-val">${v}</span>
                    </div>`).join('')}
                </div>
            </div>
            <div class="dm-card">
                <div class="dm-heat-title">Contribution Heatmap — Last 13 weeks</div>
                <div class="dm-heatmap">${cells}</div>
            </div>
        </div>`;
    }

    /* ════════════════════════════════════════════
       SECUREVAULT — Cloud Security Dashboard
    ════════════════════════════════════════════ */
    function renderSecureVault(container) {
        const THREATS_INIT = [
            { type:'SSH Brute Force',       ip:'185.220.101.47', geo:'RU', sev:'HIGH',     time:'2m ago'  },
            { type:'SQL Injection Attempt', ip:'103.234.180.2',  geo:'CN', sev:'CRITICAL', time:'1m ago'  },
            { type:'S3 Bucket Traversal',   ip:'52.91.212.69',   geo:'US', sev:'HIGH',     time:'45s ago' },
            { type:'Port Scan Detected',    ip:'45.33.32.156',   geo:'DE', sev:'MED',      time:'30s ago' },
            { type:'IAM Login Failure ×5',  ip:'196.18.204.10',  geo:'ZA', sev:'MED',      time:'12s ago' }
        ];
        const REGIONS = [
            { name:'us-east-1',       status:'healthy',  latency:'12ms' },
            { name:'eu-west-1',       status:'healthy',  latency:'8ms'  },
            { name:'ap-southeast-1',  status:'degraded', latency:'38ms' },
            { name:'us-west-2',       status:'healthy',  latency:'15ms' }
        ];

        function sevColor(s)  { return s==='CRITICAL'?'#ef4444':s==='HIGH'?'#f97316':'#eab308'; }
        function sevBg(s)     { return s==='CRITICAL'?'rgba(239,68,68,0.12)':s==='HIGH'?'rgba(249,115,22,0.12)':'rgba(234,179,8,0.12)'; }
        function threatHTML(t) {
            const c = sevColor(t.sev);
            return `<div class="sv-threat" style="border-left-color:${c};animation:fadeInNew 0.3s ease">
                <div class="sv-threat-top">
                    <span class="sv-threat-name">${t.type}</span>
                    <span class="sv-threat-sev" style="color:${c}">${t.sev}</span>
                </div>
                <div class="sv-threat-meta">${t.ip} [${t.geo}] — ${t.time}</div>
            </div>`;
        }

        container.innerHTML = `
        <div class="securevault-wrap">
            <div class="sv-chrome">
                <div class="demo-traffic-lights">
                    <span class="dtl dtl-r"></span><span class="dtl dtl-y"></span><span class="dtl dtl-g"></span>
                </div>
                <span class="sv-title">🛡 SecureVault</span>
                <span class="sv-subtitle">AWS SOC Simulation — Inspired by Bank of America workflows</span>
                <span class="sv-live">● LIVE FEED</span>
            </div>
            <div class="sv-body">
                <div class="sv-panel">
                    <div class="sv-panel-title">Live Threat Feed</div>
                    <div id="svFeed">${THREATS_INIT.map(threatHTML).join('')}</div>
                </div>
                <div class="sv-panel">
                    <div class="sv-panel-title">AWS Region Health</div>
                    ${REGIONS.map(r => {
                        const c = r.status==='healthy'?'#22c55e':'#f97316';
                        const icon = r.status==='healthy'?'●':'⚠';
                        return `<div class="sv-region-row">
                            <span class="sv-region-name">${r.name}</span>
                            <span style="color:${c};font-size:0.7rem">${icon} ${r.status}</span>
                            <span class="sv-region-lat">${r.latency}</span>
                        </div>`;
                    }).join('')}
                    <div class="sv-mini-card" style="margin-top:0.6rem">
                        <div class="sv-mini-label">Compliance Score</div>
                        <div class="sv-mini-num" style="color:#22c55e">94%</div>
                        <div class="sv-mini-sub">SOC2 · ISO 27001 · GDPR</div>
                        <div class="sv-tags">
                            <span class="sv-tag" style="background:#14532d;color:#4ade80">IAM ✓</span>
                            <span class="sv-tag" style="background:#14532d;color:#4ade80">MFA ✓</span>
                            <span class="sv-tag" style="background:#14532d;color:#4ade80">Encryption ✓</span>
                            <span class="sv-tag" style="background:#78350f;color:#fb923c">Logging ⚠</span>
                        </div>
                    </div>
                    <div class="sv-mini-card" style="margin-top:0.6rem">
                        <div class="sv-mini-label">Threats Blocked Today</div>
                        <div class="sv-mini-num" style="color:#0ea5e9" id="svBlockCount">1,247</div>
                        <div class="sv-mini-sub">↑ 12% vs yesterday</div>
                    </div>
                </div>
            </div>
        </div>`;

        // Live threat feed auto-update
        const NEW_TYPES = ['WAF Rule Triggered','RDP Probe','DNS Exfil Attempt','XSS Attempt',
                           'Credential Stuffing','EC2 Metadata Access','S3 Public ACL Change'];
        const NEW_IPS   = ['52.12.44.210','91.108.4.200','140.82.121.4','35.180.1.57','104.21.10.3'];
        const NEW_GEOS  = ['US','GB','RU','CN','DE','FR','BR','IN'];
        const SEVS      = ['CRITICAL','HIGH','HIGH','MED','MED'];

        let blockCount = 1247;

        _svInterval = setInterval(() => {
            const feed = container.querySelector('#svFeed');
            const cnt  = container.querySelector('#svBlockCount');
            if (!feed || !container.isConnected) { clearInterval(_svInterval); return; }

            const sev = SEVS[Math.floor(Math.random() * SEVS.length)];
            const t = {
                type: NEW_TYPES[Math.floor(Math.random() * NEW_TYPES.length)],
                ip:   NEW_IPS[Math.floor(Math.random() * NEW_IPS.length)],
                geo:  NEW_GEOS[Math.floor(Math.random() * NEW_GEOS.length)],
                sev,
                time: 'just now'
            };
            feed.insertAdjacentHTML('afterbegin', threatHTML(t));
            if (feed.children.length > 7) feed.removeChild(feed.lastChild);

            blockCount += Math.floor(Math.random() * 4) + 1;
            if (cnt) cnt.textContent = blockCount.toLocaleString();
        }, 3200);
    }

})();
