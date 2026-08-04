---
id: task-sequencing
title: "Solidiom Catalog — Component, Block, and Template Sequencing Plan"
doc_type: plan
audience: "Solidiom project leads, contributors"
tags: [components, blocks, templates, sequencing, m4, backlog]
lifecycle: active
date: 2026-08-04
---

# Solidiom Catalog — Component, Block, and Template Sequencing Plan

**Status:** approved — D1–D6 resolved (§3); Phase 0 complete, Phase 1 (COMP-001..006 vertical slice) may begin
**Parent plan:** `docs/plans/website-tasks.md` §§8.2–8.4, §9.0, §§9.2–9.5
**Scope:** the 95 open M4 catalog items — 30 components, 36 blocks, 29 templates. Phase 0's
machinery additionally covers the theme layer (§4.2); the four preset content sets are
tracked as `PRESET-006` in `website-tasks.md` §9.5, not here.
**Blocks:** G4 exit checklist
**Task rows:** `website-tasks.md` §9.0 owns `FOUND-001`..`009` status. This document owns
the sequence and the decisions; it keeps no parallel status table, for the reason
`website-tasks.md` §11 documents three times over.

## 1. What this document is

`docs/plans/website-tasks.md` defines _what_ each catalog item must satisfy (the layer
Definitions of Done in §8) and _which_ items exist (the queues in §9). It does not say
in what order to build them, nor what machinery they plug into. This document supplies
both, and records the design decisions that must be settled before the first
`COMP-*` row can start.

It is a sequencing plan, not a second source of truth for scope. Where this document
and §9 disagree about which items exist, §9 wins.

### 1.1 What this document is not

- Not an amendment to any Definition of Done. `website-tasks.md` §8.2.1, §8.3.1, and §8.4.1
  are normative and were written by `FOUND-001`; this document records why they read as they
  do, and points at their clause numbers rather than restating them.
- Not a schedule. The effort model in §8 is derived from §1.2's size guide, not from
  measured throughput on this layer, of which there is none.
- No longer a proposal on the decisions: D1–D6 are resolved and recorded in §3, with the
  rejected alternatives kept so a later reader knows what was chosen over what.

---

## 2. Findings — the machinery does not exist yet

The most consequential fact about this work: components, blocks, and templates have
almost no implementation layer. This is not "author 86 content entries into existing
scaffolding." The scaffolding is the majority of the risk.

Each finding below was verified against the tree at `532e3f6` and re-verified at `bb1a0c7`,
14 commits later. All eleven still hold; F6 and F9 were corrected in the re-check and are
marked below.

| #   | Finding                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | Evidence                                                                                   |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| F1  | The registry has no non-primitive deliverable arrays. `registry/index.json` top-level keys are `$schema, version, generatedAt, integrity, primitives, adapters` — 52 primitives, 6 adapters, and nothing else.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `node -e 'Object.keys(require("./registry/index.json"))'`                                  |
| F2  | `tools/registry-build.ts` only discovers packages whose `nx.tags` include `layer:primitive` (or `layer:adapter`). There is no producer for component, block, or template manifests. It also `unlinkSync`s orphan `registry/*.json` files, so manifests written by any other tool are deleted on the next `registry:build`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `tools/registry-build.ts` `isPublicPrimitive()`, orphan sweep                              |
| F3  | A "component deliverable" is currently a declaration with no component-specific source. `registry/button.json` has `deliverables: ["component","primitive"]` and `styling.outputs: ["css","tailwind","unocss"]`, but `source.files` holds exactly the four _primitive_ files.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         | `registry/button.json`; `packages/button/package.json` `nx.metadata.registry.deliverables` |
| F4  | Consequently `solidiom add button --deliverable component` writes primitive source into `componentDir`. `install.ts`'s `resolvePrimitiveSource()` looks only at `packages/<name>/source` or `node_modules/@solidiom/<name>/source`, regardless of deliverable.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `packages/cli/src/source-install/install.ts`                                               |
| F5  | The component and block content directories are empty. `apps/site/src/content/{en,es}/components/` = 0 entries, `blocks/` = 0, `themes/` = 0. `templates/` has 2 EN + 2 ES, which are `CLI-007` artifacts, not `TPL-*` catalog entries.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | directory listing                                                                          |
| F6  | Every recipe wrapper scope is already contract-backed, but the wrapper sets are **not** symmetric across profiles. `tools/recipe-contract-definitions.ts` exports 15 definitions — `accordion`, `alert`, `badge`, `button`, `checkbox`, `dialog`, `menu`, `popover`, `select`, `switch`, `tabs`, `toast`, `tooltip`, plus `typeset` and `prose` — and `recipe:contract` validates all 15. `recipes-css` and `recipes-unocss` each hold 13 `.tsx` wrappers; **`recipes-tailwind` holds 14**, the extra being `typeset.tsx`. So the **11** components whose primitive already has a recipe scope need **no** new contract definition — Button, Alert, Dialog, Select, Dropdown Menu (`menu`), Tabs, Toast, Tooltip, Checkbox, Switch, Popover — while the other **19** of 30 do. Two contract scopes, `accordion` and `badge`, have no component row at all. **Correction (re-check at `bb1a0c7`):** the original wording claimed all three profiles hold "the same 13". They do not, and the asymmetry matters — D1 defines a component as the wrapper for the active profile, so an uneven wrapper set means an uneven component catalog. The gap is `RECIPE-008`'s open item (typeset ships as a Tailwind wrapper with no css/unocss counterpart) and must be closed or explicitly excepted before Phase 2 fans out. | `tools/recipe-contract-definitions.ts`; `pnpm run recipe:contract`; directory listings     |
| F7  | No component, block, or template gate exists. `tools/` contains `primitive-catalog-gate.ts` and `primitive-completion-gate.ts` and no analogue for the other three layers.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `ls tools/`                                                                                |
| F8  | Catalog docs load from two different places by layer. `primitives`, `examples`, and `accessibilityContracts` collections use `base: "../../packages"` with `*/docs/**`. `components`, `blocks`, `templates`, and `themes` use `base: "./src/content"` with `{en,es}/<layer>/**`. `registry-build.ts`'s `documentationMetadata()` only ever reads `packages/<name>/docs`, so a component's site-side docs can never influence its registry `documentation.status`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     | `apps/site/src/content.config.ts`; `tools/registry-build.ts`                               |
| F9  | The block manifest and the block collection disagree on state vocabulary, and **neither side enforces anything**. `docs/contracts/block-catalog-manifest.json` records `states` as prose strings ("Loading (credentials submit)"). The Astro `blocks` collection declares `requiredStates: z.array(z.enum(["loading","empty","error","restricted"])).default([])`. **Correction (re-check at `bb1a0c7`):** the original wording said the collection "requires" the field. The `.default([])` makes it optional — an entry omitting states validates as an empty array rather than failing — so no artifact today can reject a stateless block. D4 accordingly drops the default as well as adding the structured field.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               | manifest; `content.config.ts:147`                                                          |
| F10 | `tools/recipe-emit-css.ts` throws for any variant-bearing scope absent from `CLASS_PREFIXES`, which currently holds only `button` and `badge`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | `tools/recipe-emit-css.ts`                                                                 |
| F11 | `destinations.ts` already maps component→`componentDir`, block→`blockDir`, theme→`themeDir`, and deliberately throws `UnsupportedDeliverableError` for template (handled by `solidiom create`). This part needs no change.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            | `packages/cli/src/source-install/destinations.ts`                                          |
| F12 | **The block manifest cited components under two numbering schemes, and the `.md` companion held the answer the whole time.** Ten citations in `block-catalog-manifest.json` used §9.1's `PRIM-*` numbers with a `COMP-` prefix; each matched `PRIM-<same number>` exactly. `BLOCK-000A` filed the eight that fell outside `COMP-001..021` as unresolvable without reading `block-catalog-manifest.md`, which names every cited ID inline. Two more landed **inside** the approved range and so resolved cleanly to the wrong component: `COMP-016` meant Data Table in 19 blocks (§9.2 defines it as Combobox) and `COMP-014` meant Command Palette in one. Nine intended components had no approved row at all, so §9.2 is extended 21 → 30. Corrected at `schemaVersion: 2`; `proposedComponents` empty for all 36. The lesson for `FOUND-005`: an ID-range check passes on every one of these defects, so resolution must be by **name**, and the `.json`, the `.md`, and §9.2 must be asserted to agree.                                                                                                                                                                                                                                                                                                          | `docs/contracts/block-catalog-manifest.{json,md}`; §9.2; `BLOCK-000B`                      |

