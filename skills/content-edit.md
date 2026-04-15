# Skill: content-edit

## Purpose
Read and modify HTML content in `index.html` and `assets/resume-pdf.html` with surgical precision — changing only the targeted text without disrupting surrounding structure, CSS classes, or attributes.

## When to Use
- Updating career facts: job titles, company names, dates, bullet points, metrics
- Changing personal information: location, availability, contact details
- Adding or removing skill tags, certification cards, or project cards
- Updating the hero section, bio, or tagline
- Editing the Blog & Books section

## Input
- File path (always absolute)
- Old string: minimum 3 lines of surrounding context, exact whitespace match
- New string: the replacement content

## Output
- Modified file with only the targeted change applied
- No formatting changes to surrounding code

## Process
1. Read the target section with `read_file` to confirm exact current content
2. Identify the minimal change boundary (do not include more than needed)
3. Apply via `replace_string_in_file` or `multi_replace_string_in_file`
4. Re-read the changed lines to verify the result

## Constraints
- Never reformat, re-indent, or "clean up" code outside the changed block
- Never change CSS classes or IDs unless specifically asked
- Never remove HTML comments — they serve as section landmarks
- Always preserve `data-*` attributes, `aria-*` attributes, and `role` attributes

## Safety
- Apply **dual-file rule**: if the change is a career fact, apply it to both `index.html` and `assets/resume-pdf.html` in the same operation
- Use `multi_replace_string_in_file` to make all related edits atomically rather than sequentially

## Performance
- Read the smallest range that gives enough context — prefer line ranges over full-file reads
- When making multiple edits to the same file, batch them in one `multi_replace_string_in_file` call
