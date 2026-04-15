# Command: ping-indexnow

## Purpose
Manually trigger search engine re-crawl of all portfolio URLs via IndexNow without waiting for the automated workflow.

## When to Use
- Content was updated but a deploy did not trigger `indexnow.yml`
- Testing that the IndexNow key and verification file are working
- After a large content overhaul to accelerate re-indexing

## IndexNow Key
`8f3a7d2c9b4e1056`

## Option A: Trigger via GitHub Actions (preferred)
```bash
# Requires GitHub CLI (gh)
gh workflow run indexnow.yml --repo thoangdev/thoangdev.github.io
```
Then watch: `https://github.com/thoangdev/thoangdev.github.io/actions`

## Option B: Manual curl — all engines via api.indexnow.org
```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "thoangdev.github.io",
    "key": "8f3a7d2c9b4e1056",
    "keyLocation": "https://thoangdev.github.io/8f3a7d2c9b4e1056.txt",
    "urlList": [
      "https://thoangdev.github.io/",
      "https://thoangdev.github.io/#about",
      "https://thoangdev.github.io/#experience",
      "https://thoangdev.github.io/#skills",
      "https://thoangdev.github.io/#projects",
      "https://thoangdev.github.io/#books",
      "https://thoangdev.github.io/#awards",
      "https://thoangdev.github.io/#contact-form",
      "https://thoangdev.github.io/assets/resume-pdf.html"
    ]
  }'
```
Expected HTTP response: `200 OK`

## Option C: Manual curl — Bing direct
```bash
curl -s -w "\nHTTP %{http_code}\n" -X POST "https://www.bing.com/indexnow" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "thoangdev.github.io",
    "key": "8f3a7d2c9b4e1056",
    "keyLocation": "https://thoangdev.github.io/8f3a7d2c9b4e1056.txt",
    "urlList": [
      "https://thoangdev.github.io/",
      "https://thoangdev.github.io/#experience",
      "https://thoangdev.github.io/#skills",
      "https://thoangdev.github.io/#projects",
      "https://thoangdev.github.io/#books",
      "https://thoangdev.github.io/#awards",
      "https://thoangdev.github.io/assets/resume-pdf.html"
    ]
  }'
```

## Verify Key File is Accessible
```bash
curl -sI https://thoangdev.github.io/8f3a7d2c9b4e1056.txt
```
Expected: `HTTP/2 200`

## Troubleshooting

| Response | Cause | Fix |
|---|---|---|
| `HTTP 400` | Malformed JSON or missing required field | Validate JSON payload |
| `HTTP 403` | Key file not accessible or key mismatch | Verify `8f3a7d2c9b4e1056.txt` is deployed and public |
| `HTTP 422` | URLs not under declared host | Ensure all `urlList` entries start with `https://thoangdev.github.io/` |
| `HTTP 429` | Rate limited | Wait 1 hour and retry |