### 2.1 The block dependency graph is dense, and that changes the sequencing

`docs/contracts/block-catalog-manifest.json` declares 367 component-dependency edges
across 36 blocks: **minimum 5 per block, maximum 17, mean 10.2.**

Those figures are post-correction. Version 1 of the manifest reported 317 edges with a mean
of 8.8, because ten citations carried `PRIM-*` numbers under a `COMP-` prefix and fifty of
them had been parked in a non-resolving `proposedComponents` field rather than counted as
dependencies (F12).

The practical consequence is that blocks do **not** meaningfully overlap component work.
Under a fanout-optimal component order (§6.2), the first block does not unlock until the
**8th** component lands, only 4 of 36 are available after 12, and full breadth arrives at
step 28. See the unlock curve in §7.1. Any plan that assumes blocks proceed in parallel with
components from the start is wrong.

Two components have **zero** block consumers and should be scheduled last: `COMP-018 Sheet`
and `COMP-016 Combobox`. Sheet's was already known; Combobox's was masked by the numbering
defect, since the 19 blocks that appeared to depend on `COMP-016` meant Data Table
(`COMP-023`). `COMP-019 Navigation Menu`, `COMP-014 Radio Group`, and five of the newly
added components have exactly one consumer each. §9.2 still requires all of them for 30/30.

---

## 3. Decisions D1–D6 — resolved

All six are settled. This section is the **decision record**: what was chosen, what was
rejected, and why. It is not where a requirement should be read from —
`website-tasks.md` §8.2.1, §8.3.1, and §8.4.1 are normative, and each clause there is
numbered so `FOUND-004`/`FOUND-005` can cite it in source. Where a decision produced a
requirement, the resolution below points at the clause instead of restating it, so there is
only ever one copy of the rule.

### D1 — What is a component, physically? → **(b) the recipe wrapper**

§8.2 requires "CLI plan/add/verify/diff/update flows work with signed manifests and
source ownership," which requires per-component files carrying digests, and simultaneously
"it uses the corresponding Solidiom primitive and introduces no duplicate behavior layer."

| Option           | Shape                                                                                                                        | Assessment                                                                                                                                                                                                                                                                                                                           |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| (a) Status quo   | Component = primitive source + recipe + docs; no new files                                                                   | Cheapest. But `--deliverable component` materializes primitive files (F4), so "source ownership of a component" is indistinguishable from owning the primitive. Does not satisfy §8.2 as written.                                                                                                                                    |
| **(b) Resolved** | Component = the composed recipe wrapper, `packages/recipes-<profile>/src/recipes/<scope>.tsx`, plus its primitive dependency | The wrapper already _is_ "primitive + styling." Each recipes package already has a published `source/` mirror enforced by `audit-package-source-parity.ts` (RECIPE-006), so digests and verification come free. Requires teaching `install.ts` to resolve component source from the recipes package for the active `stylingProfile`. |
| (c) New packages | `packages/component-<name>/` × 21                                                                                            | Cleanest conceptual separation. Costs 21 new packages, build targets, tsup configs, publish surfaces, and registry discovery rules.                                                                                                                                                                                                  |

**Resolved: (b).** It reuses three existing mechanisms (recipe wrappers, `source/` mirrors,
parity auditing) instead of inventing a fourth, and it makes the styling profile an explicit
input to component installation, which matches `ConfigSchema.stylingProfile` already
existing and being optional-with-no-default (verified at `schemas.ts:27`).

Normative form: `website-tasks.md` §8.2.1 req 1 and req 5.

Two consequences worth recording:

- A component's identity is per-profile: `recipes-css/button.tsx` and
  `recipes-tailwind/button.tsx` are different files, which is why §8.2.1 req 4 records source
  **per styling output** rather than as one file list.
- **(b) inherits F6's asymmetry.** `recipes-tailwind` carries a 14th wrapper the other two
  profiles lack, so "the component set is the wrapper set" is not yet true uniformly.
  `FOUND-009` closes or excepts it before Phase 2 fans out.

### D2, part one — index versioning → **bump to v3 in one coordinated change**

Rejected: additive at v2 (add the three arrays without touching `version` or `$schema`);
additive at v2 plus a `layers[]` capability field.

