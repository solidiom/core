---
contentSchemaVersion: 1
title: "Plan a Primitive Installation"
description: Preview and validate a primitive installation plan with solidiom plan — resolution, policy, and offline behavior.
keywords:
  - plan
  - dependency
  - resolution
  - policy
  - offline
  - capability graph
locale: en
maturity: beta
order: 5
audience: intermediate
---

# Plan a Primitive Installation

`solidiom plan` resolves the capability graph for a primitive and shows which packages would be installed, without making any changes to the project.

## Basic Usage

```bash
solidiom plan dialog
```

Output shows the primitive, its dependencies, and any adapters required:

```
Plan for dialog (package mode):

  @solidiom/dialog@0.0.1-next.0 [requested]
  @solidiom/runtime@0.0.1-next.0 [dependency]

2 packages resolved.
```

## Flags

| Flag | Description |
|------|-------------|
| `--json` | Output as JSON |
| `--mode` | Install mode: `package` or `source` |
| `--registry` | Custom registry URL for resolution |
| `--no-network` | Use only cached or local registry data |
| `--deliverable` | Product-layer deliverable to resolve |
| `--styling` | Styling profile to resolve |

## Resolution Order

The plan resolves package information using this priority:

1. **Registry catalog** — Reads `registry/index.json` from a custom path, `SOLIDIOM_REGISTRY_PATH`, the monorepo `registry/` directory, `node_modules/@solidiom/registry/`, or `.solidiom/registry-cache.json`
2. **node_modules** — Scans `node_modules/@solidiom/<primitive>/package.json` for dependencies and adapters
3. **Builtin primitives** — Built-in knowledge of core primitives (dialog, select, calendar, carousel, popover, tooltip, menu, combobox, date-picker, button, checkbox, switch, slider, accordion, tabs, collapsible, toast, listbox)

## JSON Output

With `--json`, the plan returns a structured object:

```bash
solidiom plan select --json
```

```json
{
  "primitive": "select",
  "mode": "package",
  "entries": [
    {
      "package": "@solidiom/select",
      "version": "0.0.1-next.0",
      "isAdapter": false,
      "reason": "requested"
    },
    {
      "package": "@solidiom/runtime",
      "version": "0.0.1-next.0",
      "isAdapter": false,
      "reason": "dependency"
    },
    {
      "package": "@solidiom/adapter-positioning-floating-ui",
      "version": "0.0.1-next.0",
      "isAdapter": true,
      "reason": "capability"
    }
  ],
  "stylingOutputs": [],
  "violations": []
}
```

Each entry includes:
- `package` — npm package name
- `version` — resolved version
- `isAdapter` — whether this is a positioning or date adapter
- `reason` — `requested`, `dependency`, or `capability`

## Product-Layer Validation

When you specify `--deliverable` or `--styling`, the plan validates against the registry entry's declared capabilities. If the primitive does not support the requested deliverable or styling output, it appears as a policy violation.

```bash
solidiom plan button --deliverable component --styling tailwind
```

## Policy Violations

The plan checks against `.solidiom/policy.json`:

- **Version constraints** — If `allowedPrimitiveVersions` specifies a range that the resolved version does not match, the plan reports a violation
- **Missing deliverables** — Requesting a deliverable the primitive does not declare
- **Styling profile mismatch** — Requesting a styling profile the primitive does not support

When violations are present, the plan exits with code 1 and lists each violation.

## Offline Fallback

When neither a registry catalog nor `node_modules` are available, the plan falls back to builtin primitives. Builtin entries can only confirm the `primitive` deliverable — they cannot claim component, block, template, or theme support, and `stylingOutputs` is always empty. This prevents the plan from promising capabilities it has not verified.