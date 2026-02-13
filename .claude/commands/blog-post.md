Write a blog post for petewatters.ie based on the topic or description provided.

## Process

1. **Understand the topic** — Review the provided description, PR, or feature context
2. **Identify the angle** — What's the interesting story? Why would a reader care?
3. **Read existing posts** — Run `ls src/content/blog/` and read 1-2 recent posts to match the voice and structure
4. **Write the post** — Create a markdown file in `src/content/blog/`
5. **Generate a tweet** — Write an optional X/Twitter announcement

## Blog post format

Create a markdown file at `src/content/blog/<slug>.md` with this frontmatter:

```markdown
---
title: "Post Title"
description: "One-line summary for SEO and the blog listing card"
pubDate: YYYY-MM-DD
tags: ["code", "travel", "sport"]
draft: true
---

Post body here...
```

- **slug**: kebab-case filename, concise (e.g. `astro-migration.md`)
- **tags**: use existing tags where possible (`code`, `travel`, `sport`). Add new ones sparingly.
- **draft: true**: always start as draft so it can be reviewed before publishing
- **pubDate**: use today's date

## Voice and style

- First person, conversational — like explaining something to a colleague
- Short paragraphs, 2-4 sentences each
- Technical but accessible — assume the reader is a developer
- Lead with the problem or motivation, then the solution
- Use markdown tables for comparisons
- Use code blocks with language identifiers for snippets
- Use blockquotes for callouts or references
- Don't use emojis in the post body
- End with something concrete — numbers, results, or a takeaway

## Structure

1. **Opening** — 1-2 paragraphs setting up the problem or context
2. **Body** — The substance. Use `##` headings to break up sections. Show real code, real decisions, real tradeoffs.
3. **Closing** — What changed, what the result was. Keep it brief.

## X/Twitter announcement (optional)

After writing the post, generate a single tweet (280 chars max):
- What shipped or what the post covers
- One concrete benefit or interesting detail
- No hashtags, no emojis, no hype words

## Rules

- Always set `draft: true` in frontmatter
- Match the tone of existing posts — read them first
- Don't pad the post with filler. If it's a short topic, write a short post.
- Prefer showing over explaining — code snippets, before/after comparisons, metrics
