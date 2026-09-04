---
id: ops-004-production-checklist
title: "OPS-004 — Production Operational Checklist"
doc_type: operations
audience: "Solidiom operations engineers"
tags: [operations, production, OPS-004]
lifecycle: current
date: 2026-08-08
---

# OPS-004 — Production Operational Checklist

**Task:** OPS-004
**Status:** Current
**Depends on:** OPS-003 (Cloudflare Pages deployment configured), OPS-002 (domain confirmed)

This document covers all operational configuration required for a production launch of `https://solidiom.org` on Cloudflare Pages.

---

## 1. DNS

### Records

| Record             | Type  | Value                | Proxy         | TTL  |
| ------------------ | ----- | -------------------- | ------------- | ---- |
| `solidiom.org`     | CNAME | `solidiom.pages.dev` | Yes (proxied) | Auto |
| `www.solidiom.org` | CNAME | `solidiom.pages.dev` | Yes (proxied) | Auto |

### Verification records

If adding domain verification records (e.g., for search console), add them as TXT records in the Cloudflare DNS panel before enabling the Pages custom domain.

| Record                  | Type  | Value                          | Notes                                             |
| ----------------------- | ----- | ------------------------------ | ------------------------------------------------- |
| `solidiom.org`          | TXT   | `google-site-verification=...` | Google Search Console                             |
| `_dnsauth.solidiom.org` | CNAME | `_xxxx.xxxx.akamaiedge.net`    | Cloudflare domain verification (auto-provisioned) |

### Pre-launch checks

