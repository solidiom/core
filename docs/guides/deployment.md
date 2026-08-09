---
id: deployment-spec
title: "Deployment and Infrastructure Specification"
doc_type: reference
audience: "Solidiom operations engineers"
tags: [ops, deployment, cloudflare, infrastructure, OPS-002, OPS-003]
lifecycle: current
date: 2026-07-29
---

# Deployment and Infrastructure Specification

**Tasks:** OPS-002, OPS-003
**Status:** Complete — the protected internal-PR preview workflow builds and indexes the static site, deploys it to Cloudflare Pages, and rejects deployments that fail the delivery-policy verifier.
**Depends on:** OPS-001 (domain/Cloudflare access confirmed)

## OPS-003 automated verification

`.github/workflows/preview-deploy.yml` runs only for pull requests originating from this repository, so deploy and Cloudflare Access secrets are never exposed to forks. After Wrangler reports the deployment URL, `apps/site/tools/verify-preview-deployment.ts` verifies all of the following against the deployed preview:

- An unauthenticated request is rejected or redirected by Cloudflare Access; the configured service token can load the preview.
- Security headers include frame, MIME-sniffing, referrer, and CSP protections.
- Hashed Astro assets use one-year immutable caching, while Pagefind uses one-day caching.
- The legacy `/docs/dialog` route returns its configured `301` redirect.

The repository requires the `CLOUDFLARE_ACCESS_CLIENT_ID` and `CLOUDFLARE_ACCESS_CLIENT_SECRET` GitHub Action secrets in addition to the existing Cloudflare deployment credentials. The Access application must grant that service token access only to preview deployments.

---

## 1. Environments

| Environment | URL                                   | Purpose           | Access                        |
| ----------- | ------------------------------------- | ----------------- | ----------------------------- |
| Preview     | `preview-{branch}.solidiom.pages.dev` | PR/branch preview | Team only (Cloudflare Access) |
| Production  | `https://solidiom.org`                | Public site       | Public                        |

---

## 2. DNS Configuration

| Record             | Type  | Value                | Proxy                    |
| ------------------ | ----- | -------------------- | ------------------------ |
| `solidiom.org`     | CNAME | `solidiom.pages.dev` | Yes (Cloudflare proxied) |
| `www.solidiom.org` | CNAME | `solidiom.pages.dev` | Yes                      |

### Redirects

| From                    | To                       | Status                         |
| ----------------------- | ------------------------ | ------------------------------ |
| `www.solidiom.org/*`    | `https://solidiom.org/*` | 301                            |
| `http://solidiom.org/*` | `https://solidiom.org/*` | 301 (automatic via Cloudflare) |

---

## 3. Cloudflare Pages Configuration

### Build settings

| Setting                | Value                                                                                   |
| ---------------------- | --------------------------------------------------------------------------------------- |
| Framework preset       | None (custom)                                                                           |
| Build command          | `pnpm exec nx run @solidiom/site:build && pnpm exec nx run @solidiom/site:search-index` |
| Build output directory | `apps/site/dist`                                                                        |
| Root directory         | `/`                                                                                     |
| Node.js version        | `24`                                                                                    |
| Package manager        | `pnpm` (detected from `packageManager` field)                                           |

### Environment variables (production)

| Variable          | Source                             | Notes                   |
| ----------------- | ---------------------------------- | ----------------------- |
| `POSTHOG_API_KEY` | Cloudflare secret                  | PostHog project API key |
| `POSTHOG_HOST`    | Cloudflare secret                  | PostHog instance URL    |
| `SITE_URL`        | Plain text: `https://solidiom.org` | Canonical site URL      |

### Environment variables (preview)

| Variable          | Source                                                   | Notes                         |
| ----------------- | -------------------------------------------------------- | ----------------------------- |
| `POSTHOG_API_KEY` | Not set                                                  | Analytics disabled in preview |
| `SITE_URL`        | Cloudflare auto (`https://preview-*.solidiom.pages.dev`) |                               |

---

## 4. Headers (`apps/site/public/_headers`)

```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()

/fonts/*
  Cache-Control: public, max-age=31536000, immutable

/_astro/*
  Cache-Control: public, max-age=31536000, immutable

/pagefind/*
  Cache-Control: public, max-age=86400
```

### Content Security Policy

Applied via `_headers` for static pages. Tool routes (playground, theme-builder)
will need route-specific CSP when they ship.

```
/*
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://*.posthog.com; frame-src 'none'; base-uri 'self'; form-action 'self' https://buttondown.com
```

---

## 5. Redirects (`apps/site/public/_redirects`)

```
# www → apex
https://www.solidiom.org/* https://solidiom.org/:splat 301

# Legacy documentation paths (from CUT-003 removal of apps/docs/)
/docs/* /primitives/:splat 301
```

---

## 6. Asset Caching Strategy

| Asset type                     | Cache-Control                   | Rationale                    |
| ------------------------------ | ------------------------------- | ---------------------------- |
| Hashed assets (`/_astro/*`)    | `immutable, max-age=1y`         | Content-addressed filenames  |
| Fonts (`/fonts/*`)             | `immutable, max-age=1y`         | Pinned, versioned font files |
| Pagefind index (`/pagefind/*`) | `max-age=1d`                    | Rebuilt on each deploy       |
| HTML pages                     | Default (Cloudflare edge cache) | Purged on deploy             |

---

## 7. Rollback Procedure

See `docs/operations/rollback-procedure.md` for the full, up-to-date rollback procedure.

### Quick Reference

1. Cloudflare Pages retains all previous deployments.
2. To rollback: navigate to Cloudflare Dashboard → Pages → Deployments → select previous production deployment → "Rollback to this deploy".
3. Rollback is instant (DNS already points to Pages, deployment switch is atomic).
4. If a rollback is needed due to a broken build, the broken deployment can be identified by its git SHA in the deployment list.

### Pre-deployment checklist

- [ ] `pnpm exec nx run @solidiom/site:build` succeeds locally.
- [ ] `pnpm exec nx run @solidiom/site:search-index` produces output.
- [ ] No new type errors or build warnings.
- [ ] Preview deployment reviewed and functional.

---

## 8. Secret Management

| Principle                  | Implementation                                                         |
| -------------------------- | ---------------------------------------------------------------------- |
| No secrets in source       | All API keys via Cloudflare environment variables                      |
| No secrets in build output | Astro does not embed env vars unless explicitly imported               |
| Rotation                   | PostHog key can be rotated in Cloudflare dashboard without code change |
| Audit                      | Cloudflare audit log tracks environment variable changes               |

---

## 9. Preview Access Policy

- Preview deployments are restricted via Cloudflare Access.
- Only authenticated team members can view preview builds.
- Preview URLs are not indexed (X-Robots-Tag: noindex applied by Cloudflare Pages for non-production).
- Preview analytics are disabled (no PostHog key configured).

---

## 10. Monitoring

| Concern     | Tool                                      | Notes                                 |
| ----------- | ----------------------------------------- | ------------------------------------- |
| Uptime      | Cloudflare Analytics (included)           | Alerts via Cloudflare notifications   |
| Errors      | Cloudflare Pages Functions logs (if used) | Static site has minimal error surface |
| Performance | Lighthouse CI (advisory, CI-003)          | Core Web Vitals tracked per deploy    |
| Traffic     | Cloudflare Analytics                      | No PII collected                      |
