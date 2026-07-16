import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';

// Minimal file-based content engine: every .md file in content/posts becomes a
// post. Frontmatter: title, date (YYYY-MM-DD), description. Body is Markdown.
const POSTS_DIR = path.join(process.cwd(), 'content', 'posts');

export interface PostMeta {
  slug: string;
  title: string;
  date: string; // ISO YYYY-MM-DD
  description: string;
  readingMinutes: number;
}

export interface Post extends PostMeta {
  html: string;
}

function readSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

function readPost(slug: string): Post {
  const raw = fs.readFileSync(path.join(POSTS_DIR, `${slug}.md`), 'utf8');
  const { data, content } = matter(raw);
  const words = content.trim().split(/\s+/).length;
  return {
    slug,
    title: String(data.title ?? slug),
    date: String(data.date ?? ''),
    description: String(data.description ?? ''),
    readingMinutes: Math.max(1, Math.round(words / 200)),
    html: marked.parse(content, { async: false }) as string,
  };
}

export function getAllPosts(): PostMeta[] {
  return readSlugs()
    .map((slug) => {
      const { html, ...meta } = readPost(slug);
      void html;
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1)); // newest first
}

export function getPost(slug: string): Post | null {
  try {
    return readPost(slug);
  } catch {
    return null;
  }
}

export function getPostSlugs(): string[] {
  return readSlugs();
}

export function formatDate(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}
