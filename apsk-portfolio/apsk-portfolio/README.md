# APSK Portfolio — Amritpal Singh Kaur

A top-tier, dark-themed personal portfolio for a Graduate Software Engineer.  
Redesigned from the ground up based on expert feedback — mobile-first, fully accessible, no frameworks required.

---

## 📁 File Structure

```
apsk-portfolio/
├── index.html      ← Main HTML (all content + structure)
├── styles.css      ← All CSS (dark theme, animations, responsive)
├── script.js       ← All JavaScript (interactivity, GitHub API)
├── favicon.svg     ← Browser tab icon (teal "AK" on dark background)
└── README.md       ← This file
```

---

## 🚀 Getting Started

### Local preview
Just open `index.html` in any modern browser — no build step, no dependencies.

### Deploy to Vercel (recommended)
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
3. Vercel auto-detects a static site — click **Deploy**
4. Your site is live at `https://your-repo.vercel.app`

### Deploy to GitHub Pages
1. Push to GitHub
2. Go to repo **Settings → Pages → Source: main branch / root**
3. Live at `https://yourusername.github.io/apsk-portfolio`

---

## ✅ Improvements Made (Gemini Feedback)

| # | Feedback Item | What Was Done |
|---|---|---|
| 1 | Roles section too long (12+) | Tab filter system: All / Software Engineering / Cloud & Security / Data & AI / Other. Top 7 shown by default with "Show all 12" toggle |
| 2 | GitHub repos showing "Loading…" | Robust GitHub API fetch with full error handling + hardcoded fallback projects. All 6 main projects hardcoded with ↗ Demo + Code buttons |
| 3 | Unclear availability timeline | Prominent orange badge: "Seeking Graduate Roles · Available Summer 2026" in hero |
| 4 | Experience section buried | Professional Experience now section #2 (right after hero), leading with the "Golden Ticket" (BofA/Amadeus/ENI) |
| 5 | Multilingual skills underused | Mentioned in hero bio + dedicated highlighted block in Skills section with flags |
| 6 | Email looks unprofessional | Updated to `amritpalsinghkaur@outlook.com` — see **Customisation** below |
| 7 | Content hierarchy | Order: Hero → Experience → Education → Roles → Projects → GitHub → Skills → Contact |
| 8 | No favicon | `favicon.svg` included |

---

## ✏️ Customisation

### 1. Update your email
In `index.html`, find every instance of:
```
amritpalsinghkaur@outlook.com
```
Replace with your actual professional email address.

### 2. Add real project links
In `index.html`, search for comments like:
```html
<!-- UPDATE: replace href with actual live demo and repo URLs -->
```
Replace the `href="https://github.com/Amrit004"` placeholder with real URLs for each project's demo and GitHub repo.

### 3. Update GitHub username
In `script.js`, line 3:
```js
const GH_USERNAME = 'Amrit004';
```
Change to your exact GitHub username if it differs.

### 4. Update phone number
Search for `07722 145 765` / `+447722145765` and replace across `index.html`.

### 5. Change accent colour
In `styles.css`, `:root` block — change `--accent: #63d4b0;` to any hex colour you prefer. The gradient will update automatically.

### 6. Add a profile photo
Inside the `.hero-card` in `index.html`, you can add:
```html
<img src="your-photo.jpg" alt="Amritpal Singh Kaur" 
     style="width:100%;border-radius:12px;margin-bottom:1.5rem;object-fit:cover;">
```
Place this before the `.stats-grid` div.

---

## 🎨 Design System

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#080b10` | Page background |
| `--surface` | `#0d1117` | Cards, nav |
| `--surface2` | `#141b24` | Chip backgrounds |
| `--accent` | `#63d4b0` | Teal — primary accent |
| `--accent2` | `#f97316` | Orange — availability badge |
| `--accent3` | `#818cf8` | Indigo — current items, languages |
| `--font-display` | Syne | Headings, logo |
| `--font-body` | DM Sans | Body text, nav |
| `--font-mono` | JetBrains Mono | Labels, chips, code |

---

## ♿ Accessibility Features

- Skip to main content link
- ARIA labels on all interactive elements
- Keyboard-navigable mobile menu (closes on Escape)
- High contrast toggle
- Font size increase / decrease / reset
- `role` attributes on lists and regions
- Animated scroll progress bar
- All images have `aria-hidden="true"` (decorative) or descriptive `alt`/`aria-label`

---

## 📱 Responsive Breakpoints

| Breakpoint | Behaviour |
|---|---|
| `> 1024px` | Two-column hero (content + stats card) |
| `768px – 1024px` | Single-column hero, two-column education |
| `< 768px` | Full mobile: hamburger nav, single-column everything |

---

## 🛠 Tech Stack

- **HTML5** — semantic, accessible markup
- **CSS3** — custom properties, Grid, Flexbox, `clamp()`, animations
- **Vanilla JavaScript** — no frameworks, no build tools
- **Google Fonts** — Syne + DM Sans + JetBrains Mono
- **GitHub REST API** — live repo feed with `IntersectionObserver` lazy-animation

---

## 📄 Licence

Personal portfolio — all rights reserved by Amritpal Singh Kaur.  
Feel free to use the code structure as inspiration for your own portfolio.
