# Skill: seo-audit

## Purpose
Verify that all SEO signals in `index.html` are accurate, complete, and consistent with the current career content — without making changes unless instructed.

## When to Use
- After any content update to validate meta tags still accurately describe the page
- Before a new deploy to catch missing or stale SEO fields
- When reviewing keyword targeting for a new job market or role type

## Input
- Current content of `index.html` (relevant `<head>` block and JSON-LD)
- Optional: target role types and location keywords to check against

## Output
A checklist report covering:
1. `<title>` — accurate, ≤60 chars, includes primary role keyword
2. `<meta name="description">` — accurate, 140–160 chars, includes name + role
3. `<meta name="keywords">` — covers all role types, skills, locations
4. Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) — all populated
5. Twitter Card (`twitter:title`, `twitter:description`, `twitter:image`) — all populated
6. Geo tags (`geo.region`, `geo.placename`, `ICBM`) — accurate
7. JSON-LD `Person.jobTitle` — matches hero tagline
8. JSON-LD `Person.knowsAbout` — covers all skill groups
9. JSON-LD `Person.sameAs` — includes all active profiles and sites
10. JSON-LD `ProfilePage.dateModified` — matches `sitemap.xml` `<lastmod>`
11. `sitemap.xml` `<lastmod>` — is today's date or deploy date

## Constraints
- Read-only unless explicitly asked to apply fixes
- Do not rewrite meta content — report gaps and suggest corrections only
- Do not evaluate content quality (that is the Content Editor's role)

## Safety
- Never modify `8f3a7d2c9b4e1056.txt` or `google5e85760eebc133b5.html`
- Never change `robots.txt` `Disallow` rules without explicit approval
