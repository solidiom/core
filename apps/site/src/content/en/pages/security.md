---
title: Security Policy
description: Coordinated disclosure, vulnerability reporting, and supported versions for Solidiom.
locale: en
---

# Security Policy

**Effective date:** 2025-01-01
**Canonical domain:** solidiom.org

## Supported Versions

| Version | Supported |
|---------|-----------|
| Latest `next` prerelease | Yes |
| Previous `next` prerelease | Best effort |
| Stable releases (when available) | Yes |

## Reporting a Vulnerability

We use [GitHub Private Vulnerability Reporting](https://github.com/solidiom/solidiom/security/advisories/new) for coordinated disclosure.

When you submit a report:

1. You'll receive an acknowledgment within 48 hours
2. We'll confirm the vulnerability's validity within one week
3. We'll communicate the mitigation timeline
4. You'll be credited in the advisory unless you request anonymity

## What to Include

- A description of the vulnerability
- Steps to reproduce
- Affected package and version
- Impact assessment

## What We Don't Accept

- Vulnerabilities in third-party dependencies (report those upstream)
- Social engineering, DDoS, or denial-of-service attacks
- Issues in already-superseded versions beyond their support window

## Scope

This policy covers:

- All `@solidiom/*` packages
- The Solidiom CLI (`solidiom`)
- The solidiom.org website
- The registry and signing infrastructure

## Coordinated Disclosure

We follow a coordinated disclosure process:

1. **Report** — submit via GitHub Private Vulnerability Reporting
2. **Triage** — we assess severity and scope within 7 days
3. **Fix** — we develop and test a patch
4. **Release** — we publish the fix and a security advisory
5. **Credit** — we acknowledge the reporter (unless anonymity is requested)

Target timelines:

- Critical: patch within 7 days
- High: patch within 14 days
- Medium: patch within 30 days
- Low: included in next scheduled release

## Registry Integrity

The registry uses Ed25519 asymmetric signatures for manifest integrity. If you discover a signature verification failure or a potential key compromise, report it as a Critical severity vulnerability.
