        // Hamburger Menu
        const navHamburger = document.getElementById('navHamburger');
        const navMenu = document.getElementById('navMenu');

        navHamburger.addEventListener('click', () => {
            const isOpen = navMenu.classList.toggle('nav-open');
            navHamburger.classList.toggle('open', isOpen);
            navHamburger.setAttribute('aria-expanded', isOpen);
        });

        // Close menu when a nav link is clicked
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('nav-open');
                navHamburger.classList.remove('open');
                navHamburger.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!navHamburger.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('nav-open');
                navHamburger.classList.remove('open');
                navHamburger.setAttribute('aria-expanded', 'false');
            }
        });

        // Accessibility Controls
        const a11yToggle = document.getElementById('a11yToggle');
        const a11yControls = document.getElementById('a11yControls');
        const highContrastBtn = document.getElementById('highContrastBtn');
        const increaseFontBtn = document.getElementById('increaseFontBtn');
        const decreaseFontBtn = document.getElementById('decreaseFontBtn');
        const resetFontBtn = document.getElementById('resetFontBtn');

        let fontSize = 100;

        a11yToggle.addEventListener('click', () => {
            a11yControls.classList.toggle('hidden');
            const isExpanded = !a11yControls.classList.contains('hidden');
            a11yToggle.setAttribute('aria-expanded', isExpanded);
        });

        highContrastBtn.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isPressed = document.body.classList.contains('high-contrast');
            highContrastBtn.setAttribute('aria-pressed', isPressed);
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

        // Scroll Indicator
        window.addEventListener('scroll', () => {
            const scrollIndicator = document.getElementById('scrollIndicator');
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;
            scrollIndicator.style.width = scrollPercent + '%';
            scrollIndicator.setAttribute('aria-valuenow', Math.round(scrollPercent));
        });

        // Smooth Scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    target.setAttribute('tabindex', '-1');
                    target.focus();
                }
            });
        });

        // Fetch GitHub Repositories
        async function fetchGitHubRepos() {
            const username = 'Amrit004';
            const projectsContainer = document.getElementById('githubProjects');

            // Helper: fetch with timeout
            function fetchWithTimeout(url, options = {}, ms = 8000) {
                const controller = new AbortController();
                const timer = setTimeout(() => controller.abort(), ms);
                return fetch(url, { ...options, signal: controller.signal })
                    .finally(() => clearTimeout(timer));
            }

            try {
                const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=owner`;

                let response;
                try {
                    // Primary: direct GitHub API (works in most browsers — GitHub allows CORS)
                    response = await fetchWithTimeout(apiUrl, {
                        headers: {
                            'Accept': 'application/vnd.github.v3+json',
                            'X-GitHub-Api-Version': '2022-11-28'
                        }
                    });
                } catch (primaryErr) {
                    // Fallback: use a simple JSON proxy that reliably works
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;
                    const proxyResponse = await fetchWithTimeout(proxyUrl, {}, 10000);
                    if (!proxyResponse.ok) throw new Error('Both fetch methods failed');
                    const proxyData = await proxyResponse.json();
                    // allorigins wraps the response in { contents: "..." }
                    response = { ok: true, json: async () => JSON.parse(proxyData.contents) };
                }

                if (!response.ok && response.status !== undefined) {
                    if (response.status === 403) throw new Error('GitHub rate limit reached. Please visit GitHub directly.');
                    throw new Error(`GitHub API error: ${response.status}`);
                }

                let repos = await response.json();

                // Filter forks, sort by updated date
                repos = repos.filter(r => !r.fork)
                             .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

                if (repos.length === 0) {
                    projectsContainer.innerHTML = `
                        <p style="text-align:center;color:var(--text-muted);font-size:1.1rem;grid-column:1/-1;">
                            No public repositories found yet. <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color:var(--primary)">Visit GitHub profile →</a>
                        </p>`;
                    return;
                }

                projectsContainer.innerHTML = repos.map(repo => `
                    <article class="github-card" role="listitem">
                        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:0.8rem;">
                            <h4 style="margin:0">${repo.name.replace(/-/g, ' ').replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h4>
                            ${repo.language ? `<span class="tag" style="flex-shrink:0;font-size:0.78rem">${repo.language}</span>` : ''}
                        </div>
                        <p style="color:var(--text-muted);margin-bottom:1rem;font-size:0.95rem;line-height:1.6;">${repo.description || 'A project showcasing practical development skills.'}</p>
                        <div class="github-stats">
                            <div class="github-stat" aria-label="${repo.stargazers_count} stars">
                                <span aria-hidden="true">⭐</span>
                                <span>${repo.stargazers_count}</span>
                            </div>
                            <div class="github-stat" aria-label="${repo.forks_count} forks">
                                <span aria-hidden="true">🍴</span>
                                <span>${repo.forks_count}</span>
                            </div>
                            <div class="github-stat" aria-label="Updated ${new Date(repo.updated_at).toLocaleDateString('en-GB')}">
                                <span aria-hidden="true">📅</span>
                                <span>${new Date(repo.updated_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                            </div>
                        </div>
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" 
                           style="display:inline-flex;align-items:center;gap:0.4rem;margin-top:1.2rem;color:var(--primary);text-decoration:none;font-weight:600;font-size:0.95rem;border:1px solid var(--primary);padding:0.4rem 1rem;border-radius:8px;transition:all 0.2s;"
                           onmouseover="this.style.background='rgba(16,185,129,0.1)'" 
                           onmouseout="this.style.background='transparent'">
                            View on GitHub <span aria-hidden="true">→</span>
                        </a>
                    </article>
                `).join('');

            } catch (error) {
                console.error('GitHub fetch error:', error);
                projectsContainer.innerHTML = `
                    <div style="text-align:center;padding:3rem;grid-column:1/-1;">
                        <p style="font-size:2.5rem;margin-bottom:1rem;">🔗</p>
                        <p style="color:var(--text-muted);font-size:1.1rem;margin-bottom:0.5rem;">${error.message || 'Could not load repositories automatically.'}</p>
                        <p style="color:var(--text-muted);font-size:0.95rem;margin-bottom:2rem;">You can browse all projects directly on GitHub.</p>
                        <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="display:inline-block;">
                            Visit github.com/${username} →
                        </a>
                    </div>
                `;
            }
        }

        // Load repos after page fully loads
        if (document.readyState === 'complete') {
            fetchGitHubRepos();
        } else {
            window.addEventListener('load', fetchGitHubRepos);
        }

        // Download CV Function
        function downloadCV() {
            const cvContent = `AMRITPAL SINGH KAUR (APSK)
Software Engineer & Cloud Computing Specialist

CONTACT INFORMATION
Email: Sharysingh1144@gmail.com
Phone: 07722145765
Location: London, United Kingdom
GitHub: github.com/Amrit004
LinkedIn: linkedin.com/in/amritpal-singh-kaur-b54b9a1b1

PROFESSIONAL SUMMARY
Graduate Computer Science professional and MSc Advanced Computer Science student at Queen Mary University of London. Strong expertise in cloud computing, machine learning, cybersecurity, and full-stack development. Proven experience in enterprise IT environments within regulated financial sectors. Passionate about building scalable, mission-critical systems.

EDUCATION

MSc Advanced Computer Science
Queen Mary University of London (2025-2026) - In Progress
Specializations: Cloud Computing, Machine Learning, Security & Authentication, Functional Programming, Data Analytics, Research

BSc (Hons) Computer Science - Second Class Honours (Upper Division) 2:1
Staffordshire University (September 2022 - May 2025)
360 Credits (180 ECTS) | 12 Modules Completed

Key Areas: Enterprise Cloud & Distributed Systems, Web & AI, UX Design, Mobile Development, 
Databases, Networking & Cybersecurity, Server-Side Programming

PROFESSIONAL EXPERIENCE

Bank of America - Deployment / Breakfix Engineer
• Provided critical support for enterprise systems in secure financial environment
• Diagnosed and resolved complex hardware/software issues
• Led large-scale deployment initiatives and asset management programs
• Implemented security patches in compliance with regulations

Amadeus - Field Support Technician (Level 2)
• Delivered secure device replacements in global travel tech environment
• Performed advanced system configurations and installations
• Provided escalation support for complex issues
• Maintained comprehensive technical documentation

ENI - IT Technician / Support
• Delivered frontline support for enterprise systems
• Monitored and maintained system uptime
• Created troubleshooting guides and procedures
• Assisted with infrastructure maintenance

TECHNICAL SKILLS

Programming: Java, JavaScript (Node.js, React), C#, Python, HTML5, CSS3, REST APIs
Cloud & DevOps: AWS (EC2, S3, Lambda, IAM), Docker, Microservices, Kubernetes, Linux/Unix
Databases: SQL, MySQL, PostgreSQL, Database Design, Data Structures, Algorithms
AI & ML: Machine Learning, NLP, NumPy, Pandas, Scikit-learn, Predictive Analytics
Security: Network Security, Cybersecurity, Authentication, IAM, Encryption
Web & Mobile: PWA, Android, Responsive Design, UX/UI, Accessibility
Tools: Git/GitHub, VS Code, Android Studio, Figma, Agile/Scrum, CI/CD

LANGUAGES
English (Native / Bilingual), Spanish (Native), Catalan (Native), Punjabi (Native), Hindi (Professional)
`;
            
            const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'Amritpal_Singh_Kaur_APSK_CV.txt';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        }

        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all sections
        document.querySelectorAll('section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });

        // Keyboard navigation improvements
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !a11yControls.classList.contains('hidden')) {
                a11yControls.classList.add('hidden');
                a11yToggle.setAttribute('aria-expanded', 'false');
                a11yToggle.focus();
            }
        });
