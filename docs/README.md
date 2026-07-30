# Solidiom Documentation

Internal documentation for Solidiom contributors and maintainers.

## Directory structure

| Directory       | Purpose                       | Contents                                                               |
| --------------- | ----------------------------- | ---------------------------------------------------------------------- |
| `architecture/` | How the system works          | Design documents, Solid 2 migration notes, runtime patterns            |
| `contracts/`    | Binding rules and policies    | Recipe contract, authoring guide, translation policy, analytics schema |
| `plans/`        | What we are building and when | Implementation plan, website plan, website tasks, typeset plan         |
| `guides/`       | How to do X                   | Adding a primitive, offline install, deployment                        |
| `evidence/`     | What we proved (generated)    | Axe scans, keyboard audits, browser results, build reports             |
| `templates/`    | Fill-in-the-blank records     | AT verification template                                               |
| `assets/`       | Non-markdown support files    | Brand screenshot, baseline JSON                                        |

## Lifecycle

Every document carries a `lifecycle` field in its YAML frontmatter.

| Value      | Meaning                                     | Action                                             |
| ---------- | ------------------------------------------- | -------------------------------------------------- |
| `current`  | Accurate and applicable                     | Use as-is                                          |
| `active`   | Living document, updated as work progresses | Check for recent changes before relying on details |
| `stale`    | Content is outdated                         | Regenerate or update before citing                 |
| `archived` | Task complete or superseded                 | Delete from tree; lives in git history only        |

When a document becomes stale or archived, delete it and let git history serve as the archive. Do not create an `archive/` directory.

## Conventions

- **Group by reader intent**, not by document type or audience.
- **No nesting beyond two levels**: `docs/<category>/<file>` is the deepest normal case.
- **Generated reports** go in `evidence/`. Authors never edit them by hand. Tools that produce them write directly to `docs/evidence/`.
- **Non-markdown files** (images, JSON baselines) go in `assets/`.
- **Frontmatter is mandatory** on every `.md` file: `id`, `title`, `doc_type`, `audience`, `tags`, `lifecycle`.
- **Cross-references** use repo-root-relative paths: `` `docs/contracts/recipe-contract.md` ``.

## Current inventory

```
docs/
├── README.md
├── architecture/
│   ├── design.md                      (current)
│   ├── exit-animations.md             (current)
│   └── solid2-migration-notes.md      (current)
├── contracts/
│   ├── posthog-event-schema.md        (current)
│   ├── recipe-authoring-guide.md      (current)
│   ├── recipe-contract.md             (current)
│   └── translation-policy.md          (current)
├── plans/
│   ├── implementation-plan.md         (active)
│   ├── typeset-plan.md                (current)
│   ├── website-plan.md                (active)
│   └── website-tasks.md               (active)
├── guides/
│   ├── adding-a-primitive.md          (current)
│   ├── deployment.md                  (current)
│   └── offline-install.md             (current)
├── evidence/
│   ├── adapter-styling-audit.md       (current)
│   ├── at-audit-results/
│   │   └── index.md
│   ├── axe-scan-results.md            (current)
│   ├── compile-time-results.md        (current)
│   ├── cross-browser-results.md       (current)
│   ├── dependency-audit.md            (current)
│   ├── infrastructure-audit.md        (current)
│   ├── keyboard-audit-results.md      (current)
│   ├── manual-evidence-matrix.md      (current)
│   ├── no-transform-build-results.md  (current)
│   ├── recipe-contract-audit.md       (current)
│   ├── security-audit.md              (current)
│   ├── ssr-hydration-test-results.md  (current)
│   └── visual-regression-results.md   (current)
├── templates/
│   └── at-verification-template.md    (current)
└── assets/
    ├── brand-README.md
    ├── primitives-baseline.json
    └── solidiom-site.png
```
