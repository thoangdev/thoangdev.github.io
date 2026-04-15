# Skill: inject-secrets

## Purpose
Manage the substitution of secret/environment placeholders in static files at deploy time via GitHub Actions `sed` commands — keeping sensitive values out of source control.

## When to Use
- Adding a new secret value that should not be hardcoded
- Auditing that all placeholders are correctly replaced in `deploy.yml`
- Verifying the guard script in `index.html` protects against un-replaced placeholders

## Current Placeholders

| Placeholder | Secret Name | File | Guard Exists? |
|---|---|---|---|
| `__GA_MEASUREMENT_ID__` | `GA_MEASUREMENT_ID` | `index.html` | Yes — JS checks `startsWith('__')` |

## Input
- Placeholder string (must follow pattern `__UPPER_SNAKE_CASE__`)
- GitHub secret name
- Target file path

## Output
- Updated `sed` command in `.github/workflows/deploy.yml`
- Guard script block in target file (if the placeholder is used in JS/HTML that would break if unreplaced)

## Process for Adding a New Secret
1. Choose placeholder name: `__MY_SECRET__`
2. Insert placeholder into the target file at the point of use
3. Add guard if the placeholder is in executable code:
   ```js
   if (typeof MY_SECRET === 'undefined' || MY_SECRET.startsWith('__')) {
     console.warn('Secret not injected — skipping.');
   } else {
     // use MY_SECRET
   }
   ```
4. Add `sed` step in `deploy.yml` before the artifact upload step:
   ```yaml
   - name: Inject MY_SECRET
     run: sed -i "s|__MY_SECRET__|${{ secrets.MY_SECRET }}|g" target-file.html
   ```
5. Document the new secret in `CLAUDE.md` and in `agents/deploy-infrastructure.md`

## Constraints
- Placeholders must be double-underscore wrapped: `__NAME__`
- Never commit the actual secret value to any file
- Formspree endpoint is **not** a secret — it is hardcoded and that is intentional

## Safety
- If a secret is missing from GitHub Settings, `sed` will leave the placeholder intact
- Always add a guard to prevent broken behaviour in that case
