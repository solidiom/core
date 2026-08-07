---
contentSchemaVersion: 1
title: "Contributing"
description: "How to contribute to Solidiom: code, docs, accessibility, and community guidelines."
keywords: [contributing, open-source, github, community, guide]
locale: en
maturity: draft
product: "Solidiom"
productLayer: community
status: draft
---

# Contributing to Solidiom

Solidiom is developed on GitHub. Contributions are welcome across code, documentation, accessibility evidence, and translations.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork and install dependencies:

```sh
git clone https://github.com/<your-username>/solidiom.git
cd solidiom
pnpm install
```

3. Create a feature branch:

```sh
git checkout -b feat/my-feature
```

## Development Workflow

```sh
pnpm run build          # Build all packages
pnpm run typecheck      # Type-check the workspace
pnpm run test           # Run unit tests
pnpm run test:browser   # Run browser tests
pnpm run lint           # Lint the workspace
```

## What You Can Contribute

- **Primitives:** New headless components following the primitive DoD (§8.1)
- **Recipes:** Styling recipes for CSS, Tailwind, or UnoCSS profiles
- **Documentation:** Improvements to guides, API docs, or translations
- **Accessibility:** Keyboard audit records, screen reader testing, evidence
- **Bug fixes:** Issues labeled `good first issue` are a great starting point
- **Templates:** New application templates following §8.4

## Guidelines

- All code must pass `pnpm run typecheck` and `pnpm run test`
- Use Solidiom primitives for interactive behavior (no duplicate state machines)
- Follow the bilingual documentation requirement (English + Spanish)
- Include accessibility evidence for any new interactive primitive
- Use `pnpm changeset` to document user-facing changes

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be respectful, inclusive, and constructive.

## Communication

- **Issues:** Bug reports and feature requests on GitHub Issues
- **Discussions:** Architecture and design discussions on GitHub Discussions
- **Pull Requests:** All contributions go through PR review
