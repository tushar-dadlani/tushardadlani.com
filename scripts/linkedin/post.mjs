#!/usr/bin/env node
// Publishes LinkedIn posts from content/social/ to your PERSONAL profile via the
// LinkedIn Posts API, then marks each file as published.
//
// Selection:
//   npm run linkedin:post              -> all `scheduled` linkedin posts due today or earlier
//   npm run linkedin:post -- --id sp-0001   -> that one post, regardless of status/date
//   npm run linkedin:post -- --dry-run      -> show what WOULD post, call no API, change nothing
//
// Requires in .env.local (from `npm run linkedin:token`):
//   LINKEDIN_ACCESS_TOKEN, LINKEDIN_AUTHOR_URN
// Optional: LINKEDIN_API_VERSION (defaults below).

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const SOCIAL_DIR = path.join(process.cwd(), 'content', 'social');
// LinkedIn versions its API monthly (YYYYMM). Bump if you hit a version error.
const API_VERSION = process.env.LINKEDIN_API_VERSION || '202607';

function loadEnvLocal() {
  const p = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(m[1] in process.env)) process.env[m[1]] = val;
  }
}
loadEnvLocal();

// --- args ---------------------------------------------------------------
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const idFlag = (() => {
  const i = args.indexOf('--id');
  return i !== -1 ? args[i + 1] : null;
})();

// Today as YYYY-MM-DD in UTC. new Date() is fine in a plain Node script.
const TODAY = new Date().toISOString().slice(0, 10);

const ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const AUTHOR_URN = process.env.LINKEDIN_AUTHOR_URN;

if (!dryRun && (!ACCESS_TOKEN || !AUTHOR_URN)) {
  console.error(
    'Missing LINKEDIN_ACCESS_TOKEN / LINKEDIN_AUTHOR_URN in .env.local.\n' +
      'Run `npm run linkedin:token` first (see scripts/linkedin/README.md).',
  );
  process.exit(1);
}

// The Posts API `commentary` field uses "little text": these characters are
// reserved and must be backslash-escaped, or the post is rejected / mangled.
function escapeCommentary(text) {
  return text.replace(/[\\|{}@\[\]()<>#*_~]/g, (c) => `\\${c}`);
}

function toISODate(v) {
  if (v instanceof Date && !isNaN(v.getTime())) return v.toISOString().slice(0, 10);
  if (typeof v === 'string') return v.trim().slice(0, 10);
  return '';
}

function readPosts() {
  if (!fs.existsSync(SOCIAL_DIR)) return [];
  return fs
    .readdirSync(SOCIAL_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const full = path.join(SOCIAL_DIR, file);
      const raw = fs.readFileSync(full, 'utf8');
      const { data, content } = matter(raw);
      if (!data.id) return null;
      return {
        file,
        full,
        id: String(data.id).trim(),
        platform: String(data.platform ?? '').trim(),
        status: String(data.status ?? '').trim(),
        title: String(data.title ?? '').trim(),
        scheduledFor: toISODate(data.scheduledFor),
        publishedAt: toISODate(data.publishedAt),
        body: content.trim(),
        raw,
      };
    })
    .filter(Boolean);
}

function selectPosts(all) {
  if (idFlag) {
    const hit = all.filter((p) => p.id === idFlag);
    if (!hit.length) {
      console.error(`No post with id "${idFlag}".`);
      process.exit(1);
    }
    return hit;
  }
  // Default: due LinkedIn drafts marked scheduled, with a date of today or past.
  return all.filter(
    (p) =>
      p.platform === 'linkedin' &&
      p.status === 'scheduled' &&
      p.scheduledFor &&
      p.scheduledFor <= TODAY,
  );
}

// LinkedIn posts that have never gone live: not published, no publishedAt stamp.
// Sorted by id so the suggestion list is stable/oldest-first.
function suggestUnposted(all) {
  return all
    .filter(
      (p) => p.platform === 'linkedin' && p.status !== 'published' && !p.publishedAt,
    )
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
}

async function publish(post) {
  const payload = {
    author: AUTHOR_URN,
    commentary: escapeCommentary(post.body),
    visibility: 'PUBLIC',
    distribution: {
      feedDistribution: 'MAIN_FEED',
      targetEntities: [],
      thirdPartyDistributionChannels: [],
    },
    lifecycleState: 'PUBLISHED',
    isReshareDisabledByAuthor: false,
  };

  const res = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${ACCESS_TOKEN}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
      'LinkedIn-Version': API_VERSION,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`LinkedIn API ${res.status}: ${detail}`);
  }
  // The created post URN comes back in this header.
  return res.headers.get('x-restli-id') || res.headers.get('x-linkedin-id') || '(unknown urn)';
}

// Flip a file to published without disturbing the rest of its frontmatter/body.
function markPublished(post) {
  let updated = post.raw.replace(/^status:.*$/m, 'status: published');
  if (/^publishedAt:.*$/m.test(updated)) {
    updated = updated.replace(/^publishedAt:.*$/m, `publishedAt: ${TODAY}`);
  } else {
    // Insert publishedAt into the frontmatter block if the key was absent.
    updated = updated.replace(/^---\n([\s\S]*?)\n---/, (m, fm) => `---\n${fm}\npublishedAt: ${TODAY}\n---`);
  }
  fs.writeFileSync(post.full, updated);
}

async function main() {
  const all = readPosts();
  const selected = selectPosts(all);

  if (!selected.length) {
    console.log(`Nothing due to post (no 'scheduled' linkedin posts as of ${TODAY}).`);
    // On a default run, surface posts that have never been posted so drafts
    // don't get forgotten. --id has its own errors, so skip suggestions there.
    if (!idFlag) {
      const unposted = suggestUnposted(all);
      if (unposted.length) {
        console.log('\nNever posted yet:');
        for (const p of unposted) {
          const hint =
            p.status === 'scheduled' && p.scheduledFor
              ? `scheduled for ${p.scheduledFor}`
              : p.status || 'draft';
          console.log(`\n• ${p.id} — ${p.title || '(untitled)'} [${hint}]`);
          console.log(`  npm run linkedin:post -- --id ${p.id}`);
        }
      } else {
        console.log('\nNothing to suggest — every linkedin post has been published.');
      }
    }
    return;
  }

  console.log(`${dryRun ? '[dry-run] ' : ''}${selected.length} post(s) to publish:\n`);
  let ok = 0;
  for (const post of selected) {
    console.log(`• ${post.id} (${post.file})`);
    if (dryRun) {
      console.log('  --- body ---');
      console.log(
        post.body
          .split('\n')
          .map((l) => '  ' + l)
          .join('\n'),
      );
      console.log('  ------------\n');
      continue;
    }
    try {
      const urn = await publish(post);
      markPublished(post);
      console.log(`  ✓ published → ${urn}\n`);
      ok++;
    } catch (e) {
      console.error(`  ✗ failed: ${e.message}\n`);
    }
  }
  if (!dryRun) console.log(`Done. ${ok}/${selected.length} published.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
