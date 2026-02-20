<script>
document.addEventListener("DOMContentLoaded", function () {

    /* ==============================
       ACCESSIBILITY CONTROLS
    ============================== */

    const a11yToggle = document.getElementById('a11yToggle');
    const a11yControls = document.getElementById('a11yControls');
    const highContrastBtn = document.getElementById('highContrastBtn');
    const increaseFontBtn = document.getElementById('increaseFontBtn');
    const decreaseFontBtn = document.getElementById('decreaseFontBtn');
    const resetFontBtn = document.getElementById('resetFontBtn');

    let fontSize = 100;

    if (a11yToggle && a11yControls) {
        a11yToggle.addEventListener('click', () => {
            a11yControls.classList.toggle('hidden');
            const isExpanded = !a11yControls.classList.contains('hidden');
            a11yToggle.setAttribute('aria-expanded', isExpanded);
        });
    }

    if (highContrastBtn) {
        highContrastBtn.addEventListener('click', () => {
            document.body.classList.toggle('high-contrast');
            const isPressed = document.body.classList.contains('high-contrast');
            highContrastBtn.setAttribute('aria-pressed', isPressed);
        });
    }

    if (increaseFontBtn) {
        increaseFontBtn.addEventListener('click', () => {
            fontSize = Math.min(fontSize + 10, 150);
            document.documentElement.style.fontSize = fontSize + '%';
        });
    }

    if (decreaseFontBtn) {
        decreaseFontBtn.addEventListener('click', () => {
            fontSize = Math.max(fontSize - 10, 80);
            document.documentElement.style.fontSize = fontSize + '%';
        });
    }

    if (resetFontBtn) {
        resetFontBtn.addEventListener('click', () => {
            fontSize = 100;
            document.documentElement.style.fontSize = '100%';
        });
    }

    /* ==============================
       SCROLL INDICATOR
    ============================== */

    window.addEventListener('scroll', () => {
        const scrollIndicator = document.getElementById('scrollIndicator');
        if (!scrollIndicator) return;

        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollPercent = (scrollTop / (documentHeight - windowHeight)) * 100;

        scrollIndicator.style.width = scrollPercent + '%';
        scrollIndicator.setAttribute('aria-valuenow', Math.round(scrollPercent));
    });

    /* ==============================
       SMOOTH SCROLL
    ============================== */

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    /* ==============================
       FETCH GITHUB REPOSITORIES
    ============================== */

    async function fetchGitHubRepos() {
        const username = "Amrit004";
        const container = document.getElementById("githubProjects");

        if (!container) return;

        try {
            const response = await fetch(
                `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
            );

            if (!response.ok) {
                throw new Error("GitHub API Error");
            }

            const repos = await response.json();

            if (!Array.isArray(repos) || repos.length === 0) {
                container.innerHTML =
                    "<p style='text-align:center;'>No public repositories found.</p>";
                return;
            }

            container.innerHTML = "";

            repos.forEach(repo => {
                const card = document.createElement("article");
                card.className = "github-card";
                card.setAttribute("role", "listitem");

                card.innerHTML = `
                    <h4>${repo.name}</h4>
                    <p style="color: var(--text-muted);">
                        ${repo.description || "No description provided."}
                    </p>

                    <div class="project-tags">
                        ${repo.language ? `<span class="tag">${repo.language}</span>` : ""}
                        <span class="tag">⭐ ${repo.stargazers_count}</span>
                        <span class="tag">🍴 ${repo.forks_count}</span>
                    </div>

                    <a href="${repo.html_url}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       style="display:inline-block;margin-top:1rem;color:var(--primary);font-weight:600;">
                       View Repository →
                    </a>
                `;

                container.appendChild(card);
            });

        } catch (error) {
            console.error("GitHub Fetch Error:", error);

            container.innerHTML = `
                <div style="text-align:center;padding:2rem;">
                    <p>Unable to load repositories.</p>
                    <a href="https://github.com/Amrit004" 
                       target="_blank" 
                       class="btn btn-primary">
                       Visit GitHub Profile
                    </a>
                </div>
            `;
        }
    }

    // Call GitHub Fetch
    fetchGitHubRepos();

    /* ==============================
       SCROLL ANIMATION
    ============================== */

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll("section").forEach(section => {
        section.style.opacity = "0";
        section.style.transform = "translateY(30px)";
        section.style.transition = "all 0.6s ease";
        observer.observe(section);
    });

});
</script>
