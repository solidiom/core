# Domain and Infrastructure Access Confirmation

**Task:** OPS-001
**Status:** Complete

## Context

The canonical origin for the project website is **https://solidiom.org**, hosted on **Cloudflare Pages** (see `docs/website-imp.md` §2.4).

This checklist must be completed by the responsible operations owner to confirm domain and infrastructure access before any deployment work can proceed.

## Verification Checklist

- [x] `solidiom.org` domain is registered and registrar account access confirmed
- [x] Domain registrar login credentials are held by an authorized team member
- [x] Domain auto-renewal is enabled
- [x] DNSSEC is configured (if applicable)
- [x] Cloudflare account exists with the domain added
- [x] Cloudflare account access is confirmed by an authorized team member
- [x] DNS records are managed through Cloudflare (nameservers delegated)
- [x] Cloudflare Pages project can be created for `solidiom.org`
- [x] At least two authorized team members have account access (bus factor ≥ 2)
- [x] Account recovery mechanisms (2FA backup, recovery email) are documented privately

## Sign-off

- **Confirmed by:** Victor Palma
- **Date:** 07/28/2026
- **Notes:** None

---

> **Blocker:** This checklist must be completed before OPS-002 (preview/production deployment configuration) can begin.

## References

- `docs/website-imp.md` §2.4
- `docs/website-tasks.md` OPS-001 / OPS-002
