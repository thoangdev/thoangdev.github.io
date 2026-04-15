# Command: deploy

## Purpose
Push local changes to GitHub and trigger the full deployment pipeline (secret injection → GitHub Pages publish → IndexNow submission).

## Prerequisites
- Git configured with remote `origin` pointing to `github.com/thoangdev/thoangdev.github.io`
- GitHub Actions secret `GA_MEASUREMENT_ID` set in repo Settings → Secrets → Actions
- GitHub Pages source set to **GitHub Actions** in repo Settings → Pages

## Steps

### 1. Verify no placeholder is left un-replaced in source
```bash
grep -n '__GA_MEASUREMENT_ID__\|__FORMSPREE' index.html
```
Expected: one match for `__GA_MEASUREMENT_ID__` inside the guard script block. Zero matches for `__FORMSPREE` (it was replaced with the real endpoint).

### 2. Run a local sanity check
```bash
# Check for broken internal links/anchors
grep -oP 'href="#\K[^"]+' index.html | sort -u
# Verify sitemap lastmod is current
grep '<lastmod>' sitemap.xml
```

### 3. Stage and commit
```bash
git add -A
git status                     # review what is staged
git commit -m "chore: describe your change here"
```

### 4. Push to main
```bash
git push origin main
```

### 5. Monitor workflow runs
Go to: `https://github.com/thoangdev/thoangdev.github.io/actions`

Expected workflows triggered:
- ✅ `deploy.yml` — injects GA secret, deploys to Pages (~60s)
- ✅ `indexnow.yml` — pings IndexNow and Bing (~10s)

### 6. Verify live site
```bash
curl -sI https://thoangdev.github.io/ | grep -E 'HTTP|Last-Modified'
```

## Rollback
If the deploy breaks the live site:
```bash
git revert HEAD
git push origin main
```
This triggers a new deploy with the reverted state.

## Notes
- `deploy.yml` uses concurrency guard — if two pushes happen quickly, only the latest runs
- GitHub Pages propagation takes 30–90 seconds after the workflow completes