- [ ] Both CNAME records exist and show "Proxied" (orange cloud ON).
- [ ] Run `dig +short solidiom.org CNAME` — returns `solidiom.pages.dev.cdn.cloudflare.net`.
- [ ] Run `dig +short www.solidiom.org CNAME` — returns `solidiom.pages.dev.cdn.cloudflare.net`.
- [ ] DNS propagation confirmed via [whatsmydns.net](https://whatsmydns.net) across ≥ 8 global resolvers.

---

## 2. Security Headers

Defined in `apps/site/public/_headers`. Verified via `verify-preview-deployment.ts`.

### Global headers (all routes)

| Header                    | Value                                                          | Purpose                                                                                |
| ------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `X-Frame-Options`         | `SAMEORIGIN`                                                   | Block cross-origin framing (clickjacking) while allowing same-origin template previews |
| `X-Content-Type-Options`  | `nosniff`                                                      | Prevent MIME-type sniffing                                                             |
| `Referrer-Policy`         | `strict-origin-when-cross-origin`                              | Limit referrer leakage                                                                 |
| `Permissions-Policy`      | `camera=(), microphone=(), geolocation=(), browsing-topics=()` | Disable unnecessary browser features                                                   |
| `Content-Security-Policy` | See below                                                      | Restrict resource loading                                                              |

### Content Security Policy

```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data:;
font-src 'self';
connect-src 'self' https://*.posthog.com;
frame-src 'self';
frame-ancestors 'self';
base-uri 'self';
form-action 'self' https://buttondown.com;
upgrade-insecure-requests
```

- `'unsafe-inline'` for script/style is required by Astro's SSG hydration model and PostHog snippet.
- `frame-src 'self'` and `frame-ancestors 'self'` allow the site's own same-origin template preview iframes (`/templates/__preview__/*`) while blocking cross-origin embedding.
- Tool routes (playground, theme-builder) will need route-specific CSP relaxations when shipped.
- `form-action` allows newsletter sign-up via Buttondown.

### Pre-launch checks

- [ ] All security headers present on `curl -I https://solidiom.org`.
- [ ] CSP does not block PostHog beacon (`connect-src` includes `https://*.posthog.com`).
- [ ] No CSP violations in browser console on key pages.

---

## 3. Cache Strategy

Defined in `apps/site/public/_headers`. Asset fingerprinting handled by Astro's build pipeline.

| Asset type     | Pattern                 | Cache-Control                                          | Rationale                                       |
| -------------- | ----------------------- | ------------------------------------------------------ | ----------------------------------------------- |
| Hashed JS/CSS  | `/_astro/*`             | `public, max-age=31536000, immutable`                  | Content-hashed filenames guarantee cache safety |
| Fonts          | `/fonts/*`              | `public, max-age=31536000, immutable`                  | Versioned, pinned font files                    |
| Pagefind index | `/pagefind/*`           | `public, max-age=86400, stale-while-revalidate=604800` | Rebuilt per deploy; stale tolerance for search  |
| HTML pages     | `/*` (default)          | No explicit directive (Cloudflare edge default)        | Purged automatically on new deploy              |
| Favicons       | `/favicon.*`            | `public, max-age=86400`                                | Rarely changes, but not immutable               |
| Web manifest   | `/manifest.webmanifest` | `public, max-age=86400`                                | Rarely changes                                  |

### Cache behavior notes

- Cloudflare Pages automatically purges edge cache on successful deployment.
- Hashed assets (`/_astro/*`) never need manual purging — the filename changes when content changes.
- Pagefind index uses `stale-while-revalidate` to serve search from cache during revalidation window.

### Pre-launch checks

- [ ] `/_astro/` assets return `immutable` directive.
- [ ] `/pagefind/` assets return `max-age=86400`.
- [ ] HTML pages do NOT have `immutable` directive.
- [ ] After deploying, confirm edge cache purge (HTML serves new content without cache-busting).

---

## 4. Monitoring

### Error tracking

| Tool                 | Purpose                                   | Configuration                               |
| -------------------- | ----------------------------------------- | ------------------------------------------- |
| Cloudflare Analytics | Traffic, bandwidth, error rates           | Automatic with proxied DNS                  |
| PostHog              | Client-side error capture, user analytics | `POSTHOG_API_KEY` / `POSTHOG_HOST` env vars |
| Browser DevTools     | CSP violations, console errors            | Manual pre-launch audit                     |

### Uptime monitoring

- Cloudflare always-on crawling keeps the origin warm (no cold-start for static content).
- For external uptime monitoring, configure an external checker (e.g., Pingdom, Better Stack) against `https://solidiom.org` with 5-minute intervals.
- Configure Cloudflare notifications for 5xx spikes via the Cloudflare dashboard.

### Performance budgets

| Metric               | Budget            | Enforcement                              |
| -------------------- | ----------------- | ---------------------------------------- |
| LCP                  | < 2.5s            | Lighthouse CI (advisory)                 |
| CLS                  | < 0.1             | Lighthouse CI (advisory)                 |
| INP                  | < 200ms           | Lighthouse CI (advisory)                 |
| JS payload per route | Per-route budgets | `budget-report:enforce` script (CI gate) |
| Total build output   | Tracked           | `budget-report` script                   |

Run budgets locally: `pnpm --filter @solidiom/site budget-report:enforce`

---

## 5. Rollback

Cloudflare Pages retains all previous deployments. Rollback is atomic and instant.

### Steps

1. Navigate to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → solidiom-site → Deployments.
2. Identify the last known-good deployment by git commit SHA or timestamp.
3. Click **"Rollback to this deploy"** on the target deployment.
4. Verify at `https://solidiom.org` that the correct version is live.

### Rollback via API

```bash
# List recent deployments
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom-site/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Promote a specific deployment to production
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom-site/versions/$DEPLOYMENT_ID/restore" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Post-rollback

1. Open a GitHub Issue documenting the rollback: what broke, deployment SHA, root cause if known.
2. If security-related, follow `SECURITY.md` procedures.

See `docs/operations/rollback-procedure.md` for full details.

---

## 6. Pre-launch Checklist

Complete all items before opening the site to public traffic.

### DNS and HTTPS

- [ ] CNAME records propagated globally (≥ 8 resolvers confirm).
- [ ] Cloudflare SSL mode set to **Full** or **Full (strict)**.
- [ ] Origin RSA certificate available in Cloudflare Dashboard → SSL/TLS → Origin Server.
- [ ] Minimum TLS version set to **TLS 1.3** (or 1.2 if broader compatibility needed).
- [ ] `https://solidiom.org` returns valid certificate (check via SSL Labs or `openssl s_client`).

### Security

- [ ] All security headers present and correct on `curl -I https://solidiom.org`.
- [ ] CSP does not block any legitimate resources.
- [ ] `X-Frame-Options: SAMEORIGIN` blocks cross-origin embedding (same-origin template previews still allowed).
- [ ] HTTP → HTTPS redirect active (automatic with Cloudflare "Always Use HTTPS").

### Cache

- [ ] `/_astro/*` assets cached with `immutable` for 1 year.
- [ ] `/pagefind/*` cached with 1-day TTL + stale-while-revalidate.
- [ ] HTML pages serve fresh on each deploy (no stale cache after rollback).

### Redirects

- [ ] `www.solidiom.org` → `solidiom.org` (301).
- [ ] Legacy `/docs/*` → `/primitives/*` redirect active.
- [ ] Trailing slash behavior matches `trailingSlash: "always"` in Astro config.

### Content and i18n

- [ ] Both locales (`/` and `/es/`) return 200 on key pages.
- [ ] `hreflang` tags present and correct for en/es variants.
- [ ] Sitemap includes both locales (excludes `/404/` and `/500/`).
- [ ] Pagefind search index built and accessible at `https://solidiom.org/pagefind/`.

### Analytics

- [ ] PostHog receives events from production (check dashboard within 5 minutes of visit).
- [ ] PostHog is NOT loaded on preview deployments (no env var configured).

### Performance

- [ ] Lighthouse score ≥ 90 on mobile for homepage and a documentation page.
- [ ] Budget enforcement passes: `pnpm --filter @solidiom/site budget-report:enforce`.

### Final

- [ ] `robots.txt` allows crawling (verify at `https://solidiom.org/robots.txt`).
- [ ] No `X-Robots-Tag: noindex` on production responses.
- [ ] Team notified that site is live.

---

## References

- Deployment guide: `docs/guides/deployment.md`
- Rollback procedure: `docs/operations/rollback-procedure.md`
- Cloudflare Pages headers: `apps/site/public/_headers`
- Cloudflare Pages redirects: `apps/site/public/_redirects`
- Astro config: `apps/site/astro.config.ts`
- Wrangler config: `apps/site/wrangler.toml`