`registryIndexSchema` (`packages/cli/src/registry-schema.ts:119`) pins
`version: z.literal(SUPPORTED_REGISTRY_INDEX_VERSION)` and `$schema` to the v2 URL, and
`readRegistryIndex` **throws** `RegistrySchemaError` on mismatch rather than returning a
partially trusted object (REG-004's deliberate design). The additive path is technically
available — the schema is a plain `z.object` with no `.strict()` anywhere in the file, so
unknown top-level keys are stripped rather than rejected — but it was rejected on two
grounds: a CLI that does not understand the new layers would silently ignore them instead
of saying so, and the `$schema` URL would then misdescribe the document.

The bump is affordable **because nothing publishes the registry yet.** Per `REG-008` there
is no `packages/registry` and no publish step, so the only consumer is the in-repo CLI
reading the workspace tree. "Breaking change" here means a same-PR edit, not an ecosystem
break — and paying it now is far cheaper than retrofitting a version bump after `REG-008`
re-homes signing and publication.

### D2, part two — manifest paths → **namespaced directories**

Resolved: `registry/<layer>/<name>.json` for components, blocks, templates, and themes.
Rejected: flat with a layer suffix (`registry/button.component.json`); one manifest per name
describing multiple deliverables.

D1(b) forces this: Button now has two deliverables with different source file sets — four
primitive files versus one wrapper per profile — which one manifest cannot describe without
becoming conditional, and `integrity.fileDigests` would need per-deliverable scoping,
reaching further into REG-005/REG-006 than a directory boundary does.

Normative form: `website-tasks.md` §8.2.1 req 4, §8.3.1 req 7, §8.4.1 req 7.

Two companion changes, both verified necessary and neither obvious — §4.1 records where they
land in `FOUND-002`:

- The orphan sweep at `registry-build.ts:903` does `readdirSync(REGISTRY_DIR)` and `continue`s
  on anything not ending in `.json`. A subdirectory does not end in `.json`, so its contents
  would never be swept and stale manifests would accumulate silently. The sweep must recurse.
- `.prettierignore:9` is `registry/*.json`, which matches direct children only. A file at
  `registry/components/button.json` would be Prettier-formatted while the generator writes
  its own byte-stable output, and the two would rewrite each other indefinitely — precisely
  the `docs/axe-scan-results.md` failure fixed in `3705238`. It must become
  `registry/**/*.json`.

### D3 — Docs location for components, blocks, templates, themes → **layer-aware resolver**

Resolved: extend `registry-build.ts` with a layer-aware docs resolver reading
`apps/site/src/content/{en,es}/<layer>/<name>.md`. Rejected: leaving `documentationMetadata()`
primitive-only and having the gate reconcile; mirroring the primitive convention in a new
`packages/catalog-docs/` tree.

Content stays where the four collections already point (F8). The objection that a tool in
`tools/` would now depend on `apps/site` does not hold — `audit-theme-parity.ts` reads
`apps/site/src/assets/tokens.css`, `theme-contract-definitions.ts` treats those site tokens
as a canonical source, and `vertical-slice-gate.ts` reads site files directly; `A11Y-008`
extended the first of those deliberately.

The rejected first alternative was the one to avoid actively: it would make
`documentation.status` mean different things by layer, and both the CLI's `inspect`/`plan`
output and the `DOCS-005` install panel read that field, so every component would render a
blank status. Under D1(b) the component's source is a shared recipes package, which is also
why the colocation alternative has no natural per-component directory to colocate into.

Normative form: `website-tasks.md` §8.2.1 req 6 and req 7.

### D4 — Block state vocabulary → **structured field, prose retained, default dropped**

Resolved: a structured `requiredStates` array using the collection's enum
(`loading | empty | error | restricted`) on each of the 36 manifest entries, with the prose
`states` retained as human-facing detail. Rejected: enum only, prose dropped; prose in the
manifest with structured states only in content frontmatter.

Prose was kept because "Loading (credentials submit)" says _which_ interaction loads, and
that is the useful half. Populating the structured field is mechanical — the prose already
covers all four states plus success in every entry.

Normative form: `website-tasks.md` §8.3.1 req 4 and req 5.

Companion change from the F9 correction: **drop `.default([])`** from the collection's
`requiredStates` so a block content entry omitting states fails validation instead of
passing as empty. Without that, `FOUND-005` is the only thing between a stateless block and
a green build.

### D5 — `CLASS_PREFIXES` coverage → **derive by default, map for exceptions only**

Resolved: `recipe-emit-css.ts` derives `solidiom-<scope>` by default and consults
`CLASS_PREFIXES` only for exceptions, of which `button: "solidiom-btn"` is the single
documented one. Rejected: enumerating an entry per variant-bearing component (the original
proposal); renaming `solidiom-btn` → `solidiom-button` to empty the exception map.

This removes F10 as a failure mode rather than enumerating past it: the emitter can no
longer throw for a missing prefix, and no hand-maintained list has to be updated in a file
unrelated to the component being added — the drift pattern that already bit
`phase1-gate.ts`'s hand-listed tools tests and `docs/axe-scan-results.md`.

The rename was rejected on measured blast radius, not principle: `solidiom-btn` occurs 220
times across 20+ files, including generated output in all three recipe packages, both `src/`
and `source/` mirrors, `unocss-preset/source/generated-variant-rules.ts`, the recipe-parity
fixture, three hand-written test files, two changesets, and the authoring guide. The defect
worth fixing is the throw, not the abbreviation. The rename stays available as independent
pre-GA work.

Implementation lands in `FOUND-008`. There is no §8 clause for this one — it is emitter
behavior, not a per-item requirement.

### D6 — `proposedComponents` resolution → **superseded; the citations were correctable**

`BLOCK-000A` moved eight out-of-range IDs to a non-resolving `proposedComponents` field on
the grounds that they could not be mapped. **That was wrong, and the decision recorded here
originally — defer resolution to the pilot blocks, bounded by a gate — is superseded.**

The names were never missing. `docs/contracts/block-catalog-manifest.md`, the companion file
beside the JSON, names every cited ID inline — `COMP-042 (Spinner)`, `COMP-033 (Progress)`,
and so on. Reading it shows all eight were §9.1 `PRIM-*` numbers carrying a `COMP-` prefix,
each matching `PRIM-<same number>` exactly. Two further citations had the same defect but
landed **inside** `COMP-001..021`, so they resolved cleanly to the wrong component and were
never flagged at all: `COMP-016` meant Data Table in 19 blocks, and `COMP-014` meant Command
Palette in `BLOCK-SHELL-02` while correctly meaning Radio Group in `BLOCK-SETTINGS-02`.

Resolved as `BLOCK-000B`: correct all ten citations, and extend §9.2 from 21 to 30 because
nine of the intended components had no approved row. `proposedComponents` is now empty for
every block, so nothing remains to defer. The bounded-deferral mechanism this decision
originally specified has no work left to do, and `FOUND-005`'s assertion that
`proposedComponents` is empty becomes a regression guard rather than a scheduling device.

Rejected: continuing to defer, since there is no longer an open question; declaring
`COMP-042` not a component and stripping it, since it is Spinner and all 36 blocks need it.

**What the mistake cost, recorded because the pattern will recur.** Two successive readings
of this defect — `BLOCK-000A`'s "eight unresolvable IDs", and this section's earlier claim
that `COMP-042`'s identity "is not recoverable from any artifact" — were both produced by
reading the `.json` and not the `.md` beside it. A machine-readable file and its prose
companion carried the same data at different completeness, and nothing asserted they agreed.
The useful conclusion is not "read more carefully" but the one now in §8.3.1 req 2: resolve
by name, and have the gate compare all three of the `.json`, the `.md`, and §9.2.

`COMP-018 Sheet` remains genuinely unconsumed, and the correction produced a second such
case — `COMP-016 Combobox`, whose 19 apparent consumers meant Data Table. Both sit last in
the §6.2 order, and the pilot blocks decide whether either has a real consumer.

Normative form: `website-tasks.md` §8.3.1 req 2 and req 3.

**Dangling reference, now fixed.** The manifest's `resolution.decision` field cited
`docs/plans/primitives.md §2 decision 13`, and **that file was deleted** in `e0fa091`
("retire two satisfied plans"), so the recorded justification for `BLOCK-000A` no longer
existed in the tree. Recovered from git history, decision 13 read: "Out-of-range component
IDs move to `proposedComponents`, resolved at work-package split," with "remapping onto the
approved 21" and "extending the component catalog now" both explicitly rejected. Both
rejections rested on the same false premise, and the second is exactly what `BLOCK-000B` had
to do. The citation now points here.
---

## 4. Phase 0 — Foundations

Nothing in Phases 1–4 can start until these land. Status for these rows lives in
`website-tasks.md` §9.0; this table owns their content and order.

| ID        | Size  | Task                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 | Depends on               |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------ |
| FOUND-001 | S     | **Done.** D1–D6 folded into `website-tasks.md` §8.2/§8.3/§8.4, now tiered into numbered machine-checkable bars plus review bars, mirroring §8.1. `block-catalog-manifest.json`'s `resolution.decision` repointed at §3 (D6). Enforcement: `FOUND-004` cites §8.2.1, `FOUND-005` cites §8.3.1.                                                                                                                                                                                        | —                        |
| FOUND-002 | **L** | **Done.** Registry v3: added `components[]`/`blocks[]`/`templates[]`/`themes[]` to the index, namespaced per-deliverable manifests, layer-aware discovery, and layer-aware `documentationMetadata()`. CLI schema v3, snapshot rebuilt, orphan sweep recursive, `.prettierignore` updated.                                                                                                                                                                                            | D2, D3                   |
| FOUND-003 | S     | **Done.** `install.ts` resolves component source via `resolveComponentSource()` (reads recipe wrapper + `.variants.ts` from `packages/recipes-{profile}/src/recipes/`), block source via `resolveBlockSource()`, theme via `resolveThemeSource()`. Uses `plan.stylingProfile ?? config.stylingProfile`. Verify → conflict → rollback → lock ordering preserved.                                                                                                                      | D1                       |
| FOUND-004 | M     | **Done.** `tools/component-catalog-gate.ts` — per-item §8.2 checks plus registry reconciliation, `--audit-only` mode, and a ratchet asserting the passing count equals the `Components` DoD column in §11's Scope counters (0). Reads declared DoD count from §11 scope counters. Added `component:catalog-gate` and `component:catalog-audit` scripts. 0/13 pass (13 components discovered), ratchet holds.                                                                         | FOUND-002                |
| FOUND-005 | S     | **Done.** `tools/block-catalog-gate.ts` + manifest validator: resolves every `componentDependencies` entry against `COMP-001..030` **by name** — comparing the `.json`, the `.md` companion, and §9.2 (F12); `requiredStates` present, complete, and cardinality-matched against prose `states` (D4); `proposedComponents` empty for every block (D6). Ratchet against `Blocks` counter (0). Added `block:catalog-gate` and `block:catalog-audit` scripts. 0/36 pass, ratchet holds. | D4, D6, FOUND-002        |
| FOUND-006 | S     | **Done.** `tools/scaffold-catalog-docs.ts` emitting EN+ES stubs with real `translationSourceHash` (SHA-256 of EN content). 56 items scaffolded (13 components, 36 blocks, 2 templates, 5 themes) — 112 files total. Added `catalog:scaffold-docs` script.                                                                                                                                                                                                                            | D3                       |
| FOUND-007 | M     | **Done.** Route generators for `/components/[name]/`, `/blocks/[name]/`, `/templates/[name]/`, and `/themes/[name]/` in both locales. Created `CatalogRoute.astro` and `CatalogDirectory.astro` generic components, `src/lib/content-catalog.ts` shared generators. Extended `validate-registry-route-invariant.ts` and `locale.ts` for new layers. 26 route files created.                                                                                                          | FOUND-002                |
| FOUND-008 | S     | **Done.** D5 applied to all three emitters: `recipe-emit-css.ts`, `recipe-emit-tailwind.ts`, `recipe-emit-unocss.ts` derive `solidiom-<scope>` by default via `getClassPrefix(scope)`, with `CLASS_PREFIX_EXCEPTIONS` containing only `button: "solidiom-btn"`. Gates wired into `ci.yml` as `catalog-gates` job (runs after `build`, blocks `phase1-gate`), and into `phase1-gate.ts` §15 with title-based citations per §3.1.                                                      | D5, FOUND-004, FOUND-005 |
| FOUND-009 | S     | **Done.** F6's wrapper asymmetry excepted: `typeset` and `prose` are utility stylesheets, not components. Exception recorded in `website-tasks.md` §8.2 ("Utility stylesheets excluded"). Neither `typeset` nor `prose` appears in the component catalog or the `COMP-*` queue.                                                                                                                                                                                                      | D1                       |

**Estimated size: 20–26 person-days**, revised up from 15–20 by FOUND-002's resize and the
two added rows. Partly parallelizable: FOUND-002 is on the critical path for three others.

### 4.1 FOUND-002 scope note — why it is L, not M

The original sizing counted only the generator. The v3 bump and the namespaced paths each
reach further, and all five of these were verified at `bb1a0c7`:

| Surface                                           | Why FOUND-002 touches it                                                                                                                                                                                                                                   |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `packages/cli/src/registry-schema.ts`             | `SUPPORTED_REGISTRY_INDEX_VERSION` and the `$schema` literal are both pinned, and `readRegistryIndex` throws on mismatch. Every command that reads the index — `plan`, `inspect`, `add`, `verify` — fails closed until this is updated in the same change. |
| `tools/__snapshots__/registry-build.test.ts.snap` | 2513 lines. A v3 index and four new arrays rewrite it. Per `cd8f9ba` it must stay free of build-time provenance, so regenerate deliberately rather than with a blanket `-u`.                                                                               |
| `packages/cli/src/commands/verify.ts`             | REG-006's fail-closed verification reads the index and the inline `integrity` signature. Re-check it against a v3 index, and note `REG-008` is concurrently re-homing index signing off HMAC.                                                              |
| `tools/registry-build.ts:903` orphan sweep        | Iterates `REGISTRY_DIR`'s direct children and skips non-`.json` entries, so namespaced subdirectories are never swept. Must recurse or stale manifests accumulate invisibly.                                                                               |
| `.prettierignore:9`                               | `registry/*.json` matches direct children only; namespaced manifests would be Prettier-formatted against the generator's byte-stable output. Must become `registry/**/*.json`.                                                                             |

The BUILD-001 guard makes the last two failures loud rather than silent, which is the
argument for doing them inside FOUND-002 rather than discovering them in a red build.

### 4.2 Theme layer

The theme layer is included in FOUND-002, 006, and 007 above, because adding a fourth array
to an index being versioned anyway and a fourth pattern to a generator being written anyway
is close to free. The content is not included: `PRESET-001..004` are marked `[x]` in
`website-tasks.md` §9.5 as "preset, docs, previews, outputs", but only the outputs exist —
the `themes` collection has 0 entries, nothing calls `getCollection("themes")`,
`apps/site/src/pages/themes/` holds only `builder/`, and `packages/themes/` has no docs
directory. `audit:preset-themes` passes but checks token coverage, contrast, and output
presence, not docs or previews. The four bilingual preset doc sets and previews are tracked
as `PRESET-006` in §9.5, and G4's preset exit line cannot pass until they land.

### 4.3 Exit criteria for Phase 0

- `registry:build` emits component/block/template/theme arrays and manifests deterministically.
- `pnpm run component:catalog-audit` runs and reports 0/30 without error.
- `pnpm run block:catalog-audit` runs and reports 0/36 without error.
- A scaffolded component doc pair passes `translation:check` as `draft` with a real hash.
- `git diff --exit-code` is clean after `pnpm build` (BUILD-001 guard still holds).
- `pnpm run recipe:emit:css:check` passes for a variant-bearing scope with no
  `CLASS_PREFIXES` entry, proving D5's derivation. **All three profiles verified** —
  D5 was applied to CSS, Tailwind, and UnoCSS emitters in FOUND-008.

---

## 5. Phase 1 — Component vertical slice (3 items)

Mirror `VS-001/002/003`. Prove the entire chain on three items covering distinct shapes
before any fan-out, for the same reason §9.1 forbade bulk primitive work before `VS-004`.

| Order | Item                | Size | Shape proven                                            | Why this one                                                                                                                                    |
| ----: | ------------------- | ---- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
|     1 | **COMP-001 Button** | M    | Variants + compound variants                            | The only item that already declares a component deliverable in its package metadata. Joint-highest block fanout (30, tied with Card and Alert). |
|     2 | **COMP-002 Input**  | M    | Greenfield — no existing wrapper or contract definition | Proves the from-scratch path early, when it is cheap to change. Fanout 26.                                                                      |
|     3 | **COMP-006 Dialog** | L    | Compound, multi-slot, overlay, focus management         | Contract-backed. Exercises the recipe schema's slot-ownership and `consumer`/`adapter` exception mechanisms.                                    |

Deliberately _not_ in the slice: `COMP-029 Spinner`, despite carrying the highest fanout in
the catalog at **36** — every block depends on it. It is a single-slot component with no
variant axis and no keyboard model, so it proves almost nothing about the machinery, and
holding the slice to three items keeps the gate meaningful. It takes step 4 instead, so no
block waits on it longer than one step. `COMP-015 Switch` is also out: it proves less than
Input does (no greenfield path) and carries fanout 11 against Input's 26.

Each item closes the full §8.2 DoD: canonical recipe definition → three emitted outputs →
CLI plan/add/verify/diff/update → EN+ES docs and examples → accessibility evidence →
source preview → theme previews across the four presets. Advance the §11 ratchet 0→1→2→3.

**Gate: do not start Phase 2 until COMP-006 passes `component:catalog-gate`.**

**Estimated size: ~3 weeks** (M + M + L).

---

## 6. Phase 2 — Component fan-out (27 items)

### 6.1 Ordering principle

Order by **block fanout descending**, not by implementation cost. §2.1 shows the block
catalog is gated on a handful of high-fanout components; sequencing by cost would leave
`COMP-029 Spinner` (fanout 36) and `COMP-023 Data Table` (19) late and strand most of the
catalog. The single hard ordering constraint inside the queue is `COMP-003 Field` ←
`COMP-002 Input`, satisfied by the Phase 1 slice.

### 6.2 Recommended order

Fanout is the number of the 36 blocks that declare the component, computed from the
corrected manifest (`schemaVersion: 2`; see F12). Cumulative unlocked counts assume the
Phase 1 slice is complete. "Recipe" means a wrapper **and** a validated contract definition
already exist for that scope (F6), so the styling layer is done and only the component layer
is outstanding.

| Step | Item                      | Recipe + contract? | Fanout | Blocks unlocked (cum.) |
| ---: | ------------------------- | ------------------ | -----: | ---------------------: |
|    4 | COMP-029 Spinner          | no                 |     36 |                      0 |
|    5 | COMP-004 Card             | no                 |     30 |                      0 |
|    6 | COMP-005 Alert            | yes                |     30 |                      0 |
|    7 | COMP-007 Select           | yes                |     21 |                      0 |
|    8 | COMP-003 Field            | no                 |     20 |                      1 |
|    9 | COMP-023 Data Table       | no                 |     19 |                      1 |
|   10 | COMP-010 Toast            | yes                |     18 |                      3 |
|   11 | COMP-013 Checkbox         | yes                |     18 |                      3 |
|   12 | COMP-009 Tabs             | yes                |     16 |                      4 |
|   13 | COMP-008 Dropdown Menu    | yes (`menu`)       |     14 |                      5 |
|   14 | COMP-021 Pagination       | no                 |     13 |                      6 |
|   15 | COMP-017 Popover          | yes                |     12 |                      8 |
|   16 | COMP-012 Avatar           | no                 |     11 |                     13 |
|   17 | COMP-015 Switch           | yes                |     11 |                     19 |
|   18 | COMP-020 Breadcrumb       | no                 |      8 |                     24 |
|   19 | COMP-026 Progress         | no                 |      7 |                     28 |
|   20 | COMP-011 Tooltip          | yes                |      3 |                     29 |
|   21 | COMP-025 Meter            | no                 |      2 |                     31 |
|   22 | COMP-014 Radio Group      | no                 |      1 |                     32 |
|   23 | COMP-019 Navigation Menu  | no                 |      1 |                     32 |
|   24 | COMP-022 Command Palette  | no                 |      1 |                     32 |
|   25 | COMP-024 Kbd              | no                 |      1 |                     33 |
|   26 | COMP-027 Resizable Panels | no                 |      1 |                     34 |
|   27 | COMP-028 Scroll Area      | no                 |      1 |                     35 |
|   28 | COMP-030 Toolbar          | no                 |      1 |                     36 |
|   29 | COMP-016 Combobox         | no                 |      0 |                     36 |
|   30 | COMP-018 Sheet            | no                 |      0 |                     36 |

Steps 1–3 are the Phase 1 slice (Button 30, Input 26, Dialog 15).

Note the shape of the tail: from step 22 onward every remaining component has one consumer
or none, and the last two have none at all. Nine of the ten additions from `BLOCK-000B` are
in the top half or the singleton tail — Spinner and Data Table dominate, the rest are
long-tail — so the extension changed the critical path much less than it changed the count.

### 6.3 Parallelization

The order above is a priority queue, not a serial chain. After the slice there are no
dependencies among the remaining 27 — `COMP-003`'s prerequisite is already met — so with
_n_ streams, take the next _n_ rows. Preserve the ordering across streams so the unlock
curve is not sacrificed: a stream that finishes early should pull the next row down, not a
cheaper row further along.

Two sub-groups are worth keeping together for cache and review coherence:

- **Recipe-backed group** (steps 6, 10, 11, 12, 13, 15, 17, 20 — eight items): the recipe
  wrapper and its contract definition both already exist and validate (F6), so the styling
  layer is done. Only the component layer is outstanding: docs, registry entry, CLI wiring,
  and tests. Cheaper than the estimate in §6.4 implies.
- **Greenfield group** (steps 4, 5, 7, 8, 9, 14, 16, 18, 19, 21–30 — nineteen items):
  contract definition, wrapper, and docs all new. No `CLASS_PREFIXES` entry is needed — under
  D5 the prefix is derived from the scope, and the map holds exceptions only.

### 6.4 Estimated size

The 18 originally-queued fan-out items are 11 × M + 7 × L ≈ 97 person-days. The nine added by
`BLOCK-000B` are 4 × L + 4 × M + 1 × S ≈ 47. Together **≈ 145 person-days ≈ 29 person-weeks**;
roughly 7 calendar weeks across four streams.

## 7. Phase 3 — Blocks (36 items)

### 7.1 Overlap with Phase 2 is limited, and back-loaded

Per §6.2's cumulative column, block availability is:

| After component step | Blocks unlocked |
| -------------------: | --------------: |
|                    7 |               0 |
|                    8 |               1 |
|                   10 |               3 |
|                   12 |               4 |
|                   14 |               6 |
|                   16 |              13 |
|                   18 |              24 |
|                   20 |              29 |
|                   24 |              32 |
|                   28 |              36 |

So Phase 3 can begin in earnest around component step 16 and reaches full breadth at step 28.
Starting blocks earlier than step 14 yields at most 6 candidates and risks building against
components that are still churning.

The curve moved later than the pre-correction plan recorded — first unlock at step 8 rather
than 6, full breadth at 28 rather than 20 — because the corrected manifest has 50 more edges
and because nine of the components those edges point at are newly queued. The shape is the
same; the tail is longer.

### 7.2 Sequence

1. **`FOUND-005` (S)** — manifest validator and block gate, D4's structured states applied
   across all 36 entries, and name-based dependency resolution per §8.3.1 req 2. Lands in
   Phase 0, not here. (Previously called `BLOCK-000B` in draft; that ID now belongs to the
   citation correction in `website-tasks.md` §11.1, and the gate is `FOUND-005`.)
2. **Pilot blocks**, chosen for shape coverage against real availability. Under §6.2's order
   the earliest unlock step per block is fixed, so the pilot set is constrained:

   | Pilot | Block                                 | Deps | Unlocks at step | Shape proven                                  |
   | ----: | ------------------------------------- | ---: | --------------: | --------------------------------------------- |
   |     1 | `BLOCK-AUTH-01 Sign In`               |    5 |               8 | Form, validation, error and restricted states |
   |     2 | `BLOCK-BILLING-03 Invoice History`    |    8 |              15 | Data display, empty and loading states        |
   |     3 | `BLOCK-SHELL-03 Notifications Center` |   12 |              17 | Application shell, embedded preview           |

   Run pilots 1 and 2 at component step ~16 rather than at their earliest unlock, so the
   components they depend on have stopped churning (R3). Pilot 3 cannot start before step 17
   — **no application-shell block unlocks earlier.** Command Palette (`BLOCK-SHELL-02`)
   unlocks at step 25 and Navigation Layout (`BLOCK-SHELL-01`) at step 26, so the shell shape
   is necessarily the last of the three to be proven, and later than it was before the
   correction. Sequence the shell-heavy categories accordingly.

3. **Fan out** the remaining 33 across the 12 categories, splitting each `WP` into
   reviewable tasks per §1.2. Prefer completing a category (3 blocks) per stream so the
   §9.3 "three or more per category" G4 requirement lands incrementally.

Every block must implement all four required states plus full-page **and** embedded
previews per §8.3, and must declare its data boundary explicitly.

### 7.3 Highest-dependency blocks to schedule last

`BLOCK-CONTENT-03 Content Workflow` (17 deps), `BLOCK-AI-03 Workflow Builder` (15),
`BLOCK-AI-02 Prompt Studio` (14), `BLOCK-CONTENT-02 Content Library` (14),
`BLOCK-RESOURCE-03 Resource Creator` (14), `BLOCK-CONTENT-01` (13).

Dependency count and unlock step are not the same ordering: `BLOCK-CONTENT-01` carries 13
dependencies but unlocks last of all 36, at step 28, because it is the only block that needs
`COMP-030 Toolbar`.

### 7.4 Estimated size

36 × ~4 days ≈ **144 person-days ≈ 29 person-weeks**. The per-item figure is the least
certain number in this document: no `WP` row in §9.3 has been split yet, so 4 days is an
assumption, not an estimate.

---

## 8. Phase 4 — Templates (29 unique / 32 placements)

### 8.1 TPL-000 is unblocked now

`TPL-000`'s dependencies — `CLI-008` and `BLOCK-000` — are both complete. It is a manifest
and approval exercise, so **start it in parallel with Phase 0.** It must assign per
template: stack (exactly one of SolidStart, TanStack Start Solid, Vite + Solid Router),
required blocks, deployment target, auth model, and portfolio tags.

### 8.2 Template sequencing cannot be computed yet

Unlike blocks, there is no machine-readable template manifest, so no `requiredBlocks` edges
exist to sequence against. Until `TPL-000` lands, the template order is unknown. Treat
"produce the same fanout table for templates that §6.2 gives for components" as an explicit
`TPL-000` deliverable — it is cheap to add while authoring the manifest and expensive to
reconstruct later.

### 8.3 Existing assets

`templates/vite-solid-router/` and `templates/tanstack-start-solid/` exist with
`template.json` (`{name, stack, description, variables, generatedFiles, notes}`), and
`packages/cli/src/create/materialize.ts` already handles variable substitution
(`ALLOWED_VARIABLES = {projectName}`), exclusions, foreign-lockfile refusal with rollback,
`workspace:*` rewriting, and repo-local tsconfig stripping. These are `CLI-007`
deliverables — they prove the materializer, and are not `TPL-*` catalog entries (§9.4).

The two existing trees are the reference layout for all 29.

### 8.4 Per-template work

Each `TPL-*` needs: a `templates/<name>/` tree with `template.json`; verified
`solidiom create --template <name>` materialization; the generated project building,
typechecking, starting, and passing smoke/a11y tests; EN+ES site content under
`apps/site/src/content/{en,es}/templates/`; screenshots; security and data assumptions;
provenance and a signed manifest; and green `solidiom create` × {npm, pnpm, Yarn, Bun} in
the `CLI-008` offline fixture.

The 32 placements come from three templates tagged "Balanced + Enterprise" in §9.4 —
`TPL-004 Multi-tenant Admin`, `TPL-007 Resource Manager`, `TPL-008 Observability Console` —
each counting twice. 29 + 3 = 32.

### 8.5 Estimated size

29 × ~4 days + manifest ≈ **121 person-days ≈ 24 person-weeks**, with the same
per-item uncertainty as blocks.

---

## 9. Effort model and critical path

```text
TPL-000 (start now, parallel) ─────────────────────────────┐
                                                           │
Phase 0 Foundations ──> Phase 1 Slice (3, sequential) ──> Phase 2 Components (27)
                                                              │        │
                                              step ~16 ───────┘        │
                                                     └──> Phase 3 Blocks (36)
                                                                       │
                                                     TPL-000 + blocks ─┴──> Phase 4 Templates (29)
```

| Phase             |  Items | Person-days | Parallelizable                             |
| ----------------- | -----: | ----------: | ------------------------------------------ |
| 0 Foundations     |      — |       20–26 | Partly (FOUND-002 is on the critical path) |
| 1 Component slice |      3 |         ~21 | No, by design                              |
| 2 Components      |     27 |        ~145 | Yes, preserve §6.2 order across streams    |
| 3 Blocks          |     36 |        ~144 | Yes, by category, from step ~16            |
| 4 Templates       |     29 |        ~121 | Yes, after TPL-000                         |
| **Total**         | **95** |    **~455** |                                            |

**~455 person-days ≈ 91 person-weeks.** Roughly 5–6 months with four parallel streams once
Phase 1 closes; the tail is dominated by blocks and templates, which cannot start early.

Estimates derive from §1.2's size guide (M = 3–5 d, L = 1–2 w, `WP` ≈ 4 d assumed
post-split). The `WP` assumption covers 65 of the 95 items, so total effort should be
re-derived after the first three block splits and the first three template splits produce
real numbers. The nine components added by `BLOCK-000B` are the one part of this model with
better-than-assumed grounding: each wraps a completed primitive whose own size is recorded in
§9.1, so their sizes are inherited rather than guessed.

