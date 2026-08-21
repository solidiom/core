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

## AI-Assisted Contributions

AI-assisted and AI-generated contributions are welcome in this project.

We consider AI tools—including coding assistants, large language models, and autonomous or semi-autonomous development agents—to be development tools. Code, documentation, tests, designs, issues, pull requests, and other content produced wholly or partially with AI assistance will be evaluated on the **same technical merits and community standards as any other contribution**.

The use of AI neither disqualifies a contribution nor lowers the standards required for acceptance.

Contributors remain responsible for everything they submit. In particular, contributors are expected to:

- **Understand and stand behind their contribution.** Contributors should be able to explain, review, modify, and maintain the work they submit.
- **Verify correctness and quality.** AI-generated output must receive appropriate human review, testing, and validation before submission.
- **Comply with project licensing requirements.** The terms of any AI tool used must not impose restrictions that conflict with this project's license or contribution policies.
- **Respect copyright and intellectual property.** Contributors must ensure that generated content does not improperly incorporate third-party copyrighted material.
- **Provide required attribution and provenance.** Third-party code, content, or other material must retain any attribution, notices, or licensing information required by its license.
- **Meet security and maintainability standards.** AI assistance does not exempt a contribution from security review, testing, documentation, architectural requirements, CI checks, or normal code review.
- **Avoid shifting the review burden to maintainers.** Large volumes of unreviewed, low-quality, unexplained, or mechanically generated contributions may be rejected regardless of whether AI was involved.

The core principle is:

> **AI assistance is welcome; contributor responsibility remains with the human submitting the contribution.**

AI should be used to augment engineering judgment, not replace it. Maintainers may request additional explanation, testing, provenance information, or disclosure of significant AI assistance when reasonably necessary to evaluate a contribution.

This policy is intentionally aligned with the broader open-source approach advocated by the Linux Foundation and reflected in CNCF community guidance: AI-generated contributions can participate in normal open-source development, provided they meet the same expectations for quality, security, licensing, provenance, accountability, and human review.

### Related guidance

- **Linux Foundation — Guidance Regarding Use of Generative AI Tools for Open Source Software Development:** [Linux Foundation Generative AI Policy](https://www.linuxfoundation.org/legal/generative-ai)
- **CNCF — Sustaining Open Source in the Age of Generative AI:** [CNCF: Sustaining Open Source in the Age of Generative AI](https://www.cncf.io/blog/2026/03/10/sustaining-open-source-in-the-age-of-generative-ai/)
- **CNCF — The State of AI in CNCF Projects:** [CNCF: The State of AI in CNCF Projects](https://www.cncf.io/blog/2026/04/29/the-state-of-ai-in-cncf-projects-a-first-look-at-the-data/)

Individual projects and organizations may establish additional requirements for AI-assisted contributions where appropriate.

## Communication

- **Issues:** Bug reports and feature requests on GitHub Issues
- **Discussions:** Architecture and design discussions on GitHub Discussions
- **Pull Requests:** All contributions go through PR review
