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
