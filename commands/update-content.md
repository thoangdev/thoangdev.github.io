# Command: update-content

## Purpose
Step-by-step workflow for safely updating career content (new job, new skill, new achievement, relocation, etc.) across all affected files.

## Affected Files (always check both)
- `index.html` — primary SPA
- `assets/resume-pdf.html` — printable resume mirror

## Workflow

### Step 1: Identify all occurrences of the content being changed
Use grep to find every location before touching anything:
```bash
# Example: finding all location references
grep -n 'New Orleans\|Chicago\|Open to Remote\|relocat\|addressLocality' index.html
grep -n 'New Orleans\|Chicago\|Open to Remote\|relocat' assets/resume-pdf.html
```

### Step 2: Read the surrounding context for each hit
Read ±10 lines around each match before editing to understand structure.

### Step 3: Make all edits atomically
Batch all related changes into a single `multi_replace_string_in_file` call when possible. This ensures a consistent diff and avoids partial states.

### Step 4: Sync JSON-LD (if career facts changed)
Check whether any of these JSON-LD fields need updating:
```bash
python3 -c "
import re, json
with open('index.html') as f: html = f.read()
blocks = re.findall(r'<script type=\"application/ld\+json\">(.*?)</script>', html, re.DOTALL)
for b in blocks:
    d = json.loads(b)
    if d.get('@type') == 'Person':
        print('jobTitle:', d.get('jobTitle'))
        print('address:', d.get('address'))
        print('knowsAbout count:', len(d.get('knowsAbout', [])))
"
```

### Step 5: Update sitemap lastmod
```bash
# Find current lastmod
grep '<lastmod>' sitemap.xml
# Then update to today:  YYYY-MM-DD
```

### Step 6: Run validate-seo
Follow the [validate-seo command](validate-seo.md) to confirm no SEO signals were broken.

### Step 7: Deploy
Follow the [deploy command](deploy.md).

## Common Update Patterns

### New job / role change
Update in `index.html`:
- `#experience` timeline card (company, title, dates, bullets)
- `#about` hero tagline (if role type changes)
- Metrics strip (if new metrics)
- JSON-LD `Person.jobTitle`, `worksFor`, `hasOccupation`

Update in `assets/resume-pdf.html`:
- Experience section matching entry
- Summary paragraph
- Key Achievements list

### New skill or certification
Update in `index.html`:
- `#skills` group (add tag)
- `#awards` (add certification card if applicable)
- JSON-LD `knowsAbout` array

Update in `assets/resume-pdf.html`:
- Core Competencies section
- Certifications section

### Location / relocation change
Search for all occurrences of previous location strings, update in:
- `index.html`: meta description, keywords, hero pill, contact section, footer, JSON-LD `address`
- `assets/resume-pdf.html`: contact header line
