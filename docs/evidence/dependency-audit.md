---
id: dependency-audit
title: "Dependency Audit — Generated Report"
doc_type: generated
audience: "Solidiom contributors, security reviewers"
tags: [dependencies, security, audit, generated]
lifecycle: current
---

# Dependency Audit

Generated: 2026-07-22

## Summary

✓ All dependencies pinned via pnpm-lock.yaml.
✓ No floating ranges in production dependencies.

## Policy

- All recipe dependencies (including class-variance-authority) use lockfile-only ranges
- Renovate configured for grouped weekly PRs
- No `latest` tags in production
