---
name: linkedin-post
description: Draft a LinkedIn post from new content (a blog post, page, idea, or link) and save it into content/social/ using the site's social-copy schema. Use whenever the user wants to turn something into a LinkedIn post, announce a new post/page, or add marketing copy for LinkedIn.
---

# Create a LinkedIn post from new content

Turn a piece of source content into a ready-to-post LinkedIn draft, saved as a
new file in `content/social/` that conforms to this repo's social-copy schema.

## Inputs

The user will point you at source content. It may be:
- A blog post in `content/posts/*.md` (most common — announce a new writeup).
- A site page/route (e.g. `/readiness`, `/samples/...`).
- A raw idea, paragraph, or external link they paste in.

If it's ambiguous which content they mean, ask before writing. If they gave
enough to work with, proceed.

## Steps

1. **Read the schema and an example.** Skim `content/social/README.md` for the
   field spec and read the newest `sp-*.md` seed file to match voice and shape.

2. **Read the source content** so the post reflects what's actually there
   (headline idea, the one crisp insight, and the correct link/route).

3. **Assign the next id.** List `content/social/sp-*.md`, find the highest
   `sp-NNNN`, and use the next number, zero-padded to 4 digits. Ids are
   monotonic and never reused — never reuse or renumber an existing id.

4. **Write the file** as `content/social/sp-NNNN-<short-slug>.md` where the slug
   is a few kebab-case words describing the post. Frontmatter:

   ```yaml
   ---
   id: sp-NNNN
   platform: linkedin
   status: draft
   title: <short internal label, not published>
   campaign: <group name if part of one, else omit/empty>
   tags: [<1–3 lowercase tags>]
   link: <the canonical URL this post drives to>
   scheduledFor:
   publishedAt:
   ---
   ```

   - `status` is always `draft` for a new post.
   - `link` should be the full URL, e.g.
     `https://tushardadlani.com/writing/<slug>` for a blog post.
   - Leave `scheduledFor` and `publishedAt` empty.

5. **Write the body** — the actual LinkedIn copy, following the voice rules
   below. End with a clear CTA line that includes the `link`.

6. **Verify** it parses: the loader must pick it up and ids must stay unique.
   Run a quick check, e.g.:

   ```
   node -e "const fs=require('fs'),path=require('path'),m=require('gray-matter');const d='content/social';const seen=new Set();for(const f of fs.readdirSync(d).filter(f=>f.endsWith('.md'))){const {data}=m(fs.readFileSync(path.join(d,f),'utf8'));if(!data.id)continue;if(seen.has(data.id))throw new Error('dup '+data.id);seen.add(data.id);}console.log('ok',[...seen].sort().join(', '))"
   ```

7. **Report** the new file path, its id, and paste the drafted body so the user
   can review/edit before publishing.

## Voice & format (LinkedIn)

- Match the existing seed posts: plain-spoken, confident, no hype or buzzword
  soup. Short paragraphs (1–3 lines) with blank lines between them.
- Open with a hook — a result, a contrast, or a plain claim — not a preamble.
- One core idea per post. Concrete over abstract (the insurance-claim style
  example beats "leverage AI to drive outcomes").
- At most one emoji, and only if it earns its place (e.g. a 🚀 on a launch or a
  👉/👇 pointing at the CTA). Don't sprinkle them.
- No hashtag walls. Zero or a couple of genuinely relevant tags at most.
- Close with a single CTA line containing the link.

## Notes

- Keep this a `draft`; the user schedules/publishes and sets the dates later.
- Do not modify existing `sp-*.md` files or the loader — only add a new file.
- The schema is intentionally flat so it maps 1:1 to a future database; don't
  invent new frontmatter fields.
