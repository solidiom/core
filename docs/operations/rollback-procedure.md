---
id: rollback-procedure
title: "Rollback Procedure"
doc_type: reference
audience: "Solidiom operations engineers"
tags: [ops, rollback, cloudflare, BETA-003]
lifecycle: current
date: 2026-08-01
---

# Rollback Procedure

**Task:** BETA-003
**Status:** Current

This document covers how to rollback a Cloudflare Pages deployment and revert DNS if needed.

## Rollback a Cloudflare Pages Deployment

Cloudflare Pages retains all previous deployments. A rollback is instant — DNS already points to Pages, and switching the production deployment is atomic.

### Steps

1. Navigate to the [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → solidiom → Deployments.
2. Find the previous working deployment. You can identify it by:
   - Git commit SHA
   - Deployment timestamp
   - Branch name
3. Click on the deployment and select **"Retry deployment"** or **"Rollback to this deploy"**.
4. Verify the site at `https://solidiom.org` is serving the correct version.

### Rollback via API

For automated rollback, use the Cloudflare API:

```bash
# List recent deployments
curl -X GET "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom/deployments" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Promote a specific deployment to production
curl -X POST "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/solidiom/versions/$DEPLOYMENT_ID/restore" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

### Identifying a Broken Deployment

- Check the deployment list for the git SHA that was pushed when the issue started.
- Cloudflare Pages marks failed builds with a red indicator.
- If the build succeeded but the site is broken, compare the deployment timestamp with when the issue was reported.

## Revert DNS

In the unlikely event that DNS changes need to be reverted:

1. Navigate to Cloudflare Dashboard → solidiom.org → DNS.
2. Revert any CNAME or A record changes.
3. Cloudflare's global DNS typically propagates within 60 seconds.

### Current DNS Records

| Record             | Type  | Value                | Proxy |
| ------------------ | ----- | -------------------- | ----- |
| `solidiom.org`     | CNAME | `solidiom.pages.dev` | Yes   |
| `www.solidiom.org` | CNAME | `solidiom.pages.dev` | Yes   |

## Contact Procedures

If a rollback is needed:

1. Perform the rollback immediately (don't wait for root cause analysis).
2. Open a GitHub Issue documenting:
   - What broke
   - Which deployment was rolled back from/to (include SHA)
   - What triggered the rollback
3. If the issue is security-related, follow the process in `SECURITY.md`.

## Prevention Checklist

Before any production deployment:

- [ ] `pnpm exec nx run @solidiom/site:build` succeeds locally
- [ ] `pnpm exec nx run @solidiom/site:search-index` produces output
- [ ] No new type errors or build warnings
- [ ] Preview deployment reviewed and functional
- [ ] Security headers verified on preview
