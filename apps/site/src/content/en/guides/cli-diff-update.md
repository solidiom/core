---
contentSchemaVersion: 1
title: "Diff and Update Source Installs"
description: Track and update source-installed primitives with solidiom diff, update, and detach.
keywords:
  - diff
  - update
  - detach
  - source install
  - merge
  - lockfile
locale: en
maturity: beta
order: 7
audience: intermediate
---

# Diff and Update Source Installs

When primitives are installed in source mode, `solidiom diff`, `solidiom update`, and `solidiom detach` help you track and manage changes.

## Diff

`solidiom diff` compares installed source files against their lockfile digests.

```bash
solidiom diff
solidiom diff --primitive dialog
```

### Flags

| Flag | Description |
|------|-------------|
| `--primitive` | Filter by primitive name |
| `--json` | Output as JSON |

### Statuses

Each file receives one of four statuses:

| Status | Symbol | Meaning |
|--------|--------|---------|
| `unchanged` | — | Local digest matches lockfile (not shown in output) |
| `modified` | M | Local file content differs from lockfile digest |
| `deleted` | D | File tracked in lockfile no longer exists |
| `new` | A | File exists locally but is not in the lockfile |

If no files have changed, the output is:
```
No local modifications.
```

## Update

`solidiom update` brings source-installed primitives to the latest upstream version using a three-way merge algorithm.

```bash
solidiom update dialog
```

### Flags

| Flag | Description |
|------|-------------|
| `--dry-run` | Show what would change without writing |
| `--json` | Output as JSON |

### How It Works

For each file tracked in `.solidiom/lock.json`:

1. Read the base digest from the lockfile (what was originally installed)
2. Read the local content (what you have now)
3. Read the upstream content (the new version from the registry or monorepo)

### Decision Matrix

| Local | Upstream | Action |
|-------|----------|--------|
| Unchanged | Changed | Overwrite with upstream (safe update) |
| Changed | Unchanged | Keep local |
| Changed | Changed | Attempt line-level merge |
| Unchanged | Unchanged | Skip |

### Conflict Resolution

When both local and upstream have changed the same lines, the update produces diff3-style conflict markers:

```
<<<<<<< local
  local content
=======
  upstream content
>>>>>>> upstream
```

Alongside the conflicted file, two sidecar files are written:
- `<file>.local` — Your local version
- `<file>.upstream` — The upstream version

After resolving conflicts, remove the sidecar files and run `solidiom update` again.

### AST-Based Import Rewriting

For `.tsx` and `.jsx` files with structural changes, the update uses ts-morph AST rewriting to preserve import structure. This ensures runtime imports remain correct after an update.

### Output Symbols

| Symbol | Status |
|--------|--------|
| Up arrow | Updated (safe overwrite) |
| Double arrow | Auto-merged |
| Bolt | Conflict |
| Circle | Skipped (detached) |
| Cross | Skipped (deleted locally) |

## Detach

`solidiom detach` marks source-installed files as detached from upstream updates. It only updates `.solidiom/lock.json` metadata and is non-destructive.

```bash
solidiom detach dialog
```

Detached files are skipped by `solidiom update`. Use this when you have heavily customized a primitive's source and do not want updates to overwrite or conflict with your changes.