---

## 10. Risk register

| #   | Risk                                                     |                                                               Impact | Mitigation                                                                                                                                                                                                                                      |
| --- | -------------------------------------------------------- | -------------------------------------------------------------------: | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| R1  | D1 decided wrong or late                                 |                                           All 30 components reworked | **Closed:** D1 resolved to the recipe wrapper before FOUND-003. Residual: F6's wrapper asymmetry, tracked as FOUND-009.                                                                                                                         |
| R2  | No per-layer ratchet added in Phase 0                    |             §9.2/9.3/9.4 counts drift into prose exactly as §9.1 did | FOUND-004/005 ship ratchets with the gates, not after. §11's own preamble is the precedent. Note workflows are dispatch-only (`CI-008`), so a ratchet fires only when CI is dispatched.                                                         |
| R3  | Blocks started too early against churning components     |                                  Rework in blocks, the largest phase | Hold Phase 3 to component step ≥ 14; pilot at ~16. Both moved out two steps when the corrected manifest lengthened the tail.                                                                                                                    |
| R4  | Misnumbered component citations resolve silently         |         A gate certifies 19 blocks built against the wrong component | **Materialized, then fixed.** `BLOCK-000B` corrected ten `PRIM-*`-numbered citations; §8.3.1 req 2 now resolves by name and `FOUND-005` asserts the `.json`, the `.md`, and §9.2 agree. An ID-range check passes on every one of these defects. |
| R5  | Template order unknown until TPL-000                     |                                          Phase 4 cannot be scheduled | Make the template→block fanout table a TPL-000 deliverable (§8.2).                                                                                                                                                                              |
| R6  | Generated artifacts committed stale                      |                               Recurrence of `A11Y-009` / `BUILD-001` | The BUILD-001 `git diff --exit-code` guard already exists; extend it to the new registry arrays in FOUND-002.                                                                                                                                   |
| R7  | Component docs never reach `human-reviewed`              |                    Same open state as `I18N-005`, blocking G5 not G4 | FOUND-006 emits real hashes from the start; per-item Spanish review remains a G5 concern per §8.1.2.                                                                                                                                            |
| R8  | Recipe drift in the eight recipe-backed fan-out items    | Silent divergence between the contract definition and emitted output | `audit-recipe-drift.ts` and `recipe:emit:*:check` already exist; require both green in each component's DoD.                                                                                                                                    |
| R9  | `COMP-016` and `COMP-018` have no consumers              |                                        Effort with no catalog payoff | Combobox joined Sheet here once the citations were corrected — its 19 apparent consumers meant Data Table. Both sit last in §6.2; the pilots decide whether either has a real consumer.                                                         |
| R10 | F6's wrapper asymmetry left open under D1(b)             |                         Component catalog differs by styling profile | FOUND-009: close `RECIPE-008`(a) or record the exception in §8.2 before Phase 2 fans out.                                                                                                                                                       |
| R11 | Theme layer machinery deferred out of FOUND-002          |         Second registry version bump and second route-generator pass | §4.2: the four arrays and four route patterns land together in Phase 0; only the preset content is deferred, as `PRESET-006`.                                                                                                                   |
| R12 | A prose companion and its machine-readable twin disagree |        A contract passes validation while misstating its own content | The block manifest's `.md` carried component names its `.json` lacked, and nothing compared them; that is how ten wrong IDs survived approval. `FOUND-005` compares them. Apply the same rule to any future `docs/contracts/*.{json,md}` pair.  |
| R13 | Nine components added late reorder the critical path     | Streams sequenced against the old order build the wrong things first | §6.2 is recomputed from the corrected manifest, not edited in place. Re-derive it from the manifest rather than trusting a remembered order; `/tmp` scripts are not the source, the manifest is.                                                |

