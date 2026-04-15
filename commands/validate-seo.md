# Command: validate-seo

## Purpose
Run a pre-deploy checklist to confirm all SEO tags are present, non-empty, and consistent with the current content.

## Steps

### 1. Check title tag
```bash
grep -o '<title>[^<]*</title>' index.html
```
Expected: Contains "QA Tech Lead", "Agentic AI QA", under 60 characters.

### 2. Check meta description
```bash
grep -oP '<meta name="description" content="\K[^"]+' index.html
```
Expected: 140–160 characters, includes "Tommy Hoang" and relocation cities.

### 3. Check canonical URL
```bash
grep 'canonical' index.html
```
Expected: `<link rel="canonical" href="https://thoangdev.github.io/">`

### 4. Check IndexNow meta tag
```bash
grep 'indexnow' index.html
```
Expected: `<meta name="indexnow-verification" content="8f3a7d2c9b4e1056">`

### 5. Check Google verification meta tag
```bash
grep 'google-site-verification' index.html
```
Expected: one meta tag present.

### 6. Check JSON-LD is valid JSON
```bash
python3 -c "
import re, json
with open('index.html') as f: html = f.read()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
for i, b in enumerate(blocks):
    json.loads(b)
    print(f'JSON-LD block {i+1}: valid')
"
```

### 7. Check OG image tag is populated
```bash
grep 'og:image' index.html
```
Expected: points to `https://thoangdev.github.io/assets/profile.jpg` or equivalent.

### 8. Check sitemap lastmod
```bash
grep '<lastmod>' sitemap.xml
```
Expected: date matches today or last deploy date.

### 9. Check GA placeholder (should still be a placeholder in source)
```bash
grep '__GA_MEASUREMENT_ID__' index.html | head -3
```
Expected: exactly one or two occurrences — the placeholder and the guard check. If the real `G-` ID appears in source, it was accidentally hardcoded.

### 10. Check for broken section anchor targets
```bash
python3 -c "
import re
with open('index.html') as f: html = f.read()
nav_hrefs = set(re.findall(r'href=\"(#[^\"]+)\"', html))
section_ids = set('#' + i for i in re.findall(r'<section[^>]+id=\"([^\"]+)\"', html))
missing = nav_hrefs - section_ids
print('Nav hrefs with no matching section id:', missing or 'none — all good')
"
```

## Pass Criteria
All 10 checks produce expected output. Any failure should be resolved before running the `deploy` command.
