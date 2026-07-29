# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| Latest `next` prerelease | Yes |
| Previous `next` prerelease | Best effort |
| Stable releases (when available) | Yes |

Only the latest published prerelease receives security patches. Once stable
releases begin, the current major version will be actively supported.

## Reporting a Vulnerability

**Do not report security vulnerabilities through public GitHub Issues.**

Use [GitHub's private vulnerability reporting](https://github.com/openCenter-cloud/solidiom/security/advisories/new) to submit a report directly to the maintainers.

### What to include

- Description of the vulnerability and its potential impact.
- Steps to reproduce or a proof-of-concept.
- Affected packages or files (if known).
- Any suggested fix or mitigation.

### Response timeline

- **Acknowledgment:** within 3 business days.
- **Initial assessment:** within 7 business days.
- **Fix or mitigation:** within 30 days for critical/high severity; best effort for lower severity.

### Coordinated disclosure

We follow coordinated disclosure practices:

1. Reporter submits via GitHub private reporting.
2. Maintainers acknowledge and assess severity.
3. A fix is developed in a private fork or branch.
4. The fix is released and a security advisory is published.
5. The reporter is credited (unless they request anonymity).

We request that reporters allow up to 90 days before public disclosure to give
us time to develop and release a fix.

## Registry and CLI Security

- Registry manifests are signed with per-file checksums (see REG-005/REG-006).
- The CLI verifies signatures and hashes before installing source code.
- Verification fails closed: missing or invalid signatures block installation.
- Dependency metadata is pinned at publish time.

## Scope

This policy covers:

- All packages in the `@solidiom/*` scope.
- The `solidiom` CLI.
- The registry at `registry.solidiom.org` (when available).
- The website at `solidiom.org`.

Out of scope:

- Third-party adapters not published under `@solidiom/*`.
- Consumer applications built with Solidiom (report those to the application maintainers).

## Contact

For questions about this policy, open a Discussion in the repository.
