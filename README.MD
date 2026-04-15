
# Tommy Hoang — Professional Portfolio

[![Website](https://img.shields.io/badge/Website-thoangdev.github.io-blue)](https://thoangdev.github.io/)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-tommyqhoang-blue)](https://linkedin.com/in/tommyqhoang)
[![GitHub](https://img.shields.io/badge/GitHub-thoangdev-black)](https://github.com/thoangdev)
[![Aperca LLC](https://img.shields.io/badge/Company-Aperca%20LLC-green)](https://apercallc.com)
[![QA Vibe App](https://img.shields.io/badge/Blog-QA%20Vibe%20App-orange)](https://www.qavibeapp.com)
[![Tests](https://github.com/thoangdev/thoangdev.github.io/actions/workflows/test.yml/badge.svg)](https://github.com/thoangdev/thoangdev.github.io/actions/workflows/test.yml)
[![Deploy](https://github.com/thoangdev/thoangdev.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/thoangdev/thoangdev.github.io/actions/workflows/deploy.yml)
[![IndexNow](https://github.com/thoangdev/thoangdev.github.io/actions/workflows/indexnow.yml/badge.svg)](https://github.com/thoangdev/thoangdev.github.io/actions/workflows/indexnow.yml)

## About Tommy Hoang

**QA Tech Lead · Agentic AI QA Engineer · Senior Quality Engineer · Security & Compliance Testing**

Professional portfolio showcasing **9+ years** of experience in quality engineering, agentic AI QA orchestration, security & compliance testing, mobile development, and entrepreneurship.

### 🚀 Professional Highlights

- **QA Tech Lead & Agentic AI QA Pioneer** — built end-to-end agentic AI QA orchestration platforms with multi-agent test generation, self-healing selectors, and autonomous defect triage
- **Security & Compliance QA** — PCI DSS, SOC 2, HIPAA audit readiness; OWASP ZAP integrated in CI/CD; AT&T DirecTV fraud-payment QA
- **Performance Engineering** — K6/Grafana/InfluxDB; reduced backend p95 latency by **35%**, cut test suite execution time by **60%**
- **API Quality** — lifted API test coverage from 65% → **92%** at Cognizant; automated RCA reduced root-cause time by **40%**
- **Founder of Aperca LLC** — mobile apps and browser extensions with **10K+ downloads** and **4.8★ average rating**
- **Published Author** — *We Will Find a Place to Sleep Tonight* (Hurricane Katrina memoir)
- **Founder of QA Vibe App** — [qavibeapp.com](https://www.qavibeapp.com) — QA engineering blog covering AI-powered testing, Playwright/K6/Robot Framework tutorials, and developer gear reviews
- **Current Role**: QA Tech Lead at Aperca LLC (2023 – Present) | Senior QA Engineer at Dispel (Jun 2025 – Present)

### 📁 Repository Structure

```
thoangdev.github.io/
├── index.html                  # Main SPA portfolio (1 300+ lines)
├── assets/
│   ├── resume-pdf.html         # Downloadable resume (top-1% optimised)
│   ├── resume-pdf.html         # PDF-ready resume
│   ├── logos/                  # Company / brand logos
│   └── pdf-generator.html      # PDF generation helper
├── css/
│   ├── styles.css              # Main stylesheet
│   └── theme.css               # Theme overrides
├── js/
│   ├── scripts-optimized.js    # Navigation, drawer, smooth scroll, reveal logic
│   ├── contact-form.js         # Contact form validation and submit handling
│   └── pdf-generator.js        # Resume PDF access and print helper
├── tests/
│   ├── *.test.js               # Node-based unit, integration, and smoke tests
│   └── helpers/                # Lightweight DOM test fakes
├── 8f3a7d2c9b4e1056.txt        # IndexNow key verification file
├── google5e85760eebc133b5.html # Google Search Console verification
├── sitemap.xml                 # XML sitemap (homepage + resume-pdf)
├── robots.txt                  # Crawler directives
├── 404.html                    # Custom error page
└── .github/
    └── workflows/
    ├── test.yml            # CI test runner for push / PR / manual
        ├── deploy.yml          # Build → inject secrets → deploy to Pages
        └── indexnow.yml        # Ping Google/Bing/Yandex via IndexNow API
```

### Test Strategy

- **Unit tests** cover pure client-side helpers such as email validation, active nav state mapping, swipe thresholds, and PDF filename generation.
- **Integration-style tests** cover DOM-driven behavior such as contact form submit states, analytics calls, drawer open/close flows, smooth scrolling, and reveal observers.
- **Smoke tests** start a local static HTTP server and verify the real HTML pages and extracted runtime scripts are served with the expected critical elements.

### Running Tests

**PowerShell (Windows):**

```powershell
$files = Get-ChildItem "tests" -Recurse -Filter *.test.js | ForEach-Object { $_.FullName }
node --test $files
```

**Bash (macOS / Linux / GitHub Actions):**

```bash
mapfile -t files < <(find tests -type f -name '*.test.js' | sort)
node --test "${files[@]}"
```

### 🛠 Technical Expertise

**9 years across:**
Aperca LLC · Dispel · Cognizant · DXC Technology · insightsoftware · Dialexa (IBM) · Accruent (Fortive)

| Domain | Tools & Skills |
|---|---|
| **Test Automation** | Robot Framework, Playwright, Selenium, Cypress, Appium |
| **Agentic AI QA** | LangChain, CrewAI, OpenAI API, multi-agent orchestration, self-healing selectors |
| **Performance Testing** | K6, JMeter, NeoLoad, Grafana, InfluxDB |
| **Security & Compliance** | OWASP ZAP, PCI DSS, SOC 2, HIPAA, DevSecOps |
| **Audit & Governance** | Compliance Audit, Risk-Based Testing, Release Gate Governance, Defect Trend Reporting |
| **DevOps / CI-CD** | Docker, GitHub Actions, Jenkins, AWS |
| **Programming** | Python, JavaScript, Java, C# |
| **Databases** | PostgreSQL, MySQL |
| **Monitoring** | Grafana, InfluxDB, PostHog, Tuskr |

### 📱 Aperca LLC Products

**Mobile Applications:** WealthTrackr · Oz and Inches · Date Night Decider · Fastcarb

**Browser Extensions:** PinNote · Tab Resource Monitor · MarkUpShot · Clipboard+ · DailySync

### ✍️ QA Vibe App — Blog

**[qavibeapp.com](https://www.qavibeapp.com)** — A modern learning hub for QA engineers and automation testers who want to level up with AI-powered testing workflows.

- Real-world, step-by-step tutorials: Playwright, K6, Robot Framework, OWASP ZAP
- AI-powered QA workflows: Claude, OpenAI Codex, LLM-generated test cases
- Career growth content for breaking into QA or advancing in tech
- Tech unboxings and honest reviews of developer tools and gear

### 🏆 Key Metrics

| Metric | Value |
|---|---|
| Manual test reduction | 70% |
| Production bug escapes | 0 |
| API test coverage (peak) | 92% |
| Test development speed | 60% faster |
| App downloads | 10K+ |
| Years QA experience | 9+ |

### ⚙️ CI/CD & SEO Infrastructure

#### Test Workflow (`.github/workflows/test.yml`)
- Triggers on push to `main`, every pull request, and `workflow_dispatch`
- Uses Node's built-in test runner; no npm install or package.json required
- Runs unit, integration-style, and local static smoke tests from the `tests/` directory

#### Deploy Workflow (`.github/workflows/deploy.yml`)
- Triggers after the `CI Tests` workflow succeeds on pushes to `main`, plus `workflow_dispatch`
- Injects `GA_MEASUREMENT_ID` secret at build time via `sed` substitution (replaces `__GA_MEASUREMENT_ID__` placeholder in `index.html`)
- Deploys via official `actions/deploy-pages` to GitHub Pages
- Concurrency guard prevents overlapping deployments
- Checks out the tested commit SHA so the deployed artifact matches the validated revision

**Required secret:** `GA_MEASUREMENT_ID` → your Google Analytics 4 Measurement ID (e.g. `G-XXXXXXXXXX`)

**Setup:**
1. Repo **Settings → Pages → Source** → set to **GitHub Actions**
2. **Settings → Secrets → Actions → New secret**: `GA_MEASUREMENT_ID` = `<your GA4 ID>`

#### IndexNow Workflow (`.github/workflows/indexnow.yml`)
- Triggers on push to `main`, weekly schedule (Mondays 06:00 UTC), and `workflow_dispatch`
- Bulk-submits 8 URLs via JSON POST to `api.indexnow.org` (relays to Google, Bing, Yandex, Seznam, Naver)
- Also directly pings `www.bing.com/indexnow`
- IndexNow key: `8f3a7d2c9b4e1056` (verification file at site root)

### 📄 Certifications

- CompTIA Security+
- AWS Certified Cloud Practitioner
- Google Cybersecurity Certificate
- Google Project Management
- Professional Scrum Master (Scrum.org)

### 📬 Contact

| | |
|---|---|
| Email | hoangtommyquoc@gmail.com |
| Phone | (504) 453-8178 |
| LinkedIn | [linkedin.com/in/tommyqhoang](https://linkedin.com/in/tommyqhoang) |
| GitHub | [github.com/thoangdev](https://github.com/thoangdev) |
| Location | New Orleans, LA — Remote |

---

*Last updated: April 15, 2026*