---

## 11. Verification commands

Existing commands that Phase 0 must keep green, all verified present in `package.json`:

```sh
pnpm run registry:build
pnpm run recipe:contract
pnpm run recipe:emit:css:check && pnpm run recipe:emit:tailwind:check && pnpm run recipe:emit:unocss:check
pnpm run audit:recipe-parity
pnpm run audit:package-source-parity
pnpm run source:emit
pnpm run primitive:catalog-gate
pnpm run api:coverage-gate
pnpm run gate:phase1
pnpm --filter @solidiom/site run translation:check
```

New commands Phase 0 introduces, to be wired into `ci.yml` and `phase1-gate.ts` §9:

```sh
pnpm run component:catalog-gate     # FOUND-004, ratchets against §11 Components DoD column
pnpm run component:catalog-audit    # --audit-only
pnpm run catalog:scaffold-docs      # FOUND-006, covers components/blocks/templates/themes
pnpm run block:catalog-gate         # FOUND-005, ratchets against §11 Blocks column
pnpm run block:catalog-audit
```

`block:catalog-gate` must assert three-way agreement between
`docs/contracts/block-catalog-manifest.json`, its `.md` companion, and §9.2's table —
resolving dependencies by **name**, not by ID range. Until it exists, this is the equivalent
check by hand; it should report 36/36 agreement and no ID outside `COMP-001..030`:

