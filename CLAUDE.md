# CLAUDE.md — Tommy Hoang Portfolio Site

## Project Summary

Static personal portfolio and resume site hosted on GitHub Pages at `https://thoangdev.github.io/`.
Built with plain HTML/CSS/JS (Bootstrap 5, Font Awesome 6). No build system, no framework.

The site serves as the primary professional presence for Tommy Hoang:
- QA Tech Lead · Agentic AI QA Engineer · Senior Quality Engineer
- Founder of Aperca LLC and QA Vibe App (qavibeapp.com)
- Open to relocation: Chicago IL, Dallas TX, Salt Lake City UT

---

## Repository Structure

```
thoangdev.github.io/
├── index.html                  # Main SPA (~1 500 lines) — single source of truth for all content
├── 404.html                    # Custom error page
├── robots.txt                  # Crawler directives
├── sitemap.xml                 # XML sitemap (homepage + resume-pdf)
├── 8f3a7d2c9b4e1056.txt        # IndexNow key verification file (do NOT delete or rename)
├── google5e85760eebc133b5.html # Google Search Console verification (do NOT delete)
├── assets/
│   ├── resume-pdf.html         # Printable/downloadable resume (standalone HTML)
│   ├── pdf-generator.html      # PDF generation utility
│   ├── profile.jpg             # Headshot used in hero and OG image
│   └── logos/                  # Employer company logos (PNG)
├── css/
│   ├── styles.css              # Main stylesheet (~12 500 lines, includes Bootstrap)
│   └── theme.css               # Custom design tokens and component overrides
├── js/
│   ├── scripts-optimized.js    # Nav spy, smooth scrolling, drawer, reveal effects
│   ├── contact-form.js         # Contact form validation + Formspree submit flow
│   ├── pdf-generator.js        # Resume access guard + popup/print helper
│   └── resume-print.js         # Printable resume auto-print behavior
├── tests/
│   ├── *.test.js               # Node built-in unit, integration, and smoke tests
│   └── helpers/                # DOM fakes for browserless tests
├── .github/
│   └── workflows/
│       ├── test.yml            # Run test suite on push, PR, and manual dispatch
│       ├── deploy.yml          # Build + secret injection + GitHub Pages deploy
│       └── indexnow.yml        # Ping IndexNow/Bing after every push to main
├── CLAUDE.md                   # ← you are here
├── README.MD
└── SEO_GUIDE.md
```

---

## Core Architecture

### Content Model
All user-facing content lives in **`index.html`** as semantic HTML. There is no CMS, no templating engine, and no database. Every update — experience, skills, projects, certifications — is a direct HTML edit.

**Key sections (by anchor ID):**
| ID | Content |
|---|---|
| `#about` | Hero / intro |
| `#experience` | Timeline of 6 roles |
| `#skills` | Grouped skill tags |
| `#projects` | Featured + secondary project cards |
| `#books` | Blog (QA Vibe App) + published book |
| `#testimonials` | Colleague quotes |
| `#interests` | Leadership & impact prose |
| `#awards` | Certifications + achievement cards |
| `#contact-form` | Formspree contact form |

### Resume
`assets/resume-pdf.html` is a **standalone** print-optimised HTML file. It mirrors `index.html` content but is formatted for Letter-size PDF output. Changes to career facts must be applied to **both** files.

### CI/CD
Three GitHub Actions workflows support the site:
1. **`test.yml`** — runs the Node built-in test suite on push, pull request, and manual dispatch.
2. **`deploy.yml`** — waits for successful `CI Tests` runs on `main`, injects the `GA_MEASUREMENT_ID` secret (replaces `__GA_MEASUREMENT_ID__` placeholder), then deploys to GitHub Pages.
3. **`indexnow.yml`** — bulk-submits all section URLs to `api.indexnow.org` and `www.bing.com/indexnow`.

### Testing
- Test runner: Node's built-in `node:test`; no npm dependencies or package manifest.
- Scope: unit tests for pure helpers, integration-style tests for DOM-driven behavior, and smoke tests served over a local static HTTP server.
- Main test command (PowerShell): `$files = Get-ChildItem "tests" -Recurse -Filter *.test.js | ForEach-Object { $_.FullName }; node --test $files`
- Main test command (bash / CI): `mapfile -t files < <(find tests -type f -name '*.test.js' | sort); node --test "${files[@]}"`
- Current critical-path coverage includes navigation state, bottom drawer behavior, smooth scrolling, reveal observers, contact form validation/submission, PDF generator access logic, and printable resume auto-print behavior.

