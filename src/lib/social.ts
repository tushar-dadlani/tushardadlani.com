import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// File-based store for social/marketing copy: every .md file in content/social
// that carries an `id` in its frontmatter becomes a social post. The schema is
// intentionally flat so this whole folder can be imported into a database later
// with a mechanical, near 1:1 column mapping. README.md (and any file without an
// `id`) is ignored. See content/social/README.md for the authoring convention.
const SOCIAL_DIR = path.join(process.cwd(), 'content', 'social');

export type SocialPlatform = 'linkedin' | 'newsletter';
export type SocialStatus = 'draft' | 'scheduled' | 'published';

export interface SocialPost {
  id: string; // stable primary key, e.g. "sp-0001" — never reused
  slug: string; // filename without .md, for reference/ordering only
  platform: SocialPlatform;
  status: SocialStatus;
  title: string; // internal label, not published
  campaign: string; // groups related posts; '' when unset
  tags: string[];
  link: string; // CTA/target URL; '' when unset
  scheduledFor: string; // YYYY-MM-DD; '' when unset
  publishedAt: string; // YYYY-MM-DD; '' when unset
  body: string; // the actual copy (Markdown / plain text)
}

function readFilenames(): string[] {
  if (!fs.existsSync(SOCIAL_DIR)) return [];
  return fs.readdirSync(SOCIAL_DIR).filter((f) => f.endsWith('.md'));
}

// gray-matter/js-yaml parses an unquoted `date: 2026-07-16` into a Date object,
// so normalize to a plain YYYY-MM-DD string (UTC, to preserve the written day).
// Same gotcha as src/lib/posts.ts; empty/unset values normalize to ''.
function toISODate(v: unknown): string {
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') return v.trim().slice(0, 10);
  return '';
}

function toStringArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((t) => String(t).trim()).filter(Boolean);
  if (typeof v === 'string') {
    return v
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
  }
  return [];
}

function readPost(filename: string): SocialPost | null {
  const raw = fs.readFileSync(path.join(SOCIAL_DIR, filename), 'utf8');
  const { data, content } = matter(raw);
  // Only files with an explicit `id` are posts (skips README.md, notes, etc.).
  if (data.id === undefined || data.id === null || String(data.id).trim() === '') {
    return null;
  }
  return {
    id: String(data.id).trim(),
    slug: filename.replace(/\.md$/, ''),
    platform: (String(data.platform ?? 'linkedin').trim() as SocialPlatform),
    status: (String(data.status ?? 'draft').trim() as SocialStatus),
    title: String(data.title ?? '').trim(),
    campaign: String(data.campaign ?? '').trim(),
    tags: toStringArray(data.tags),
    link: String(data.link ?? '').trim(),
    scheduledFor: toISODate(data.scheduledFor),
    publishedAt: toISODate(data.publishedAt),
    body: content.trim(),
  };
}

export function getAllSocialPosts(): SocialPost[] {
  const posts = readFilenames()
    .map(readPost)
    .filter((p): p is SocialPost => p !== null);

  // Guard: the whole point of stable ids is that they're unique. Surface any
  // collision loudly here, before it silently corrupts a future DB import.
  const seen = new Map<string, string>();
  for (const p of posts) {
    const prev = seen.get(p.id);
    if (prev) {
      throw new Error(
        `Duplicate social post id "${p.id}" in "${p.slug}.md" and "${prev}.md". Ids must be unique.`,
      );
    }
    seen.set(p.id, p.slug);
  }

  return posts.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

export function getSocialPost(id: string): SocialPost | null {
  return getAllSocialPosts().find((p) => p.id === id) ?? null;
}
