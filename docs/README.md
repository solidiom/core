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
- **Website/catalog status and DoD:** [`docs/plans/website-tasks.md`](plans/website-tasks.md)
- **Catalog delivery order:** [`docs/plans/task-sequencing.md`](plans/task-sequencing.md)
- **Library/release roadmap:** [`docs/plans/implementation-plan.md`](plans/implementation-plan.md)
- **Website architecture:** [`docs/architecture/website.md`](architecture/website.md)
- **Core library architecture:** [`docs/architecture/design.md`](architecture/design.md)

## Directory structure

| Directory        | Purpose                                              |
| ---------------- | ---------------------------------------------------- |
| `architecture/`  | Stable system design and accepted decisions          |
| `contracts/`     | Binding schemas, rules, and policies                 |
| `plans/`         | Active status, priorities, and sequencing            |
| `history/plans/` | Non-authoritative evidence moved out of active plans |
| `guides/`        | Task-oriented contributor instructions               |
| `evidence/`      | Generated or recorded verification evidence          |
| `templates/`     | Fill-in-the-blank records                            |
| `assets/`        | Images and other documentation support files         |

## Plan authority

| Question                                          | Authority                                          |
| ------------------------------------------------- | -------------------------------------------------- |
| What is happening now?                            | `docs/plans/README.md`                             |
| Which website/catalog tasks are open or complete? | `docs/plans/website-tasks.md`                      |
| What must catalog items satisfy?                  | `docs/plans/website-tasks.md` §8                   |
| In what order should catalog work run?            | `docs/plans/task-sequencing.md`                    |
| What is the active library release roadmap?       | `docs/plans/implementation-plan.md`                |
| Why were catalog decisions D1–D6 made?            | `docs/architecture/decisions/catalog-decisions.md` |
| Why are typeset/prose recipe utilities?           | `docs/architecture/decisions/typeset.md`           |
| What happened during completed phases?            | `docs/history/plans/`                              |

`docs/plans/website-plan.md` and `docs/plans/typeset-plan.md` are compatibility stubs, not active authorities.

## Lifecycle

Every authored Markdown document carries a `lifecycle` field in YAML frontmatter.

| Value        | Meaning                                | Use                                                         |
| ------------ | -------------------------------------- | ----------------------------------------------------------- |
| `current`    | Stable and applicable                  | Use as the current design or reference                      |
| `active`     | Changes as work progresses             | Check recent status before relying on details               |
| `superseded` | Replaced by a named authority          | Follow `superseded_by`; retain only as a compatibility stub |
| `stale`      | Known to be outdated                   | Do not cite until repaired                                  |
| `archived`   | Historical, non-authoritative evidence | Use for context only; never infer current status            |

Completed implementation detail may live under `docs/history/plans/` when removing it from an active plan materially improves retrieval. Every history document must identify the active authority and must not duplicate live counters or status claims.

## Conventions

- Group by reader intent, not by document type alone.
- Keep normal authored paths at `docs/<category>/<file>`; `docs/history/plans/<file>` and `docs/architecture/decisions/<file>` are the approved deeper namespaces.
- Put volatile status, counters, queues, and expected command results in one authoritative active plan only.
- Put durable rationale in architecture or decision records, not task trackers.
- Keep compatibility stubs short and point them to the replacement authority.
- Generated reports belong in `docs/evidence/` and are not hand-edited.
- Non-Markdown support files belong in `docs/assets/` unless a binding contract requires another location.
- Frontmatter is mandatory for authored Markdown: `id`, `title`, `doc_type`, `audience`, `tags`, and `lifecycle`.
- Prefer repository-root-relative paths in prose when naming canonical files.
- Run formatting and link/reference checks after moving a document.
