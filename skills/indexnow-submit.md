# Skill: indexnow-submit

## Purpose
Submit URLs to search engines via the IndexNow protocol to trigger fast re-crawling after content updates.

## When to Use
- After deploying content changes to production
- When a new section or page is added
- Manually when a deploy workflow did not fire (e.g., workflow_dispatch)

## IndexNow Key
`8f3a7d2c9b4e1056`
Key verification file: `8f3a7d2c9b4e1056.txt` at site root.

## Endpoints
| Engine | URL |
|---|---|
| Multi-engine (Google/Bing/Yandex/etc.) | `https://api.indexnow.org/indexnow` |
| Bing direct | `https://www.bing.com/indexnow` |

## Automated Submission
Handled by `.github/workflows/indexnow.yml` on every push to `main` and weekly.
No manual steps needed for routine deploys.

## Manual Submission (if needed)
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "thoangdev.github.io",
    "key": "8f3a7d2c9b4e1056",
    "keyLocation": "https://thoangdev.github.io/8f3a7d2c9b4e1056.txt",
    "urlList": [
      "https://thoangdev.github.io/",
      "https://thoangdev.github.io/assets/resume-pdf.html"
    ]
  }'
```

## Adding a New Page
1. Add the full URL to the `urlList` array in **both** POST steps in `indexnow.yml`
2. Add a `<url>` entry in `sitemap.xml`
3. Document the page in `CLAUDE.md` repository structure table

## Constraints
- Only submit URLs that are publicly accessible (return HTTP 200)
- Maximum 10 000 URLs per request (well under limit for this site)
- Do not submit the same URL more than once per second
- Do not submit `404.html` or verification files

## Safety
- IndexNow submission failures (4xx/5xx from the endpoint) are non-fatal — search engines will re-crawl on their own schedule
- Never include the key value in a URL submitted to a third party
