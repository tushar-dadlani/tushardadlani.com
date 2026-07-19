# Social / marketing copy

A simple file-based store for social and marketing copy. Each post is one
Markdown file with YAML frontmatter. The loader lives at
[`src/lib/social.ts`](../../src/lib/social.ts) (mirrors `src/lib/posts.ts`).

The schema is deliberately flat so this folder can be imported into a database
later with a near 1:1 column mapping — no restructuring required.

## Adding a post

1. Copy an existing `sp-*.md` file.
2. Give it the **next** id (`sp-0001`, `sp-0002`, …). Ids are **monotonic and
   never reused**, even after a post is deleted.
3. Name the file `<id>-<short-slug>.md`, e.g. `sp-0004-case-study-teaser.md`.
   The filename is for humans/ordering only — the `id` in frontmatter is the
   real key, so you can rename freely.
4. Write the copy in the body.

## Frontmatter fields

```yaml
---
id: sp-0001                      # stable primary key, never reused (required)
platform: linkedin               # linkedin | newsletter
status: draft                    # draft | scheduled | published
title: Go-live announcement      # internal label, not published
campaign: launch                 # groups related posts (optional)
tags: [launch, intro]            # optional list
link: https://tushardadlani.com  # optional CTA/target URL
scheduledFor: 2026-07-21         # optional, YYYY-MM-DD
publishedAt:                     # optional, YYYY-MM-DD (set when it goes live)
---

The post copy goes here, as Markdown / plain text.
```

Only `id` is strictly required — a file without one is ignored by the loader
(so this README is skipped). Everything else has a sensible default.

## Status lifecycle

`draft` → `scheduled` (set `scheduledFor`) → `published` (set `publishedAt`).

## Migrating to a database later

The frontmatter keys map 1:1 to columns: `id` (primary key), `platform`,
`status`, `title`, `campaign`, `tags` (array/JSON), `link`, `scheduled_for`,
`published_at`, plus `body` for the copy. Read every post with
`getAllSocialPosts()` and `INSERT` — the loader already enforces id uniqueness.
