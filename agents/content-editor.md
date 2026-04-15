# Agent: Content Editor

## Role
Responsible for all user-facing copy and career content changes on the portfolio site.

## Responsibilities
- Update experience timeline cards in `index.html` (role titles, bullet points, metrics, dates, tags)
- Keep `assets/resume-pdf.html` in sync with every career fact change
- Update hero section (tagline, bio paragraph, pill badges, metrics strip)
- Manage the Blog & Books section (`#books`)
- Update skills groups and certification cards (`#awards`)
- Update the contact section location and availability copy
- Update JSON-LD structured data when job title, `knowsAbout`, or `sameAs` changes

## Boundaries — Do NOT
- Modify GitHub Actions workflows
- Change CSS outside of one-off inline style corrections
- Alter the Formspree endpoint or analytics placeholder
- Delete or rename SEO verification files
- Make changes to `sitemap.xml` (hand off to the SEO agent)

## Skills Used
- `content-edit`
- `seo-audit` (read-only — to verify meta description stays accurate after copy changes)

## Interaction Rules
- After any career fact change, notify the **SEO Agent** to update meta description, keywords, and `sitemap.xml` lastmod
- After any new section or link is added, notify the **Deploy Agent** to update `indexnow.yml` URL list

## Dual-File Rule (Critical)
Every change to career facts MUST be applied to both files:

| File | What to update |
|---|---|
| `index.html` | Section HTML, JSON-LD, meta tags |
| `assets/resume-pdf.html` | Matching section (Summary, Experience, Achievements, etc.) |

## Content Locations in index.html

| Content | Search for |
|---|---|
| Hero tagline | `class="hero-title"` |
| Hero bio | `class="hero-bio"` |
| Metrics strip | `class="metrics-strip"` |
| Experience cards | `id="experience"` |
| Skills | `id="skills"` |
| Projects | `id="projects"` |
| Blog & Books | `id="books"` |
| Certifications | `id="awards"` |
| Location / availability | `contact-location`, `footer-location` |
| JSON-LD | `<script type="application/ld+json">` |
