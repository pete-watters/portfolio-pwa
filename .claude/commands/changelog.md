Generate a changelog entry summarising recent changes.

## Process

1. Run `git log --oneline $(git describe --tags --abbrev=0 2>/dev/null || git rev-list --max-parents=0 HEAD)..HEAD` to see commits since the last tag (or all commits if no tags exist).
2. Group changes by conventional commit type:
   - **Features** (`feat:`)
   - **Bug Fixes** (`fix:`)
   - **Other** (`refactor:`, `chore:`, `ci:`, `docs:`, `style:`, `test:`)
3. Write a concise changelog entry in this format:

```markdown
## [version or date]

### Features
- Description of feature (commit hash)

### Bug Fixes
- Description of fix (commit hash)

### Other
- Description of change (commit hash)
```

## Rules

- Omit empty sections
- Write descriptions in plain english, not the raw commit message — explain what changed for a reader, not a developer
- Keep each entry to one line
- Use the short commit hash in parentheses at the end of each line
- If there's a version tag, use it as the heading; otherwise use today's date