```sh
python3 - <<'EOF'
import json, re, collections
md = open("docs/contracts/block-catalog-manifest.md").read()
js = {b["id"]: b["componentDependencies"] for b in json.load(
    open("docs/contracts/block-catalog-manifest.json"))["blocks"]}
chunks = re.split(r"^### (BLOCK-[A-Z]+-\d+)", md, flags=re.M)
bad = 0
for i in range(1, len(chunks), 2):
    bid = chunks[i]
    line = next((l for l in chunks[i+1].splitlines() if re.match(r"\s*-\s+\*\*COMP", l)), "")
    ids = sorted({m.group(1) for m in re.finditer(r"(COMP-\d{3})\s*\(", line)})
    if ids != sorted(js[bid]):
        bad += 1
        print("DISAGREE", bid, ids, sorted(js[bid]))
allowed = {f"COMP-{n:03d}" for n in range(1, 31)}
out = {c for v in js.values() for c in v} - allowed
print(f"{len(js)-bad}/{len(js)} blocks agree; out-of-range: {sorted(out) or 'none'}")
EOF
```

After any verification pass, check `git status` before concluding the tree is clean.
Several of the commands above write to tracked files (`registry/`, `source/` mirrors,
`packages/*/docs/accessibility/evidence.json`), but as of `3705238` they leave the tree
clean when nothing has substantively changed — generation stamps and evidence provenance
are preserved unless content changes, and the `BUILD-001` step in CI fails on any residual
diff. So churn there now means a real content change rather than expected noise, and it
should be read as a signal. Do not use a broad `git checkout -- docs/` to clean it; that
reverts this document.