### Analytics
Google Analytics ID is stored as a GitHub Actions secret (`GA_MEASUREMENT_ID`). The placeholder `__GA_MEASUREMENT_ID__` in `index.html` is replaced at deploy time. It is **never** hardcoded in source.

### Contact Form
Powered by Formspree (`https://formspree.io/f/xnjljodd`). Endpoint is hardcoded — it is safe to expose (public-facing form). The JS handler in `index.html` guards against the `__FORMSPREE` placeholder being un-replaced.

### SEO Infrastructure
- JSON-LD structured data: `Person`, `WebSite`, `ProfilePage`, `Organization`, `Book`
- Meta: title, description, keywords, OG, Twitter, geo tags
- `robots.txt` → allows all, disallows `index-backup.html`
- `sitemap.xml` → homepage + resume-pdf, `lastmod: 2026-04-15`
- IndexNow key: `8f3a7d2c9b4e1056`

---

## Coding Standards

### HTML
- All sections use `<section>` with `id`, `aria-labelledby`, and `role` where appropriate
- Images require `alt` text; decorative icons use `aria-hidden="true"`
- No inline styles except for one-off micro-adjustments already in place
- `<abbr title="required">` for required field indicators in forms

### CSS
- Custom properties (CSS variables) defined at `:root` in `theme.css`
- Component styles go in `theme.css`; global/Bootstrap overrides go in `styles.css`
- New sections get their own clearly labelled block (`/* === SECTION NAME === */`)
- Responsive breakpoints: `860px` (two-col → one-col), `768px` (tablet), `540px` (mobile form)

### JavaScript
- Vanilla JS only — no frameworks or npm dependencies
- Runtime JS is split across `scripts-optimized.js`, `contact-form.js`, `pdf-generator.js`, and `resume-print.js`; analytics remains inline in `index.html`
- Prefer `document.getElementById` over `querySelector` for perf-critical paths
- No `console.log` left in production code
- Browser modules may expose CommonJS exports for Node-based tests, but must still auto-initialize in the browser without bundling

### Naming Conventions
- CSS classes: kebab-case (`contact-form-wrap`, `book-cover--blog`)
- BEM-style modifiers with `--` for variants (`form-status--success`)
- Section IDs: lowercase, hyphenated (`contact-form`, not `contactForm`)

---

## Agent Behaviour Rules

1. **Read before writing.** Always read the relevant file section before making changes.
2. **Dual-file rule.** Career facts (experience, achievements, location, skills) must be updated in both `index.html` AND `assets/resume-pdf.html`.
3. **Sitemap lastmod.** After any content change, update `sitemap.xml` `<lastmod>` to the current date.
4. **JSON-LD sync.** If `knowsAbout`, `sameAs`, or job title changes in prose, update the JSON-LD block too.
5. **No breaking SEO files.** Never delete or rename `8f3a7d2c9b4e1056.txt` or `google5e85760eebc133b5.html`.
6. **No hardcoded GA ID.** The `GA_MEASUREMENT_ID` stays as a placeholder; the secret is injected by CI.
7. **Minimal diffs.** Change only what is necessary. Do not reformat unchanged code.
8. **IndexNow key.** If new pages are added, include their URLs in both URL lists in `indexnow.yml`.
9. **Run tests after JS changes.** For changes to `js/`, `assets/pdf-generator.html`, or interaction-heavy HTML, run the Node test suite before finishing.

---

## Tool / Skill Usage Guidelines

| Task | Skill / Tool |
|---|---|
| Update career content | `content-edit` skill — edit `index.html` + `resume-pdf.html` |
| Add new section | `content-edit` + `seo-audit` to verify meta and JSON-LD |
| SEO improvements | `seo-audit` skill |
| Submit URLs to search engines | `indexnow-submit` skill or trigger `indexnow.yml` |
| Validate JS / interaction changes | Run the Node test suite from `tests/` |
| Deploy to production | `deploy` command (push to `main` triggers `deploy.yml`) |
| Validate HTML structure | `validate-seo` command |
| Update sitemap | Edit `sitemap.xml` directly; update `<lastmod>` |

---

## Key Constraints

- **No npm, no build step.** The site is deployed as raw files. Do not introduce a package.json or bundler.
- **No server-side logic.** Everything must work as static files.
- **Bootstrap 5 is embedded in `styles.css`.** Do not add a CDN link for Bootstrap — it is already bundled.
- **Font Awesome 6 is loaded via CDN** in `index.html` `<head>`. Use existing icon classes.
- **GitHub Pages source must be `GitHub Actions`** (not branch deploy) for `deploy.yml` to work.
