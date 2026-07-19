#!/usr/bin/env node
// One-time OAuth helper: gets a LinkedIn access token (and refresh token, if your
// app is granted them) for posting to your PERSONAL profile, plus your member URN.
//
// Prereqs (see scripts/linkedin/README.md):
//   - A LinkedIn Developer app with the "Share on LinkedIn" + "Sign In with LinkedIn
//     using OpenID Connect" products, scopes: openid profile w_member_social
//   - Redirect URL registered EXACTLY as the one below (default http://localhost:4567/callback)
//   - LINKEDIN_CLIENT_ID and LINKEDIN_CLIENT_SECRET set in .env.local
//
// Run:  npm run linkedin:token
// Then paste the printed values into .env.local.

import http from 'node:http';
import { URL } from 'node:url';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const PORT = Number(process.env.LINKEDIN_OAUTH_PORT || 4567);
const REDIRECT_URI =
  process.env.LINKEDIN_REDIRECT_URI || `http://localhost:${PORT}/callback`;
const SCOPES = 'openid profile w_member_social';

// Minimal .env.local loader (no dependency) so CLIENT_ID/SECRET are picked up.
function loadEnvLocal() {
  const p = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(p)) return;
  for (const line of fs.readFileSync(p, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}
loadEnvLocal();

const CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error(
    'Missing LINKEDIN_CLIENT_ID / LINKEDIN_CLIENT_SECRET.\n' +
      'Add them to .env.local (see scripts/linkedin/README.md), then re-run.',
  );
  process.exit(1);
}

// A random-ish state value without Math.random (varies per run via time+pid).
const state = `st_${process.pid}_${process.hrtime.bigint().toString(36)}`;

const authUrl = new URL('https://www.linkedin.com/oauth/v2/authorization');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('state', state);
authUrl.searchParams.set('scope', SCOPES);

async function exchangeCodeForToken(code) {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
  });
  const res = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`Token exchange failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return json;
}

async function fetchMemberUrn(accessToken) {
  // OIDC userinfo returns `sub` = your member id; the URN is urn:li:person:{sub}.
  const res = await fetch('https://api.linkedin.com/v2/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const json = await res.json();
  if (!res.ok) {
    throw new Error(`userinfo failed (${res.status}): ${JSON.stringify(json)}`);
  }
  return { urn: `urn:li:person:${json.sub}`, name: json.name };
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end('Not found');
    return;
  }

  const err = url.searchParams.get('error');
  if (err) {
    res.writeHead(400).end(`OAuth error: ${err} — ${url.searchParams.get('error_description')}`);
    console.error('\nOAuth error:', err, url.searchParams.get('error_description'));
    server.close();
    process.exit(1);
  }

  const code = url.searchParams.get('code');
  const returnedState = url.searchParams.get('state');
  if (returnedState !== state) {
    res.writeHead(400).end('State mismatch — aborting.');
    console.error('\nState mismatch; possible CSRF. Aborting.');
    server.close();
    process.exit(1);
  }

  try {
    const token = await exchangeCodeForToken(code);
    const { urn, name } = await fetchMemberUrn(token.access_token);

    res
      .writeHead(200, { 'Content-Type': 'text/html' })
      .end('<h2>LinkedIn connected ✓</h2><p>You can close this tab and return to your terminal.</p>');

    const expiresDays = token.expires_in ? Math.round(token.expires_in / 86400) : '?';
    console.log('\n────────────────────────────────────────────────────────');
    console.log(`Connected as: ${name}`);
    console.log(`Access token expires in ~${expiresDays} days.`);
    console.log('\nAdd these to .env.local:\n');
    console.log(`LINKEDIN_ACCESS_TOKEN="${token.access_token}"`);
    console.log(`LINKEDIN_AUTHOR_URN="${urn}"`);
    if (token.refresh_token) {
      console.log(`LINKEDIN_REFRESH_TOKEN="${token.refresh_token}"`);
    } else {
      console.log(
        '\n(No refresh token returned — your app is not granted programmatic\n' +
          ' refresh. Re-run this script to get a fresh token when it expires.)',
      );
    }
    console.log('────────────────────────────────────────────────────────\n');
  } catch (e) {
    res.writeHead(500).end('Token exchange failed — see terminal.');
    console.error('\n' + e.message);
    server.close();
    process.exit(1);
  }
  server.close();
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`\nListening on ${REDIRECT_URI}`);
  console.log('\nOpen this URL in your browser to authorize (attempting to open it now):\n');
  console.log(authUrl.toString() + '\n');
  // Best-effort auto-open on macOS; harmless if it fails.
  try {
    spawn('open', [authUrl.toString()], { stdio: 'ignore', detached: true }).unref();
  } catch {
    /* user can copy the URL manually */
  }
});