---

## 12. Definition-of-Done additions — landed

These were folded into `website-tasks.md` by `FOUND-001` and are no longer maintained here.
The normative text is:

- **§8.2.1** — ten numbered clauses for components, enforced by `FOUND-004`, plus §8.2.2's
  review bar. Requirements 1 and 5 carry D1's physical form; 4 carries D2's per-styling-output
  source; 6 and 7 carry D3's docs location.
- **§8.3.1** — ten numbered clauses for blocks, enforced by `FOUND-005`, plus §8.3.2's review
  bar. Requirements 2 and 3 carry D6's dependency resolution; 4 and 5 carry D4's structured
  states.
- **§8.4.1** — eight numbered clauses for templates, plus §8.4.2's review bar. Enforced by the
  `CLI-008` smoke matrix and by a `TPL-000` manifest validator that does not exist yet, so
  this bar is review-enforced today and should be read that way.

Each gate cites its clause numbers in source — `// §8.2 req N` — as
`primitive-catalog-gate.ts` already does for §8.1.1 at nine sites. That citation is the
binding device: a clause with no gate assertion, or an assertion with no clause, surfaces as
a mismatch in review rather than drifting silently. It is the reason this document points at
clause numbers instead of repeating the rules.

A task row in §9.2/9.3/9.4 may only go `[x]` when the corresponding gate fails on regression.
That is `website-tasks.md` §11's existing rule; these three layers had simply never had a gate
to name. Note the qualifier `CI-008` adds: with workflows dispatch-only, "fails on regression"
means "fails when the workflow is dispatched", so the gates must also be runnable and run
locally per §11.
