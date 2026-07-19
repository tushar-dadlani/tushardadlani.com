# Auto-post to LinkedIn (personal profile)

Publishes posts from `content/social/` to your **personal** LinkedIn profile via
the official LinkedIn Posts API. Copy stays in your repo as the source of truth;
these scripts just push the `scheduled` ones and flip them to `published`.

Two scripts:
- `get-token.mjs` — one-time OAuth to get an access token + your member URN.
- `post.mjs` — reads due posts and publishes them.

No secrets are committed — they live in `.env.local` (git-ignored).

---

## One-time setup

### 1. Create a LinkedIn app
1. Go to <https://www.linkedin.com/developers/apps> → **Create app**.
2. Associate it with a LinkedIn Page (a personal placeholder Page is fine) and
   verify it.
3. On the **Products** tab, request:
   - **Sign In with LinkedIn using OpenID Connect** (gives `openid`, `profile`)
   - **Share on LinkedIn** (gives `w_member_social` — this is the one that lets
     you post). Approval is usually quick but not always instant.
4. On the **Auth** tab, under **OAuth 2.0 settings → Authorized redirect URLs**,
   add exactly:
   ```
   http://localhost:4567/callback
   ```
5. Copy the **Client ID** and **Client Secret** from the Auth tab.

### 2. Add credentials to `.env.local`
Copy the template and fill in the two values:
```
cp .env.local.example .env.local
```
Set `LINKEDIN_CLIENT_ID` and `LINKEDIN_CLIENT_SECRET`.

### 3. Get an access token
```
npm run linkedin:token
```
This opens a browser, you approve, and the terminal prints:
```
LINKEDIN_ACCESS_TOKEN="..."
LINKEDIN_AUTHOR_URN="urn:li:person:..."
```
Paste both into `.env.local`.

> **Token lifetime:** member access tokens last ~60 days. Most apps are **not**
> granted programmatic refresh tokens, so when the token expires just re-run
> `npm run linkedin:token` to get a fresh one. If a `LINKEDIN_REFRESH_TOKEN` was
> printed, your app supports refresh and you can automate that later.

---

## Posting

Mark a post ready by setting `status: scheduled` and a `scheduledFor` date in its
`content/social/sp-*.md` file. Then:

```
# Preview exactly what would post — no API calls, no file changes:
npm run linkedin:post -- --dry-run

# Publish everything due today or earlier:
npm run linkedin:post

# Publish one specific post now, ignoring status/date:
npm run linkedin:post -- --id sp-0001
```

On success each file is updated to `status: published` and stamped with today's
`publishedAt`, so it won't post twice.

---

## Scheduling it (optional, later)

`post.mjs` is a plain script, so anything that runs on a timer works:
- **GitHub Actions** cron (store the token as a repo secret) — runs daily and
  posts what's due. Best if you want it hands-off.
- A local `cron` / `launchd` job, or Claude Code's `/loop`.

Start by running it manually a few times; automate once you trust the output.

---

## Notes & gotchas
- **API version:** the Posts API is versioned monthly (`LinkedIn-Version`, e.g.
  `202506`). If you get a version error, set `LINKEDIN_API_VERSION` in
  `.env.local` to a current `YYYYMM`.
- **Text is escaped** for LinkedIn's reserved characters automatically. Posting
  images/links-with-previews is not wired up yet — this publishes text posts
  (any URL in the body still renders as a clickable link + preview).
- **Company Pages** need a different scope (`w_organization_social`) and harder
  approval; this setup is personal-profile only.
