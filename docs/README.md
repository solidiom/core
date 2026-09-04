---
id: documentation-index
title: "Solidiom Documentation"
doc_type: index
audience: "Solidiom contributors and maintainers"
tags: [documentation, navigation, lifecycle]
lifecycle: current
authority: documentation navigation and conventions
volatility: medium
---

# Solidiom Documentation

Internal documentation for Solidiom contributors and maintainers.

## Read first

- **Current plans and priorities:** [`docs/plans/README.md`](plans/README.md)
- **Consolidated execution plan (status, DoD, sequencing, library roadmap):** [`docs/plans/consolidated-plan.md`](plans/consolidated-plan.md)
- **Website architecture:** [`docs/architecture/website.md`](architecture/website.md)
- **Core library architecture:** [`docs/architecture/design.md`](architecture/design.md)

## Full table of contents

For a complete, grouped index of every document under `docs/`, see
[`docs/TOC.md`](TOC.md).

## Directory structure

| Directory           | Purpose                                     |
| ------------------- | ------------------------------------------- |
| `architecture/`     | Stable system design and accepted decisions |
| `contracts/`        | Binding schemas, rules, and policies        |
| `guides/`           | Task-oriented contributor instructions      |
| `operations/`       | Deployment, CI, rollback, and ops runbooks  |
| `plans/`            | Active status, priorities, and sequencing   |
| `qa/`               | Quality audits and support/perf matrices    |
| `evidence/`         | Generated or recorded verification evidence |
| `at-audit-results/` | Per-primitive assistive-technology records  |
| `releases/`         | Published release notes                     |
| `templates/`        | Fill-in-the-blank records                   |

## Plan authority

| Question                                    | Authority                                          |
| ------------------------------------------- | -------------------------------------------------- |
| What is happening now?                      | `docs/plans/README.md`                             |
| Which tasks are open or complete?           | `docs/plans/consolidated-plan.md`                  |
| What must catalog items satisfy?            | `docs/plans/consolidated-plan.md` §8               |
| In what order should work run?              | `docs/plans/consolidated-plan.md` §6/§7            |
| What is the active library release roadmap? | `docs/plans/consolidated-plan.md` §5               |
| Why were catalog decisions D1–D6 made?      | `docs/architecture/decisions/catalog-decisions.md` |
| Why are typeset/prose recipe utilities?     | `docs/architecture/decisions/typeset.md`           |

## Lifecycle

Every authored Markdown document carries a `lifecycle` field in YAML frontmatter.

| Value        | Meaning                                | Use                                                         |
| ------------ | -------------------------------------- | ----------------------------------------------------------- |
| `current`    | Stable and applicable                  | Use as the current design or reference                      |
| `active`     | Changes as work progresses             | Check recent status before relying on details               |
| `superseded` | Replaced by a named authority          | Follow `superseded_by`; retain only as a compatibility stub |
| `stale`      | Known to be outdated                   | Do not cite until repaired                                  |
| `archived`   | Historical, non-authoritative evidence | Use for context only; never infer current status            |

## Conventions

- Group by reader intent, not by document type alone.
- Keep normal authored paths at `docs/<category>/<file>`; `docs/architecture/decisions/<file>` is the approved deeper namespace.
- Put volatile status, counters, queues, and expected command results in one authoritative active plan only.
- Put durable rationale in architecture or decision records, not task trackers.
- Keep compatibility stubs short and point them to the replacement authority.
- Generated reports belong in `docs/evidence/` and are not hand-edited.
- Non-Markdown support files belong in `docs/assets/` unless a binding contract requires another location.
- Frontmatter is mandatory for authored Markdown: `id`, `title`, `doc_type`, `audience`, `tags`, and `lifecycle`.
- Prefer repository-root-relative paths in prose when naming canonical files.
- Run formatting and link/reference checks after moving a document.
