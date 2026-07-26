---
id: opencenter-solidiom-v0.6
title: "openCenter Solidiom Design"
description: "Combined documentation for openCenter Solidiom Design"
doc_type: reference
version: "0.6"
date: 2026-07-19
generated: true
source_project: opencenter-solidiom
---

# openCenter Solidiom Design — Combined Documentation

_Version 0.6 — Generated 2026-07-19T16:50:20Z_

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, explains the v0.6 architectural hardening decisions, records the refinements applied over v0.5, and provides an executive summary of the Solidiom architecture.

# Solidiom Overview and v0.6 Hardening Decisions

## 0. v0.6 architectural hardening decisions

Version 0.6 preserves every normative decision from v0.5 and adds refinements produced by the v0.5 architecture review. The canonical mental model is unchanged:

> **Primitives own behavior. Adapters provide algorithms. Recipes provide styling. Migrations help users move. Legacy facades are temporary.**

### 0.1 Refinements over v0.5

| Refinement                                                                                                                                                                            | Where it lands |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Every behavioral-family variant assigns its policy to primitive prop, recipe, or block — no floating policy                                                                           | §7.1           |
| Structural migrations must operate on a typed AST; regex-only rewrites are prohibited for identifier, import, prop, and JSX transformations                                           | §16.6          |
| Every adapter passes a runtime side-effect suite that asserts no `<style>` appends, no adopted-stylesheet writes, no undeclared attribute mutation, and complete `destroy()` cleanup  | §16.5.1        |
| Signature verification specifies two supported modes — Sigstore keyless with OIDC identity binding, or explicit trusted keys committed to source control — with rotation semantics    | §13.12.1       |
| Policy accepts `allowedPrimitiveVersions` semver ranges evaluated against the full resolved install graph                                                                             | §13.13         |
| Package-mode-only projects require no `.solidiom/` files; the CLI treats absence of `.solidiom/config.json` as valid pure-package-mode                                                        | §13.2, §13.6   |
| CLI inspection commands consolidate under `solidiom inspect <source\|manifest\|explain\|files\|provenance>`; the pre-v0.6 top-level aliases remain during 0.6 and are removed in 1.0      | §13.9          |
| §17.4 replaces "later, optional" compile-time gestures with a version-anchored roadmap (0.6.x through 2.0) that ties each compile-time deliverable to a release and enforcement level | §17.4          |
| Clarified that semantic data attributes act strictly as stable boundaries and require structural typing to prevent CSS injection                                                      | §14.2, §14.4   |

### 0.2 Normative decisions carried forward from v0.5

The following decisions from v0.5 remain normative in v0.6:

1. **`adapters/` is reserved for framework-neutral specialized engines only.** Eligible engines perform bounded algorithmic work such as positioning, virtualization, table modeling, date arithmetic, or carousel physics. Primitive systems such as Kobalte, Corvu, Radix, Ark, Zag component bindings, Base UI, or React Aria are not adapters.
2. **Compatibility support is not an adapter concern.** Build-time source transforms, diagnostics, import rewrites, and migration reports live in `migrations/`. Temporary runtime aliases and deprecated prop/import facades live in `legacy/`.
3. **Adapters return capability snapshots, not arbitrary component props.** They may not emit public roles, ARIA, semantic `data-*` attributes, classes, theme tokens, or user-facing event semantics.
4. **The distribution model is hybrid.** The same canonical authored source produces normal per-component packages, an optional umbrella package, and source-install artifacts. Package mode is the default for ordinary application teams; source mode is the default for platform and design-system teams that intend to own and modify implementation source.
5. **The package tarball is the canonical immutable artifact.** A registry index provides discovery and resolution, but source, compiled output, manifests, migrations, tests, licenses, and integrity metadata version together through package infrastructure.
6. **Semantic data attributes remove mandatory styling-runtime dependencies, but do not replace styling infrastructure.** The styling contract consists of semantic attributes, behavioral CSS variables, optional recipes, design tokens, and strict prohibition of adapter-owned public styling.
7. **The primitive implementation remains runtime-first.** Solid 2 accessors, owner-scoped cleanup, explicit lifecycle boundaries, and direct DOM behavior define the contract. Static analysis, recipe extraction, and compiler assistance may be added later per the roadmap in §17.4, but no primitive depends on a bespoke compiler transform to function correctly.
8. **Enterprise governance is first-class.** The CLI must support deterministic plans, offline/internal-registry operation, machine-readable output, artifact verification, policy enforcement, license/SBOM reporting, source provenance, and non-destructive updates.
9. **Legacy support must have a removal path.** Legacy facades are never transitively installed, never imported by primitives, never treated as adapters, and must publish deprecation and sunset metadata.

The governing authority rule remains:

> **Solidiom owns UI semantics. External engines may own specialized algorithms, but they do not own components, accessibility, public state, public DOM contracts, styling policy, or source-update semantics.**

## 1. Executive summary

Solidiom should be implemented as a new Solid 2-native UI system rather than a new release line of shadcn-solid.

The architecture has five product layers and one distribution plane:

| Layer                  | Responsibility                                                                                                                                  |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Primitives**         | First-party Solid 2 semantics, state, accessibility, focus, keyboard behavior, forms, overlays, collections, presence, and public DOM contracts |
| **Adapters**           | Narrow Solid integration over framework-neutral specialized algorithm engines only                                                              |
| **Recipes**            | Optional classes, CSS, tokens, variants, animation styling, and visual defaults                                                                 |
| **Migrations**         | Build-time analysis, source transformation, diagnostics, and upgrade plans                                                                      |
| **Legacy**             | Temporary deprecated facades that preserve selected old imports or props while delegating to first-party Solidiom primitives                        |
| **Distribution plane** | Packages, source manifests, registry discovery, CLI resolution, provenance, policy, verification, updates, and release metadata                 |

The runtime stack is:

```text
Application blocks
        │
        ▼
Recipes
        │
        ▼
First-party primitives
        │
        ▼
Solid 2 runtime kernel
        │
        ├── direct browser platform behavior
        │
        └── capability ports
                 │
                 ▼
              adapters
                 │
                 ▼
      framework-neutral specialized engines
```

Compatibility support is deliberately outside that stack:

```text
migrations/  ── transforms and diagnoses application source
legacy/      ── temporarily maps old app-facing APIs to Solidiom primitives

Neither layer defines primitive behavior or satisfies capability ports.
```

The hybrid package model supports two equally tested consumer paths from the same canonical source:

```text
Package mode                                  Source mode
------------                                  -----------
import from @solidiom/dialog                      solidiom add dialog --mode source
normal package-manager upgrades               app-owned TS/TSX/CSS
best default for application teams            best default for platform teams
shared compiled @solidiom/runtime                 local deduplicated _runtime source
```

The first implementation should prove the architecture through five hard slices:

- **Dialog:** overlays, focus, modal isolation, presence, nested layers, SSR, and no external positioning engine.
- **Select:** collections, selection, forms, typeahead, overlays, and a snapshot-only positioning adapter.
- **Calendar:** first-party grid and selection semantics plus a date-math adapter that exposes no engine date classes.
- **Carousel:** first-party public state and accessibility plus isolated framework-neutral physics.
- **Hybrid distribution and update:** package/source parity, provenance, policy, three-way merge, and one real migration plus temporary legacy facade.

Solidiom should not be positioned as "shadcn/ui for Solid." The more accurate framing is:

> **Solidiom is a Solid 2-native UI system that combines first-party primitives with package-backed source ownership and isolated algorithm adapters.**

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, explains the structural reasons a credible Solid 2-native replacement for shadcn-solid cannot be built by translating existing systems and defines where authority must live.

# 2. Problem statement

A credible Solid 2-native replacement for shadcn-solid cannot be built by:

- Translating shadcn/ui components into Solid syntax.
- Updating peer ranges for Kobalte, Corvu, TanStack, Embla, or the existing dependency set.
- Re-exporting external primitive types from a new facade.
- Using the shadcn/ui catalog as the primitive taxonomy.
- Treating source copying, package publishing, or semantic attributes as substitutes for a coherent behavior contract.

The issue is structural. Existing shadcn-style Solid systems commonly distribute source files that wrap or compose several independent headless libraries. Their public APIs, state attributes, accessibility behavior, generic types, and upgrade constraints are consequently shaped by upstream dependencies.

Solidiom must replace that dependency-shaped facade with one first-party contract that can be consumed in either package or source mode:

```text
Package import or application-owned source
                │
                ▼
         Recipes and blocks
                │
                ▼
     First-party Solid 2 primitives
                │
                ├── runtime kernel
                │     state, focus, overlays, collections,
                │     forms, presence, accessibility
                │
                └── capability ports
                        │
                        ▼
                     adapters/
                        │
                        ▼
          framework-neutral specialized engines
```

Migration and legacy support remain outside that runtime authority chain:

```text
migrations/  transforms old source into the new contract
legacy/      temporarily preserves selected old app-facing APIs
```

The critical distinction is not whether external code exists. It will. The distinction is **where authority lives**.

Solidiom must own:

- Public prop contracts.
- Change events and reasons.
- Controlled and uncontrolled state behavior.
- Part anatomy.
- Semantic state attributes.
- ARIA and keyboard behavior.
- Focus management.
- Native form participation.
- Overlay layering and dismissal.
- SSR and hydration behavior.
- Package/source parity.
- Source provenance and updates.

External engines may provide only bounded algorithms such as:

- Popup geometry and collision calculations.
- Virtual visible-range and measurement calculations.
- Table row-model calculations.
- Carousel movement and snap physics.
- Locale-aware date arithmetic.

Old primitive systems may be recognized by migrations and temporary legacy facades, but they may not become capability adapters or hidden production substrates.

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, explains Solid 2's implications for primitive design and clarifies how shadcn/ui, shadcn-solid, Kobalte, Corvu, UnoCSS, and enterprise supply-chain context relate to Solidiom.

# 3. Context and reference model

## 3.1 Solid and Solid 2 implications

Solid's fine-grained reactive model rewards explicit accessors, narrowly scoped computations, stable ownership, and direct DOM behavior. Components run once; dependencies update only the computations and DOM bindings that read them.

Solid 2 beta introduces material runtime and DOM-model changes, including microtask-batched updates, split effect phases, `onSettled`, ref directive factories instead of `use:` directives, and revised class handling. These changes affect primitive state transitions, lifecycle, ref composition, focus, observers, presence, and engine cleanup. They cannot be addressed by widening peer ranges.

Solidiom should therefore be Solid 2-native and should not carry a Solid 1 compatibility branch in its primitive implementation.

## 3.2 shadcn/ui's useful lesson

shadcn/ui's strongest architectural lesson is source ownership: reusable UI can be installed as editable application source rather than consumed only as a black-box component package.

Solidiom should adopt:

- Source ownership.
- CLI-guided installation.
- Registry discovery.
- Installable recipes, blocks, and examples.
- Familiar component vocabulary where useful.

Solidiom should not adopt React-specific composition assumptions, another primitive system as its behavior substrate, or the shadcn catalog as its primitive taxonomy.

## 3.3 shadcn-solid's role

shadcn-solid is a migration source, demand map, and dependency-leakage inventory. It shows which names, recipes, examples, props, selectors, and external types Solid applications already use.

Solidiom should use it to answer:

- Which migrations and diagnostics are needed?
- Which familiar names should exist as recipes or aliases?
- Which Kobalte and Corvu types have leaked into app code?
- Which state selectors and Tailwind/UnoCSS conventions are common?
- Which examples and blocks are valuable?

It must not be used as the implementation base.

## 3.4 Kobalte and Corvu's role

Kobalte and Corvu are coherent Solid primitive systems. That is why they are ineligible for `adapters/`: they already own state, accessibility, part anatomy, focus, and event semantics.

They may appear only in:

- `migrations/` source analyzers and codemods.
- `legacy/` type aliases or temporary deprecated facades when a safe first-party mapping exists.
- Comparative tests and historical behavior references.
- Migration documentation.

They may not appear in:

- First-party primitive implementation.
- Runtime kernel implementation.
- Capability adapter implementation.
- Public primitive types.
- Recipe behavior.
- Transitive dependencies of normal Solidiom components.

When an old Kobalte- or Corvu-specific contract cannot be represented safely through Solidiom primitives, migration tooling must report the incompatibility rather than hiding the old primitive system behind an adapter.

## 3.5 UnoCSS's role

UnoCSS is an on-demand CSS generation engine, not a UI behavior system.

The correct relationship is:

```text
Solidiom primitive:
  state, ARIA, focus, keyboard, forms, overlays, semantic attributes

UnoCSS:
  generated CSS, shortcuts, variants, token mappings, and recipe classes
```

UnoCSS may provide a recipe profile or Solidiom-aware preset. It must not define open state, focus traps, modal isolation, selection, form participation, or component anatomy.

## 3.6 Enterprise and supply-chain context

Enterprise adoption requires more than copyable source. Teams need internal package mirrors, deterministic artifacts, explicit license data, machine-readable plans, auditable file writes, no-network verification, policy controls, and clear ownership of locally materialized code.

The package-backed hybrid model addresses this by making package tarballs the immutable source of truth while retaining source installation as a first-class mode. Registry services remain useful for discovery, but enterprise builds do not need to trust a mutable public web registry or execute arbitrary registry code.

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, lists the required outcomes Solidiom must achieve and the explicit non-goals that bound the architecture.

# 4. Goals and non-goals

## 4.1 Goals

| Goal                              | Required outcome                                                                                                                          |
| --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Solid 2-native runtime behavior   | Primitives follow Solid 2 scheduling, lifecycle, refs, owner cleanup, SSR, hydration, and direct DOM semantics.                           |
| First-party primitive ownership   | Solidiom owns UI behavior instead of wrapping another primitive system.                                                                       |
| One coherent contract             | State, events, parts, semantic attributes, refs, polymorphism, forms, focus, and composition are consistent across components.            |
| Strict algorithm adapter boundary | `adapters/` imports only framework-neutral specialized engines and exposes Solidiom capability snapshots.                                     |
| Hybrid package/source consumption | Package mode and source mode are generated from the same canonical source and pass the same conformance suites.                           |
| Package-backed reproducibility    | Package tarballs include compiled output, canonical source, manifests, tests or fixtures, migrations, licenses, and integrity metadata.   |
| Safe source ownership             | Source-installed files retain provenance and update through explicit three-way merge without silent overwrite.                            |
| Styling independence              | No primitive requires Tailwind, UnoCSS, CSS-in-JS, a theme provider, or a class-variance runtime.                                         |
| Complete styling boundary         | Semantic attributes, behavioral CSS variables, optional recipes, and adapter styling prohibitions form one stable contract.               |
| Accessible defaults               | Accessibility is a primitive responsibility and release-gating conformance domain.                                                        |
| Enterprise governance             | Internal mirrors, offline mode, policy files, machine-readable plans, signatures, SBOM/license output, and CI verification are supported. |
| Clear migration path              | Build-time migrations and temporary legacy facades help shadcn-solid users move without introducing compatibility adapters.               |
| Runtime-first extensibility       | Components work without custom compiler transforms while remaining analyzable by future lint and compiler assistance.                     |
| Incremental adoption              | Apps can adopt one component or behavior family without unrelated engines or an entire catalog.                                           |

## 4.2 Non-goals

Solidiom will not:

- Be API-compatible with shadcn/ui or shadcn-solid.
- Preserve Kobalte, Corvu, Ark, Radix, Zag, Base UI, or React Aria types in public primitive APIs.
- Put Kobalte, Corvu, or any other primitive system under `adapters/`.
- Support Solid 1 in the core primitive implementation.
- Require source mode for every application team.
- Let package mode and source mode diverge semantically.
- Reach shadcn/ui component-count parity before the primitive and distribution contracts are stable.
- Abstract every option of every external engine.
- Expose generic engine escape hatches through primitive props.
- Require Tailwind, UnoCSS, CSS Modules, CSS-in-JS, or a runtime recipe library.
- Treat semantic data attributes as a complete design language.
- Use a framework-neutral state-machine system as the implementation of all primitives.
- Depend on a bespoke compiler transform for correctness.
- Run arbitrary registry JavaScript automatically.
- Silently overwrite local source modifications.
- Install legacy facades transitively or maintain them indefinitely.

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, explains how Solidiom separates runtime behavior, styling, migration, legacy support, and distribution authority across three planes with strict directional rules.

# 5. System architecture

Solidiom separates runtime behavior, styling, migration, legacy support, and distribution authority.

## 5.1 Runtime plane

```text
Application code
      │
      ▼
Blocks
      │
      ▼
Recipes
      │
      ▼
First-party primitives
      │
      ├── runtime kernel
      │     ├── state and events
      │     ├── DOM and refs
      │     ├── collection and selection
      │     ├── focus and overlays
      │     ├── presence and forms
      │     └── i18n and document services
      │
      └── capability ports
             │
             ▼
          adapters/
             │
             ▼
 framework-neutral specialized engines
```

The adapter edge is algorithmic. The primitive remains complete and accessible without allowing an engine to define public parts or semantic state.

## 5.2 Migration and legacy plane

```text
migrations/
  ├── inventory old imports and copied source
  ├── classify migration confidence
  ├── transform safe source patterns
  ├── rewrite selectors and props
  └── report unresolved contracts

legacy/
  ├── optional deprecated import aliases
  ├── optional deprecated prop facades
  ├── delegates to first-party Solidiom primitives
  ├── never satisfies capability ports
  └── carries explicit sunset metadata
```

Neither plane is imported by `runtime/`, `primitives/`, `adapters/`, or normal recipes.

## 5.3 Distribution plane

```text
Canonical authored source
      │
      ├── compiled per-component packages
      ├── optional umbrella package
      ├── canonical source exports
      ├── source manifests and migrations
      └── integrity, license, and test metadata
              │
              ▼
       package tarballs / internal mirrors
              │
              ▼
 registry discovery + CLI resolver + policy engine
              │
       ┌──────┴────────┐
       ▼               ▼
 Package mode      Source mode
 imports           app-owned source + lock/provenance
```

## 5.4 Authority rule

| Concern                                                                    | Exclusive owner                           |
| -------------------------------------------------------------------------- | ----------------------------------------- |
| Public state, events, parts, roles, ARIA, keyboard, focus, forms, overlays | First-party primitives and runtime kernel |
| Popup coordinates and collision math                                       | Positioning adapter                       |
| Visible ranges and measurements                                            | Virtualization adapter                    |
| Row-model calculations                                                     | Table-model adapter                       |
| Carousel movement and snap physics                                         | Carousel-physics adapter                  |
| Calendar arithmetic and time-zone calculations                             | Date-math adapter                         |
| Classes, tokens, visual variants, animation styling                        | Recipes, blocks, or application           |
| Source transformation from old systems                                     | `migrations/`                             |
| Temporary old imports or prop aliases                                      | `legacy/`                                 |
| Installation, policy, provenance, verification, and updates                | CLI and distribution plane                |

## 5.5 No reverse authority

The following dependency directions are prohibited:

```text
runtime      ✕ adapters, recipes, migrations, legacy
primitives   ✕ external engines, migrations, legacy
adapters     ✕ primitive systems, recipes, legacy
recipes      ✕ behavior ownership, migrations, legacy
migrations   ✕ runtime dependency of installed components
legacy       ✕ runtime internals or adapter implementation details
```

A lower layer may not acquire authority over a concern owned by a higher layer merely because an external engine exposes a convenient API.

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, defines the categories every Solidiom artifact belongs to and the ownership boundaries between them.

# 6. Source taxonomy

Every Solidiom artifact belongs to exactly one category.

## 6.1 Runtime module

A shared first-party implementation unit used by primitives.

Examples:

- `runtime/controllable-value`
- `runtime/event-details`
- `runtime/stable-id`
- `runtime/compose-ref`
- `runtime/collection`
- `runtime/roving-focus`
- `runtime/typeahead`
- `runtime/dismissable-layer`
- `runtime/focus-scope`
- `runtime/presence`
- `runtime/form-control`

Runtime modules are deduplicated by logical identity in source mode and compiled into `@solidiom/runtime` for package mode.

## 6.2 Primitive

An unstyled semantic and behavioral UI unit.

A primitive owns:

- Roles and ARIA relationships.
- Controlled and uncontrolled state.
- Keyboard and pointer interaction.
- Focus behavior.
- Form participation.
- Public events and change reasons.
- Part anatomy.
- Semantic state attributes.
- SSR and hydration behavior.

## 6.3 Adapter

A source or package module that implements an Solidiom capability port using a **framework-neutral specialized engine**.

An adapter may import the declared engine core and Solid lifecycle primitives required to bridge it. It may not import a component primitive system, define public UI semantics, emit public styling, or return arbitrary JSX props.

## 6.4 Recipe

A styled composition of one or more primitives.

Recipes own:

- Classes and CSS.
- Design tokens.
- Variants.
- Icons.
- Visual defaults.
- Animation styling.
- Styling-system-specific shortcuts or presets.

Recipes do not own accessibility, state, focus, or interaction semantics.

## 6.5 Block

A product-level application pattern composed from primitives and recipes.

Examples:

- Authentication form.
- Settings page.
- Command palette shell.
- Data-table screen.
- Dashboard card grid.
- Navigation shell.

Blocks may contain example application policy. They are not primitive infrastructure.

## 6.6 Migration artifact

A build-time item under `migrations/` that helps users move from old systems or prior Solidiom contracts.

Examples:

- `migrations/shadcn-solid`
- `migrations/kobalte-imports`
- `migrations/corvu-drawer`
- `migrations/state-attributes-v1-to-v2`

Migration artifacts may inspect old source and types. They are not production dependencies and do not participate in runtime capability resolution.

## 6.7 Legacy facade

A temporary deprecated runtime surface under `legacy/` that maps selected old imports or props to first-party Solidiom primitives.

A legacy facade:

- Is explicitly installed.
- Is never transitively required by a primitive or recipe.
- Delegates behavior to first-party Solidiom primitives.
- Does not satisfy an adapter capability.
- Does not promise complete old-library parity.
- Publishes deprecation, replacement, and sunset metadata.
- Must be removable through an accompanying migration.

## 6.8 Package-backed source artifact

An immutable package artifact containing some combination of:

- Compiled ESM output.
- Types and source maps.
- Canonical authored source.
- Source-install manifest.
- Contract metadata.
- Migrations.
- Conformance fixtures.
- License and integrity data.

The registry index points to these artifacts; it is not a second source of implementation truth.

---

> **Purpose:** For Solid 2 platform engineers and UI system designers, explains how Solidiom organizes behavior by shared semantic families instead of mechanically mirroring shadcn/ui component names as unrelated components.

# 7. Behavioral families, not shadcn mirroring

Solidiom should organize behavior by semantic family instead of mechanically reproducing shadcn/ui names as unrelated components.

| Familiar component names                 | Solidiom model                                                                                               |
| ---------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Dialog, Alert Dialog, Sheet              | One dialog/overlay foundation. Alert Dialog is policy. Sheet is a recipe.                                |
| Dialog, Drawer                           | Shared modal, focus, dismissal, presence, and layer services. Drawer adds first-party gesture semantics. |
| Dropdown Menu, Context Menu, Menubar     | One menu/composite foundation with different activation and orientation policies.                        |
| Select, Listbox, Combobox, Command       | Shared collection, selection, active-descendant, popup, typeahead, and form foundations.                 |
| Hover Card, Popover                      | One non-modal overlay foundation with different pointer-intent and dismissal policies.                   |
| Calendar, Date Picker, Date Range Picker | One calendar/date-field foundation using a date-math capability.                                         |
| Table, Data Table                        | Native semantic table recipes plus optional table-model adapter.                                         |
| Toast, Sonner-style notification         | One notification and live-region model with multiple visual recipes.                                     |
| Collapsible, Accordion                   | One disclosure foundation; accordion adds group policy.                                                  |
| Toggle, Toggle Group, Segmented Control  | One pressable-selection foundation with different selection policies.                                    |

This avoids duplicated interaction stacks and prevents another framework's catalog organization from becoming Solidiom's architecture.

## 7.1 Policy ownership within a family

Consolidating behaviors into one foundation raises the question of where variant policy lives. Every family variant must assign its policy to exactly one of three owners.

| Owner              | Contains                                                                                  | Runtime effect                                                                                          |
| ------------------ | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Primitive prop** | Behavior variants that affect state, focus, dismissal, or accessibility semantics         | Primitive branches at runtime; part of the public API contract; tested in behavioral-family conformance |
| **Recipe**         | Visual variants, class tokens, transition definitions, icon choices, default slots        | No behavioral effect; primitive semantics remain identical across recipes                               |
| **Block**          | Application-level assembly and product policy (copy, callback bindings, submission flows) | Composes primitive and recipe; may hold local state; not primitive infrastructure                       |

The following table assigns policy for every family variant listed in §7.

| Variant                                | Foundation                   | Policy owner and detail                                                                                                                                       |
| -------------------------------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Alert Dialog                           | Dialog                       | Primitive prop: `role="alertdialog"`, disables outside-click dismissal by default, initial focus targets destructive action when marked                       |
| Sheet                                  | Dialog                       | Recipe: layout, edge attachment, transition; primitive Dialog semantics unchanged                                                                             |
| Drawer                                 | Dialog + gesture             | Primitive prop: gesture semantics (`swipe-to-dismiss`); recipe: transform variables and transition                                                            |
| Dropdown Menu                          | Menu                         | Primitive prop: `activation="click"`                                                                                                                          |
| Context Menu                           | Menu                         | Primitive prop: `activation="context"` with pointer-position anchor                                                                                           |
| Menubar                                | Menu                         | Primitive prop: horizontal orientation and group navigation; recipe: visual layout                                                                            |
| Combobox                               | Collection + input + overlay | Primitive prop: `filter`, `openOn`, `autocomplete` behavior                                                                                                   |
| Command                                | Combobox + listbox           | Recipe: search UX and empty-state; block: keyboard shortcuts and command execution                                                                            |
| Hover Card                             | Non-modal overlay            | Primitive prop: `interaction="hover"` with intent delay                                                                                                       |
| Popover                                | Non-modal overlay            | Primitive prop: `interaction="click"`                                                                                                                         |
| Toggle Group                           | Pressable-selection          | Primitive prop: `selection="single" \| "multiple"`                                                                                                            |
| Segmented Control                      | Pressable-selection          | Recipe: visual treatment; primitive Toggle Group semantics unchanged                                                                                          |
| Date Picker                            | Calendar + field             | Primitive prop: single-date policy; recipe: field/popover composition                                                                                         |
| Date Range Picker                      | Calendar + field             | Primitive prop: range selection policy with start/end semantics                                                                                               |
| Alert Dialog / Sheet / Drawer conflict | —                            | If a recipe attempts to change behavior (e.g., a Sheet that disables outside-click), that policy must migrate to a primitive prop; recipes never own behavior |

**Enforcement:** the primitive family's conformance suite includes fixtures for every declared primitive-prop variant. A recipe cannot be published as a family variant if its behavior fixtures differ from the base primitive. Conformance runs against the primitive; the recipe is a separate visual conformance target.

This eliminates the "which layer owns the policy" ambiguity that appears in existing systems where Alert Dialog is a separate component from Dialog with duplicated state code.

---

> **Purpose:** For Solid 2 primitive authors, defines the runtime rules primitives must follow for scheduling, effects, refs, classes, reactive props, SSR/hydration, document-scoped services, and compiler independence.

# 8. Solid 2-native runtime rules

## 8.1 Scheduling

Solid 2's scheduling model requires primitives to avoid assumptions that state writes are synchronously visible through subsequent reads.

State transitions should calculate the next value once and pass it through the transition path:

```ts
const nextOpen = !state.open()
state.requestOpenChange(nextOpen, {
  reason: "trigger",
  originalEvent: event,
})

// Use nextOpen here if the handler needs the proposed value.
// Do not re-read state.open() and assume it has already changed.
```

Rules:

- Do not use `flush()` in ordinary primitive implementation.
- Do not use effects to copy one signal into another.
- Treat controlled state as authoritative.
- Emit change requests with reason details.
- Use one semantic transition for related state changes where possible.

## 8.2 Effects and lifecycle

Primitive implementation must distinguish:

- Pure derived state.
- External synchronization.
- DOM application.
- One-time settled browser setup.

Rules:

- Use derived computations for derived values.
- Use lifecycle/settlement hooks only for browser-only setup.
- Use cleanup tied to the current owner for listeners, observers, timers, and engine handles.
- Do not initialize DOM engines during server rendering.
- Do not read layout before the relevant nodes are mounted and stable.

## 8.3 Refs

Solidiom uses Solid 2 ref directive factories and ref composition. It does not use `use:` directives.

A shared `composeRef` utility must support:

- Internal node registration.
- User refs.
- Adapter attachment.
- Cleanup on replacement.
- Multiple refs through arrays.

Ref ownership remains visible in source. There is no React-like `forwardRef` abstraction as the mental model.

## 8.4 Classes

Primitive and recipe source use `class`. `classList` is not part of the public contract.

Class merging is a recipe concern. Runtime behavior should not depend on class tokens.

## 8.5 Reactive props and context

Rules:

- Do not destructure reactive props into stale local values.
- Use accessors in context values.
- Construct context objects once per root.
- Prefer signals for scalar state.
- Use stores only where structural reactivity is valuable.
- Do not expose internal writable signals.
- Keep ownership local unless the primitive is explicitly document-scoped.

## 8.6 SSR and hydration

Every primitive must satisfy:

- Deterministic IDs between server and client.
- No browser-global reads during server rendering.
- Stable initial DOM anatomy.
- Browser measurement only after mount/settlement.
- Safe portal registration and cleanup.
- Stable ARIA relationships independent of client measurement.
- Adapter initialization may add algorithmic results but may not repair incomplete server semantics or accessibility.

## 8.7 Document-scoped services

Overlay and notification services are scoped by `Document`, not process-wide singletons.

Document services include:

- Layer stack.
- Escape-key arbitration.
- Pointer-outside routing.
- Focus-outside routing.
- Modal inertness.
- Scroll locking.
- Focus restoration.
- Portal target resolution.
- Live-region coordination.

This supports iframes, embedded documents, multiple windows, tests with multiple DOM roots, and microfrontend boundaries.

## 8.8 Compiler independence

Primitive correctness must not depend on a custom macro, Babel transform, Vite-only plugin, or source-to-source compiler pass. Runtime APIs should remain explicit enough for source ownership and enterprise review while structured enough for future lint and compiler assistance.

---

> **Purpose:** For Solid 2 primitive authors, describes the installed layout and core services of the Solidiom runtime kernel, including controllable state, collections, overlays, presence, and native form integration.

# 9. Runtime kernel

Recommended installed layout:

```text
src/ui/_runtime/
├── state/
│   ├── controllable-value.ts
│   ├── disclosure-state.ts
│   └── selection-state.ts
├── events/
│   ├── compose-event-handlers.ts
│   └── change-details.ts
├── dom/
│   ├── compose-ref.ts
│   ├── stable-id.ts
│   ├── owner-cleanup.ts
│   └── observe-element.ts
├── collection/
│   ├── collection.ts
│   ├── composite-navigation.ts
│   ├── roving-focus.ts
│   └── typeahead.ts
├── overlay/
│   ├── layer-stack.ts
│   ├── dismissable-layer.ts
│   ├── focus-scope.ts
│   ├── modal-isolation.ts
│   ├── portal.ts
│   └── scroll-lock.ts
├── presence/
│   └── presence.ts
├── form/
│   ├── form-control.ts
│   ├── hidden-input.ts
│   └── validation.ts
└── i18n/
    ├── direction.ts
    └── locale.ts
```

## 9.1 Controllable state

`createControllableValue` is the common controlled/uncontrolled implementation.

It supports:

- Controlled value accessor.
- Default value.
- Internal uncontrolled signal.
- Equality comparison.
- Change reason.
- Original event.
- Disabled, read-only, and required guards where relevant.

Example shape:

```ts
export interface ChangeDetails<Reason extends string = string> {
  reason: Reason
  originalEvent?: Event
}

export interface ControllableValueOptions<T, Reason extends string> {
  value?: Accessor<T | undefined>
  defaultValue: T | (() => T)
  onChange?: (next: T, details: ChangeDetails<Reason>) => void
  equals?: false | ((prev: T, next: T) => boolean)
  disabled?: Accessor<boolean>
  readOnly?: Accessor<boolean>
}

export interface ControllableValue<T, Reason extends string> {
  value: Accessor<T>
  requestChange: (next: T, details: ChangeDetails<Reason>) => void
}
```

The same model is used for:

- `open`
- `checked`
- `pressed`
- `expanded`
- Single selection
- Multiple selection
- Active item
- Slider values
- Current page

## 9.2 Collections

The collection runtime owns:

- Stable item IDs.
- DOM-order reconciliation.
- Disabled items.
- Text values.
- Active item.
- Single and multiple selection.
- Roving tab index.
- `aria-activedescendant` mode.
- Typeahead.
- Orientation.
- Directionality.
- Home, End, Page Up, and Page Down policies.

Used by:

- Menu.
- Listbox.
- Select.
- Combobox.
- Tabs.
- Radio Group.
- Toggle Group.
- Tree.

## 9.3 Overlay

The overlay runtime owns:

- Trigger/content relationships.
- Open state.
- Dismissal requests.
- Escape-key routing.
- Pointer-down-outside handling.
- Focus-outside handling.
- Focus capture.
- Focus restoration.
- Modal isolation.
- Scroll locking.
- Nested layer behavior.
- Presence coordination.

Positioning is not overlay semantics. It is an adapter capability.

## 9.4 Presence

Presence separates semantic visibility from DOM retention.

```ts
export interface PresenceState {
  open: Accessor<boolean>
  present: Accessor<boolean>
  phase: Accessor<"entering" | "entered" | "exiting" | "exited">
}
```

A closed dialog can remain mounted for an exit animation without remaining semantically modal or focus-trapped.

## 9.5 Native form integration

Form-capable primitives own native form behavior without requiring a form engine.

This includes:

- `name`
- `value`
- `required`
- `disabled`
- `readOnly`
- Reset handling
- Constraint validity
- Hidden input synchronization
- Label relationships
- Description relationships
- Error-message relationships

Optional framework-neutral form-model adapters may integrate validation or submission models, but they do not define native form semantics.

---

> **Purpose:** For Solid 2 primitive authors and application developers, specifies the public contract every Solidiom primitive must expose — part composition, change handlers, event composition, polymorphism, semantic DOM state, CSS variables, styling boundary, and prohibited engine types.

# 10. Primitive public contract

## 10.1 Part-based composition

Solidiom exposes namespaced parts:

```tsx
const [open, setOpen] = createSignal(false)

<Dialog.Root
  open={open()}
  onOpenChange={(next, details) => {
    if (details.reason !== "programmatic") setOpen(next)
  }}
>
  <Dialog.Trigger>Delete project</Dialog.Trigger>

  <Dialog.Portal>
    <Dialog.Backdrop />
    <Dialog.Content>
      <Dialog.Title>Delete project?</Dialog.Title>
      <Dialog.Description>
        This operation cannot be reversed.
      </Dialog.Description>
      <Dialog.Close>Cancel</Dialog.Close>
      <button type="button">Delete</button>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

The part syntax is ergonomic. It does not imply Radix, shadcn/ui, Kobalte, Corvu, or another external primitive implementation.

## 10.2 Change handlers

Change handlers use one consistent two-argument contract:

```ts
interface ChangeDetails<Reason extends string> {
  reason: Reason
  originalEvent?: Event
}

interface DialogRootProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (
    next: boolean,
    details: ChangeDetails<
      "trigger" | "close" | "escape-key" | "pointer-outside" | "focus-outside" | "programmatic"
    >,
  ) => void
}
```

Rules:

- The first argument is the proposed next value.
- The second argument explains why the transition was requested.
- Original DOM events are included only when one exists.
- Engine-specific events and instances are never exposed.
- Controlled components emit requests and continue to read the controlled prop.
- A primitive does not accept a generic `adapter` or `engine` prop.

## 10.3 Event composition

User handlers run before default primitive actions.

If a user handler calls `preventDefault()`, the documented default primitive action is suppressed.

Examples:

- Prevent a trigger click to prevent opening.
- Prevent an outside-pointer event to prevent dismissal.
- Prevent item selection to prevent selection and closing.
- Required safety cleanup remains non-cancellable.

## 10.4 Polymorphism

Solidiom uses an `as` prop where the replacement element can satisfy the semantic contract.

```tsx
<Menu.Item as={A} href="/settings">
  Settings
</Menu.Item>
```

Rules:

- Every part has a correct semantic default.
- Polymorphism is offered only where safe.
- Custom components must forward attributes, events, and refs.
- Development builds warn when required semantics are missing.
- Structural roles, generated IDs, and ARIA relationships are not casually overrideable.

## 10.5 Semantic DOM state contract

Semantic DOM state is **one of four mechanisms** in the complete Solidiom styling contract (see §14.3). By itself it makes styling-runtime dependencies _optional_, but it does not replace design tokens, themes, variants, responsive rules, resets, or animation definitions. A reader who applies §10.5 in isolation will form an incomplete mental model; §14 must be read alongside it.

State styling uses normalized first-party attributes:

```html
<div data-scope="dialog" data-part="content" data-state="open" data-modal></div>
```

Standard attributes include:

- `data-scope`
- `data-part`
- `data-state`
- `data-disabled`
- `data-readonly`
- `data-required`
- `data-invalid`
- `data-orientation`
- `data-highlighted`
- `data-selected`
- `data-placeholder`
- `data-dragging`
- `data-transition`

Rules:

- `data-scope` identifies the primitive family, such as `select`.
- `data-part` identifies the public part, such as `trigger`.
- `data-state` uses a documented vocabulary.
- Only first-party primitive code writes the public semantic attribute contract.
- Attribute names and values are independent of adapters and styling systems.
- Semantic attributes are versioned DOM contracts.
- Adapters may not add or override public `data-scope`, `data-part`, or `data-state` attributes.
- External-engine attributes may exist only on non-public internal nodes when unavoidable and are never documented as styling hooks.

## 10.6 CSS variable contract

Behavioral variables use an Solidiom namespace:

```css
--solidiom-anchor-width
--solidiom-available-height
--solidiom-transform-origin
--solidiom-drawer-progress
--solidiom-carousel-snap-count
```

Recipe and theme variables use an application-facing namespace:

```css
--ui-surface
--ui-surface-raised
--ui-text
--ui-text-muted
--ui-border
--ui-accent
--ui-accent-contrast
--ui-danger
--ui-focus-ring
--ui-radius
--ui-shadow-overlay
```

The primitive may map algorithm snapshots to behavioral variables. The adapter itself does not write public CSS variables or inline styles.

## 10.7 Styling boundary

Semantic attributes are sufficient to avoid mandatory styling-runtime dependencies, but they are not a complete styling system.

A complete Solidiom styling contract consists of:

1. Semantic `data-*` attributes.
2. Stable behavioral CSS variables.
3. Optional recipe and token profiles.
4. Static enforcement that adapters cannot inject public styling.

Design tokens, visual variants, responsive rules, resets, themes, and animation definitions remain recipe or application concerns.

## 10.8 Engine and legacy type prohibition

Public primitive source and exported types must not contain:

- Floating UI middleware types.
- TanStack `Virtualizer`, `Table`, `Row`, or column-definition types.
- Embla API or option types.
- `@internationalized/date` classes.
- Kobalte types.
- Corvu types.
- Ark, Zag component-binding, Radix, Base UI, or React Aria types.
- Legacy facade types.

CI statically enforces this boundary.

---

> **Purpose:** For Solid 2 primitive authors and Solidiom roadmap owners, lists the initial primitive foundation and specialized second wave, and clarifies what remains first-party even when an adapter is used.

# 11. First-party primitive layer

## 11.1 Initial foundation

The first stable set should validate all core runtime families.

### Basic semantics

- Button
- Label
- Visually Hidden
- Separator
- Progress
- Meter

### Fields

- Field
- Text Field
- Text Area
- Number Field
- File Field

### Selection

- Checkbox
- Radio Group
- Switch
- Toggle
- Toggle Group
- Slider

### Disclosure and navigation

- Collapsible
- Accordion
- Tabs
- Pagination

### Overlays

- Dialog
- Popover
- Tooltip
- Menu

### Collections

- Listbox
- Select
- Combobox

### Feedback

- Toast
- Alert

## 11.2 Specialized second wave

After adapter boundaries are proven:

- Drawer
- Calendar
- Date Picker
- Range Calendar
- Carousel
- Virtual List
- Tree
- Data Table
- Resizable Panels
- Command Palette

## 11.3 What remains first-party in specialized components

Even when an engine is used, the Solidiom primitive owns the component.

For `Select`, Solidiom owns:

- Trigger semantics.
- Listbox semantics.
- Selection state.
- Collection identity.
- Keyboard behavior.
- Typeahead.
- Hidden form control.
- Focus restoration.
- Open state.
- Dismissal.
- State attributes.

The positioning adapter owns only geometry.

For `Calendar`, Solidiom owns:

- Grid roles.
- Keyboard navigation.
- Selection policy.
- Disabled/unavailable dates.
- Focus.
- Range semantics.
- Labels.
- Public value contract.

The date-math adapter owns only calendar arithmetic and locale/time-zone calculations.

---

> **Purpose:** For Solidiom adapter authors and Solid 2 platform engineers, defines what an adapter is, which engines qualify, the capability snapshot contract, prohibited outputs, lifecycle rules, selection, escape-hatch prohibition, and how the boundary is statically enforced.

# 12. Adapter architecture

## 12.1 Definition and eligibility

`adapters/` is reserved for framework-neutral specialized engines only.

An external engine is eligible when all of the following are true:

1. Its core is framework-neutral.
2. It solves a specialized algorithmic problem rather than a complete UI primitive problem.
3. It can be represented through a narrow deterministic Solidiom capability port.
4. It does not require control of public anatomy, roles, ARIA, state names, styling, or event semantics.
5. It can be replaced without changing primitive APIs or public DOM contracts.
6. It has a bounded lifecycle and explicit cleanup model.

Kobalte, Corvu, Radix, Ark, Zag component bindings, Base UI, React Aria Components, and similar primitive systems are categorically ineligible. Their support belongs in `migrations/` and, where useful, `legacy/`.

## 12.2 What framework neutrality means

The external engine must be framework-neutral. The adapter implementation itself is Solid-aware glue because it must integrate accessors, ownership, lifecycle, and cleanup correctly.

Therefore:

```text
framework-neutral engine core
        │
        ▼
Solid 2 Solidiom adapter
        │
        ▼
Solidiom capability snapshot
```

Official adapters should target engine cores directly rather than existing Solid wrappers so that Solidiom controls Solid 2 lifecycle integration and does not inherit another wrapper's public types or update cadence.

## 12.3 Default capabilities

| Capability           | Candidate engine                       | Engine may own                                                    | Engine must not own                                                                 |
| -------------------- | -------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| `positioning@1`      | Floating UI DOM/core                   | Coordinates, collision, available size, placement, arrow geometry | Open state, dismissal, focus, ARIA, portal, presence, public styles                 |
| `virtualization@1`   | TanStack Virtual core                  | Visible range, measurements, scroll offsets                       | Collection identity, selection, keyboard navigation, item semantics, markup         |
| `table-model@1`      | TanStack Table core                    | Row models, sorting, filtering, grouping, pagination calculations | Table/grid markup, roles, focus, editing semantics                                  |
| `carousel-physics@1` | Embla core                             | Snap points, drag physics, looping, movement                      | Labels, controls, selected-slide public state, announcements, classes               |
| `date-math@1`        | `@internationalized/date`              | Calendar arithmetic, locale calculations, time-zone conversion    | Calendar DOM, keyboard interaction, focus, selection contract, public value classes |
| `form-model@1`       | Optional framework-neutral form engine | Validation and submission model                                   | Labels, descriptions, native control behavior, form participation                   |

## 12.4 Capability snapshots, not part props

An adapter returns Solidiom-owned data structures. It does not return `JSX.HTMLAttributes`, part bindings, classes, roles, ARIA, or semantic state attributes.

```ts
export type PositionPlacement =
  | "top"
  | "top-start"
  | "top-end"
  | "right"
  | "right-start"
  | "right-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"

export interface PositionSnapshot {
  x: number
  y: number
  placement: PositionPlacement
  strategy: "absolute" | "fixed"
  availableWidth?: number
  availableHeight?: number
  arrowX?: number
  arrowY?: number
  anchorHidden: boolean
}

export interface PositionerOptions {
  reference: Accessor<Element | undefined>
  floating: Accessor<HTMLElement | undefined>
  open: Accessor<boolean>
  placement: Accessor<PositionPlacement>
  offset: Accessor<number>
}

export interface PositionerHandle {
  snapshot: Accessor<PositionSnapshot>
  update(): void
  destroy(): void
}

export interface PositioningCapability {
  create(options: PositionerOptions): PositionerHandle
}
```

The primitive maps the snapshot to its own inline geometry or `--solidiom-*` variables and remains the only layer that writes semantic attributes.

## 12.5 Prohibited adapter outputs

Capability adapters may not emit or mutate:

- `class` or class-token arrays.
- Public inline visual styles.
- Recipe or theme variables.
- `role`.
- `aria-*`.
- `data-scope`, `data-part`, `data-state`, or other public state attributes.
- Public change reasons.
- Primitive open, selected, checked, or expanded state.
- Public DOM anatomy.
- A third-party engine instance through the primitive API.

Adapters should not create public DOM nodes. If an engine requires a private measurement object or internal node, its existence must remain undocumented, non-semantic, and invisible to styling contracts.

## 12.6 Lifecycle and cleanup

Adapters must:

- No-op browser work during SSR.
- Start observers and auto-update work only while the relevant primitive is mounted and active.
- Dispose listeners, observers, timers, and engine handles through the current Solid owner.
- Avoid synchronous-state assumptions that conflict with Solid 2 batching.
- Expose deterministic `destroy()` behavior for conformance tests.
- Avoid module-level mutable singletons unless the capability is explicitly document-scoped.

## 12.7 Selection and replacement

Project configuration selects one implementation per capability:

```json
{
  "adapters": {
    "positioning": "official/positioning-floating-ui",
    "virtualization": "official/virtualization-tanstack",
    "tableModel": "official/table-tanstack",
    "carouselPhysics": "official/carousel-embla",
    "dateMath": "official/date-internationalized"
  }
}
```

The resolver installs or references the chosen adapter at a stable capability path. Replacing the positioning implementation changes the capability provider, not every popover, menu, tooltip, combobox, or select.

A test-double implementation must exist for each critical capability so primitive tests do not depend exclusively on one engine.

## 12.8 No engine escape hatch

Primitives do not expose:

```ts
floatingOptions
tanstackOptions
emblaOptions
engine
middleware
virtualizer
tableInstance
```

A narrow Solidiom option may be added only when it represents a stable product capability independent of one engine. Consumers needing a complete engine API should use that engine directly outside the Solidiom primitive.

## 12.9 Static enforcement

CI must verify:

- External engine imports occur only in `adapters/`.
- `adapters/` does not import known primitive systems.
- Adapter public types contain no JSX attribute bags.
- Adapter outputs cannot include semantic attributes or classes.
- Primitive public types contain no engine types.
- Recipes and legacy facades do not satisfy capability ports.

---

> **Purpose:** For Solidiom CLI users, platform teams, and enterprise operators, describes the hybrid package/source distribution system — the two consumer modes, package topology, parity rule, source-mode layout, manifests, resolver, CLI, lockfile, three-way update, security model, enterprise policy, and adoption tracks.

# 13. Hybrid package and source distribution system

## 13.1 Distribution principle

Solidiom supports normal package consumption and app-owned source consumption from the same canonical authored source.

The package tarball is the immutable source of truth. It contains or references:

- Compiled runtime output.
- Canonical TS/TSX source.
- Source-install manifests.
- Contract and capability metadata.
- Migrations.
- Conformance fixtures or test metadata.
- Licenses, notices, integrity data, and optional signatures.

A registry index provides search, discovery, and dependency resolution. It is not an independent implementation store.

## 13.2 Supported consumer modes

### Package mode — default for application teams

```bash
solidiom add dialog --mode package
```

or through the package manager:

```bash
pnpm add @solidiom/dialog
```

Package mode provides:

- Conventional imports and upgrades.
- Minimal source ownership burden.
- Shared compiled runtime dependencies.
- Straightforward enterprise package mirroring.
- The simplest onboarding path.

**Package-only projects do not require any `.solidiom/` files.** A team that only uses package mode can install and upgrade through the package manager without running `solidiom init`, `solidiom add`, or any other Solidiom CLI command. The `.solidiom/` directory (config, lockfile, policy) activates only when:

- Source mode is used for at least one item.
- Organization policy is enforced through `.solidiom/policy.json`.
- A migration is run through `solidiom migrate`.
- CI runs `solidiom verify` or `solidiom audit`.

For teams that never enter source mode, `pnpm add @solidiom/dialog` and normal import statements are sufficient. The CLI treats absence of `.solidiom/config.json` as a valid pure-package-mode project.

### Source mode — default for platform and design-system teams

```bash
solidiom add dialog --mode source
```

Source mode provides:

- Editable application-owned TS/TSX/CSS.
- Local runtime modules deduplicated by the resolver.
- Provenance and three-way updates.
- Full internal design-system customization.
- No required Solidiom primitive runtime package after materialization.

Both modes are Tier 1 and must pass the same API, DOM, accessibility, SSR, and interaction contracts.

## 13.3 Hybrid package topology

Recommended packages include:

```text
@solidiom/runtime
@solidiom/dialog
@solidiom/select
@solidiom/calendar
@solidiom/primitives          # optional umbrella re-export
@solidiom/recipes-css
@solidiom/recipes-tailwind
@solidiom/recipes-unocss
@solidiom/adapter-positioning-floating-ui
@solidiom/adapter-virtualization-tanstack
@solidiom/cli
@solidiom/registry-sdk
@solidiom/conformance
@solidiom/eslint-plugin
@solidiom/migrate-shadcn-solid
@solidiom/legacy-shadcn-solid # temporary and explicitly installed
```

Per-component packages are the primary publication unit. The umbrella package provides ergonomics but must remain a thin re-export surface with no divergent implementation.

## 13.4 Specific benefits of the hybrid model

| Benefit                            | Architectural value                                                                                  |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Enterprise-compatible distribution | Existing npm mirrors, artifact scanners, and allowlists can handle Solidiom artifacts.                   |
| Reproducibility                    | Compiled output, canonical source, manifests, migrations, tests, and licenses version together.      |
| Dual adoption path                 | Teams can begin with packages and source-own only the components that require customization.         |
| Reviewability                      | Security and platform teams can inspect the exact source shipped in the package tarball.             |
| Controlled customization           | Source mode records provenance rather than encouraging anonymous copy-paste.                         |
| Smaller dependency cones           | Per-component packages and source manifests pull only the runtime modules and engines they require.  |
| Migration alignment                | Codemods and legacy metadata ship with the versions they target.                                     |
| Offline and internal operation     | After mirroring the packages, source installation and verification do not require a public registry. |

## 13.5 Package/source parity rule

Package mode and source mode must be generated from the same canonical source commit and contract version.

The build must fail if:

- Exported package types differ from source-installed types.
- Public semantic attributes differ.
- Default behavior differs.
- One mode has an undeclared runtime dependency.
- One mode passes accessibility or hydration tests that the other fails.

## 13.6 Source-mode installed layout

```text
src/ui/
├── _runtime/
│   ├── state/
│   ├── collection/
│   ├── overlay/
│   ├── presence/
│   └── form/
├── _adapters/
│   ├── positioning.ts
│   ├── date-math.ts
│   └── carousel-physics.ts
├── primitives/
│   ├── dialog.tsx
│   ├── menu.tsx
│   ├── select.tsx
│   └── calendar.tsx
├── recipes/
│   ├── dialog.tsx
│   └── select.tsx
├── blocks/
└── styles/

.solidiom/
├── config.json
├── policy.json
└── lock.json
```

`migrations/` and `legacy/` remain repository or package concerns. They are not copied into ordinary application runtime source unless explicitly requested.

**The `.solidiom/` directory shown above is required only for projects that use source mode, enforce policy, or run migrations.** Pure package-mode projects do not create it. `solidiom init` bootstraps `.solidiom/config.json` when a team first opts into source mode, policy enforcement, or migration workflows; it is not part of onboarding for package-only consumers.

## 13.7 Package-backed manifest

Illustrative primitive manifest:

```json
{
  "$schema": "https://registry.solidiomui.com/v1/item.schema.json",
  "id": "primitive/select",
  "version": "0.4.0",
  "package": "@solidiom/select",
  "channel": "next",
  "framework": {
    "name": "solid-js",
    "major": 2,
    "tested": ["2.0.0-beta.0"]
  },
  "modes": ["package", "source"],
  "provides": ["primitive/select@1"],
  "requires": [
    "runtime/controllable-value@1",
    "runtime/collection@1",
    "runtime/composite-navigation@1",
    "runtime/form-control@1",
    "runtime/overlay@1",
    "capability/positioning@1"
  ],
  "sourceFiles": [
    {
      "id": "primitive.select",
      "source": "src/select.tsx",
      "target": "{uiRoot}/primitives/select.tsx"
    }
  ],
  "contracts": ["api/select@1", "dom/select@1", "a11y/listbox@1"],
  "migrations": [
    {
      "from": ">=0.3.0 <0.4.0",
      "transform": "rename-selection-reason-v1"
    }
  ],
  "integrity": "sha256-...",
  "signature": "sigstore-or-equivalent-reference"
}
```

Illustrative adapter manifest:

```json
{
  "id": "adapter/positioning-floating-ui",
  "version": "0.2.0",
  "package": "@solidiom/adapter-positioning-floating-ui",
  "provides": ["capability/positioning@1"],
  "requires": ["runtime/owner-cleanup@1"],
  "npmDependencies": [
    {
      "name": "@floating-ui/dom",
      "version": "registry-pinned"
    }
  ],
  "sourceFiles": [
    {
      "id": "adapter.positioning",
      "source": "src/positioning.ts",
      "target": "{uiRoot}/_adapters/positioning.ts"
    }
  ],
  "contracts": ["adapter/positioning@1"],
  "integrity": "sha256-..."
}
```

## 13.8 Resolver

For `solidiom add select`, the resolver:

1. Resolves the requested item and selected mode.
2. Traverses primitive and runtime requirements.
3. Resolves framework-neutral capability providers.
4. Applies organization policy and configured adapter choices.
5. Rejects incompatible or disallowed engines and registries.
6. Calculates package and/or source file changes.
7. Calculates npm dependencies and removals.
8. Produces a deterministic installation plan.
9. Applies the plan atomically.
10. Records exact versions, modes, parameters, and digests.

Migration and legacy packages are never chosen as capability providers.

## 13.9 CLI surface

Commands are grouped by lifecycle role. Inspection commands are consolidated under `solidiom inspect` to keep the top-level surface small; the individual verbs remain available as aliases during the v0.6 transition and are removed in v1.0.

**Setup and planning:**

```bash
solidiom init
solidiom plan select
solidiom plan select --mode package --json
solidiom doctor
```

**Install and remove:**

```bash
solidiom add select --mode package
solidiom add select --mode source
solidiom add calendar --mode source --adapter date-math=official/date-internationalized
solidiom remove select
solidiom detach select
```

**Inspect (consolidated subcommand):**

```bash
solidiom inspect source dialog          # source paths
solidiom inspect source dialog --print
solidiom inspect manifest dialog        # resolved manifest
solidiom inspect explain dialog         # capability graph and policy decisions
solidiom inspect files dialog           # file writes recorded in lock
solidiom inspect provenance dialog      # artifact digest, signature identity, install history
```

Legacy aliases (`solidiom source`, `solidiom manifest`, `solidiom explain`, `solidiom files`, `solidiom provenance`) are supported in v0.6 with a deprecation warning and removed in v1.0.

**Change and update:**

```bash
solidiom diff
solidiom update
solidiom update select
solidiom update --check
```

**Migration and legacy lifecycle:**

```bash
solidiom migrate shadcn-solid
solidiom legacy add shadcn-solid
solidiom legacy status
solidiom legacy remove shadcn-solid
```

**Verification and audit (CI-oriented):**

```bash
solidiom verify --ci
solidiom verify --no-network
solidiom audit --licenses --sbom --json
```

`plan` must show:

- Consumer mode.
- Packages and source items.
- Runtime modules.
- Adapter choices.
- NPM dependency changes.
- Files to create, modify, or remove.
- Policy decisions.
- Migration or legacy warnings.
- Integrity and signature status.

`inspect` subcommands make the CLI's source access transparent rather than opaque.

## 13.10 Lockfile and provenance

`.solidiom/lock.json` records package-mode and source-mode items:

```json
{
  "items": {
    "primitive/select": {
      "mode": "source",
      "version": "0.4.0",
      "package": "@solidiom/select",
      "registry": "official",
      "artifactDigest": "sha256-...",
      "parameters": {
        "style": "css",
        "uiRoot": "src/ui"
      },
      "files": [
        {
          "id": "primitive.select",
          "target": "src/ui/primitives/select.tsx",
          "baseDigest": "sha256-...",
          "installedDigest": "sha256-..."
        }
      ]
    }
  }
}
```

The lockfile is committed to source control. It is not a replacement for the package-manager lockfile; it records Solidiom-specific source provenance and contract resolution.

## 13.11 Updating modified source

Source-mode updates use:

- **Base:** the exact previously installed immutable artifact.
- **Local:** the application's current file.
- **Remote:** the new immutable artifact.

Procedure:

1. Resolve old and new package-backed artifacts.
2. Verify digests and signatures according to policy.
3. Reapply recorded transformations to both artifacts.
4. Run structural migrations with explicit preconditions.
5. Perform a three-way merge.
6. Parse and validate resulting TS/TSX/CSS.
7. Run selected conformance checks.
8. Report unresolved conflicts.
9. Update lock data only after successful transaction.

Rules:

- Local changes are never silently overwritten.
- Conflict files do not count as updated.
- Migrations do not use uncontrolled broad search-and-replace.
- The CLI can emit a patch without applying it.
- Failed updates leave the original project state intact.
- `detach` stops source management without deleting application files.

Package-mode upgrades use the package manager, but the CLI may still plan contract, adapter, recipe, and migration effects before the package update is applied.

## 13.12 Registry and source-install security

The default trust model requires:

- Package and registry namespace identity.
- Exact artifact digests.
- Optional or policy-required publisher signatures.
- Declared licenses and notices.
- Declared package dependencies.
- Declared file writes and deletes.
- No undeclared project mutation.
- No automatic execution of arbitrary registry JavaScript.
- Built-in or declarative structural migrations by default.
- Explicit policy opt-in for custom executable transforms.
- Atomic application and rollback on failure.
- Machine-readable audit output.

### 13.12.1 Signature and key distribution

Signature verification requires a defined trust root. Solidiom supports two modes; a project selects one through policy.

**Mode A: keyless with OIDC identity binding (default for public artifacts).**

Signatures use a Sigstore-compatible transparency log with keyless signing. Each signed artifact carries an OIDC identity claim (for example `https://github.com/solidiom/solidiom` from the GitHub Actions workflow that published it). The client verifies:

1. The signature is valid against the Rekor transparency log entry.
2. The identity claim matches an entry in the project's `trustedIdentities` policy list.
3. The claim's issuance time falls within the artifact's declared validity window.

```json
{
  "signatureMode": "keyless",
  "trustedIdentities": [
    {
      "issuer": "https://token.actions.githubusercontent.com",
      "subjectPattern": "https://github.com/solidiom/solidiom/.github/workflows/publish.yml@refs/heads/main"
    }
  ]
}
```

**Mode B: explicit trusted keys (default for internal mirrors).**

Enterprises that operate an internal registry publish and verify with organization-controlled keys. A committed `.solidiom/trusted-keys.json` file, or a policy-referenced key bundle, holds the accepted public keys with rotation metadata.

```json
{
  "signatureMode": "explicit-keys",
  "trustedKeys": [
    {
      "id": "internal-2026",
      "algorithm": "ed25519",
      "publicKey": "MCowBQYDK2VwAyEA...",
      "validFrom": "2026-01-01T00:00:00Z",
      "validUntil": "2027-01-01T00:00:00Z",
      "successor": "internal-2027"
    }
  ]
}
```

Rules that apply to both modes:

- The trust configuration is committed to source control, not fetched at runtime.
- Rotation is explicit: a new identity or key must be added to policy before its artifacts will verify; retired identities and keys remain accepted for artifacts within their historical validity window.
- The CLI refuses to install an artifact whose signature does not match at least one active or historically valid trust entry.
- Verification failures surface a machine-readable reason (`signature/missing`, `signature/identity-not-trusted`, `signature/key-not-found`, `signature/log-inclusion-missing`).
- `solidiom verify --no-network` uses the locally cached transparency-log inclusion proofs and does not require reaching Rekor at verification time.

## 13.13 Enterprise policy

`.solidiom/policy.json` may enforce organization rules:

```json
{
  "$schema": "https://registry.solidiomui.com/v1/policy.schema.json",
  "defaultMode": "package",
  "allowedModes": ["package", "source"],
  "allowedRegistries": ["internal"],
  "allowedAdapters": {
    "positioning": ["official/positioning-floating-ui"],
    "virtualization": ["official/virtualization-tanstack"],
    "dateMath": ["official/date-internationalized"]
  },
  "allowedPrimitiveVersions": {
    "@solidiom/*": ">=0.6 <1.0",
    "@solidiom/select": ">=0.6.0 <1.0",
    "@solidiom/legacy-shadcn-solid": "<0"
  },
  "allowLegacy": false,
  "requireSignedArtifacts": true,
  "signatureMode": "explicit-keys",
  "allowExecutableTransforms": false,
  "requireLicenseReport": true,
  "requireSbom": true
}
```

`allowedPrimitiveVersions` uses semver ranges. The wildcard `@solidiom/*` applies to any package not explicitly listed. A `<0` range denies all versions and is the recommended way to block a package outright. Ranges are evaluated against the resolved installation graph, including transitive Solidiom package dependencies pulled by an umbrella or recipe.

Policy violations fail during `plan`, before project mutation.

## 13.14 Enterprise integration experience

Recommended enterprise operating model:

```text
Platform team
  ├── mirrors approved Solidiom packages
  ├── selects adapters and recipe profiles
  ├── defines policy and update cadence
  ├── owns shared source-mode customizations
  └── publishes approved internal packages or source manifests

Application teams
  ├── use package mode by default
  ├── source-own only approved components
  ├── run solidiom verify in CI
  └── use legacy facades only under an explicit migration plan
```

Required enterprise features include:

- Internal npm and registry mirror support.
- Offline add, plan, verify, and audit workflows.
- JSON output for CI and policy engines.
- Signature and integrity verification.
- License and SBOM export.
- Deterministic source paths and file ownership.
- Source/package parity reports.
- Approved adapter and legacy allowlists.

## 13.15 New-developer adoption and friction

Documentation should present three tracks:

```text
Track 1 — Use components
  Package mode. Minimal customization. Default onboarding.

Track 2 — Own components
  Source-install selected components and manage local changes.

Track 3 — Build a design system
  Source mode, organization policy, approved adapters, recipes, blocks, and internal publishing.
```

Primary friction points and mitigations:

| Friction                                                     | Mitigation                                                                            |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| Package mode versus source mode confusion                    | One explicit default per audience and mode shown in every install command.            |
| Primitive, recipe, adapter, migration, and legacy vocabulary | A one-page architecture map and CLI `explain` output.                                 |
| Assumption of shadcn API parity                              | Migration matrix and explicit non-compatibility diagnostics.                          |
| Responsibility for source-owned updates                      | Provenance, `diff`, three-way update, `detach`, and platform-team ownership guidance. |
| Adapter misunderstanding                                     | Reserve adapters for algorithms and prohibit primitive systems structurally.          |
| Solid 2 learning curve                                       | Focused guides for accessors, lifecycle, refs, SSR, and controlled state.             |
| Enterprise restrictions                                      | Policy-aware docs that show only approved modes, registries, and adapters.            |
| Legacy support becoming permanent                            | Sunset metadata, CI warnings, `legacy status`, and removal migrations.                |

---

> **Purpose:** For design-system authors and application developers, defines the Solidiom styling policy — primitive visual neutrality, the four-part styling contract, how adapter CSS injection is prevented, recipe profiles, and how UnoCSS integrates.

# 14. Styling, semantic attributes, recipes, and UnoCSS

## 14.1 Primitive styling policy

Primitives are visually unstyled.

They may apply behaviorally necessary values only, such as:

- Positioning coordinates derived from an adapter snapshot.
- Visually hidden structural styles.
- Scroll-lock styles.
- Presence-related hidden state.
- Gesture progress variables.

They do not contain:

- Brand colors.
- Typography scales.
- Radius decisions.
- Tailwind utilities.
- UnoCSS shortcuts.
- Product shadows.
- Icon choices.
- Adapter-provided classes.

## 14.2 Semantic attributes are a boundary, not a styling system

Semantic attributes provide stable selectors for any styling technology:

```html
<button data-scope="select" data-part="trigger" data-state="open" data-placeholder></button>
```

They solve:

- Stable state selectors.
- Styling-system independence.
- Inspectable DOM state.
- Package/source parity.
- A common target for CSS, Tailwind, UnoCSS, CSS Modules, or design-token pipelines.

They do not solve:

- Design tokens.
- Themes.
- Visual variants.
- Responsive rules.
- CSS reset or preflight.
- Class conflict resolution.
- Animation definitions.
- Product-level visual consistency.

Therefore the correct claim is:

> **Semantic data attributes make opinionated styling-runtime dependencies optional; they do not eliminate the need for recipes, tokens, and theme CSS.**

## 14.3 Complete styling contract

A styling-independent Solidiom primitive requires four coordinated mechanisms:

1. Stable semantic attributes.
2. Stable `--solidiom-*` behavioral variables.
3. Optional first-party or third-party recipes and tokens.
4. Enforcement that adapters cannot inject public styling.

A styling profile may be absent. The behavior must still be correct.

## 14.4 Preventing adapter CSS injection

Semantic attributes alone do not prevent a malicious or over-broad adapter from injecting CSS. Prevention requires type, lint, and conformance boundaries.

Capability adapter interfaces may not include:

- `JSX.HTMLAttributes`.
- `class` or class arrays.
- Public `style` objects.
- Recipe variables or theme tokens.
- `role`, `aria-*`, or public `data-*` state.

The primitive receives numeric or structured algorithm snapshots and maps them to its own DOM and behavioral variables.

CI must fail an adapter that:

- Imports a recipe or styling runtime.
- Writes public semantic attributes.
- Creates documented public DOM parts.
- Adds global CSS.
- Requires a theme provider.
- Returns an engine-specific class name as part of a capability contract.

## 14.5 Recipe profiles

Recipes are separate graphs:

```text
recipe/css/dialog
recipe/tailwind/dialog
recipe/unocss/dialog
recipe/shadcn-like/dialog
recipe/css/select
recipe/tailwind/select
recipe/unocss/select
```

A project selects a profile:

```json
{
  "style": "unocss",
  "tokens": "semantic"
}
```

`primitive/dialog` installs or imports only behavior. `dialog` installs or imports the selected recipe plus its primitive requirements.

## 14.6 UnoCSS relationship

| Dimension         | Solidiom                                                      | UnoCSS                                       |
| ----------------- | --------------------------------------------------------- | -------------------------------------------- |
| Primary purpose   | Solid 2-native UI behavior and distribution               | On-demand atomic CSS generation              |
| Main output       | Primitive packages or editable TS/TSX/CSS with provenance | Generated CSS                                |
| Owns UI semantics | Yes                                                       | No                                           |
| Owns styling      | Optional recipes only                                     | Yes                                          |
| Runtime behavior  | State, focus, keyboard, forms, overlays                   | None by default                              |
| Best fit          | Design-system behavior and app-owned UI source            | Utility styling, shortcuts, variants, tokens |

Correct integration:

```tsx
<Dialog.Content class="rounded-[var(--ui-radius)] bg-[var(--ui-surface)] p-6 shadow-[var(--ui-shadow-overlay)]">
  <Dialog.Title>Delete project?</Dialog.Title>
</Dialog.Content>
```

Solidiom owns the dialog. UnoCSS generates the CSS.

A future `@solidiom/unocss-preset` may map variants to semantic attributes:

```ts
// conceptual
uiOpen: (selector) => `${selector}[data-state="open"]`
uiDisabled: (selector) => `${selector}[data-disabled]`
uiHighlighted: (selector) => `${selector}[data-highlighted]`
```

Those variants style Solidiom state; they do not create it.

## 14.7 Variants and tokens

A small source-distributed recipe helper may exist, but no primitive requires a particular class-variance runtime.

```ts
export const buttonRecipe = defineRecipe({
  base: "button",
  variants: {
    intent: {
      neutral: "button--neutral",
      primary: "button--primary",
      danger: "button--danger",
    },
    size: {
      sm: "button--sm",
      md: "button--md",
      lg: "button--lg",
    },
  },
  defaults: {
    intent: "neutral",
    size: "md",
  },
})
```

Token and recipe contracts must remain serializable, reviewable, and replaceable by application-specific styling infrastructure.

---

> **Purpose:** For Solid 2 platform engineers and shadcn-solid migrators, explains how shadcn/ui fits into Solidiom as precedent, vocabulary, and migration expectation — what to adopt, adapt, and reject.

# 15. shadcn/ui relationship

shadcn/ui fits into Solidiom as precedent, vocabulary, and migration expectation. It does not fit as runtime foundation.

## 15.1 Adopt

Solidiom should adopt the following ideas:

- Source ownership.
- CLI-driven install flow.
- Registry distribution.
- User-editable local components.
- Blocks and examples as installable assets.
- Familiar component names where useful.
- Design-system documentation style.
- Visual recipe inspiration.

## 15.2 Adapt

Solidiom should adapt these ideas with stronger source-management semantics:

- `components.json` becomes `.solidiom/config.json` plus `.solidiom/lock.json`.
- Registry items become capability-aware source manifests.
- `add` becomes resolver-backed, adapter-aware installation.
- `diff` becomes provenance-aware local/upstream comparison.
- `update` becomes three-way merge plus migrations.

## 15.3 Reject

Solidiom should reject:

- React-oriented component boundaries as primitive architecture.
- External primitive delegation as public contract.
- shadcn/ui API compatibility as a goal.
- Component-count parity as an early success metric.
- Visual catalog names as one-to-one behavior modules.

## 15.4 Mapping examples

| shadcn/ui name | Solidiom interpretation                                               |
| -------------- | ----------------------------------------------------------------- |
| Dialog         | First-party Dialog primitive                                      |
| Alert Dialog   | Dialog with alert policy and recipe                               |
| Sheet          | Dialog recipe                                                     |
| Drawer         | Overlay plus gesture primitive                                    |
| Dropdown Menu  | Menu with click activation                                        |
| Context Menu   | Menu with context activation                                      |
| Menubar        | Menu group with horizontal navigation                             |
| Select         | Collection + overlay + form primitive                             |
| Combobox       | Collection + text input + overlay primitive                       |
| Command        | Combobox/listbox/search recipe; optional search adapter if needed |
| Calendar       | Calendar primitive plus date-math adapter                         |
| Carousel       | Carousel primitive plus physics adapter                           |
| Data Table     | Table recipe plus table-model adapter                             |
| Sonner         | Toast/notification recipe                                         |

---

> **Purpose:** For shadcn-solid migrators and platform teams, describes how migrations and legacy facades are deliberately separated, the migration workflow, the legacy facade model, CLI flow, and dependency-removal path.

# 20. Migration and legacy support

## 20.1 Separation of concerns

Compatibility support is split deliberately:

| Location      | Purpose                                                                    | Runtime status                         |
| ------------- | -------------------------------------------------------------------------- | -------------------------------------- |
| `migrations/` | Analyze and transform old application source                               | Build-time only                        |
| `legacy/`     | Preserve selected old imports or props while delegating to Solidiom primitives | Temporary, explicit runtime dependency |
| `adapters/`   | Bridge framework-neutral algorithms                                        | Normal runtime capability layer        |

There are no compatibility adapters.

## 20.2 Migration posture

Migration is source transformation and diagnostics, not hidden runtime emulation.

Primary packages may include:

```text
@solidiom/migrate-shadcn-solid
@solidiom/migrate-kobalte-imports
@solidiom/migrate-corvu-imports
```

Migration tools may understand old external types and source patterns, but their output targets first-party Solidiom primitives, recipes, and supported algorithm adapters.

## 20.3 Migration classes

| Class                        | Examples                                                                                      | Strategy                                                                                |
| ---------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| A: presentational            | Card, Badge, Skeleton, basic table styling                                                    | Import changes, class/token mapping, recipe installation                                |
| B: ordinary wrappers         | Checkbox, Tabs, Dialog, Popover, Tooltip                                                      | Import replacement, part renaming, prop mapping, selector rewrite                       |
| C: leaked upstream contracts | Kobalte Select generics, Corvu drawer context, Corvu calendar parts, direct primitive imports | Diagnostics, manual design choice, or temporary legacy facade when safely representable |

## 20.4 Migration workflow

```bash
solidiom migrate shadcn-solid
```

The command:

1. Inventories local UI files, imports, selectors, and package dependencies.
2. Identifies Kobalte, Corvu, Ark, and other primitive-system leakage.
3. Classifies each usage by migration confidence.
4. Produces a dry-run migration plan.
5. Resolves required first-party primitives, recipes, and framework-neutral algorithm adapters.
6. Rewrites safe imports, props, parts, and semantic selectors.
7. Offers a legacy facade only where the mapping is explicit and temporary.
8. Marks unresolved contexts, generics, or behavior assumptions.
9. Runs formatting, parsing, TypeScript, and selected conformance checks.
10. Produces a machine-readable migration report.

## 20.5 Legacy facade model

Legacy facades exist for application-facing continuity, not behavior delegation.

Example:

```text
legacy/shadcn-solid/dialog
  old import and selected prop aliases
        │
        ▼
first-party Solidiom Dialog primitive
```

A legacy facade may:

- Preserve a familiar import path through an explicit package.
- Map deprecated prop names to Solidiom props.
- Map old state selector names to the current semantic contract when unambiguous.
- Emit development warnings and migration links.

A legacy facade may not:

- Satisfy an adapter capability.
- Be imported by primitives or recipes.
- Re-export Kobalte or Corvu contexts as Solidiom contracts.
- Promise full behavioral parity with an old primitive system.
- Be installed automatically without user or policy approval.
- Remain indefinitely without a reviewed sunset.

When an old contract cannot be mapped safely, Solidiom must report the gap instead of delegating to the old primitive runtime.

## 20.6 Legacy CLI flow

```bash
solidiom legacy add shadcn-solid --components dialog,select
solidiom legacy status
solidiom migrate shadcn-solid --remove-legacy
solidiom legacy remove shadcn-solid
```

`legacy status` reports:

- Installed facades.
- Current usages.
- Replacement primitives.
- Available migrations.
- Sunset version or review date.
- Policy violations.

## 20.7 Dependency removal

After migration, the CLI proposes removal of no-longer-referenced primitive systems and legacy packages based on the import graph.

Removal is opt-in unless organization policy requires a deadline. No migration deletes packages or source before producing a plan.

---

> **Purpose:** For Solidiom primitive authors and QA/accessibility reviewers, defines accessibility ownership, overlay and collection invariants, and the conformance suites that gate primitives, adapters, migrations, and legacy facades.

# 16. Accessibility and conformance

## 16.1 Accessibility ownership

The first-party primitive layer owns:

- Roles.
- Accessible names.
- Descriptions and error relationships.
- Keyboard interaction.
- Focus order.
- Roving focus.
- Active-descendant behavior.
- Modal focus containment.
- Focus restoration.
- Live-region announcements.
- Pointer and keyboard modality.
- Directionality.
- Disabled and read-only semantics.
- Native form semantics.

An adapter, recipe, migration, or legacy facade cannot add or repair incomplete primitive accessibility after the fact.

## 16.2 Overlay invariants

Nested overlays must satisfy:

- Escape closes only the top eligible layer.
- Child-layer interaction is not outside interaction for the parent.
- Focus restoration targets the nearest valid trigger.
- Closing a parent safely disposes child layers.
- Modal isolation is reference-counted.
- Scroll locking is document-scoped.
- Exit animations do not leave an invisible focus trap active.

## 16.3 Collection invariants

Collection primitives test:

- Dynamic insertion and removal.
- DOM reorder.
- Disabled items.
- Duplicate display text.
- Typeahead timeout.
- Composed characters and IME.
- RTL navigation.
- Horizontal and vertical orientation.
- Selection following focus versus independent selection.
- Virtualized item registration.
- Focus recovery when the active item disappears.

## 16.4 Primitive test layers

Each primitive requires:

1. Unit tests for state and transitions.
2. Behavioral-family contract tests.
3. Browser interaction tests for keyboard, pointer, touch, and focus.
4. SSR and hydration tests.
5. Type-level API tests.
6. Accessibility-tree assertions.
7. Automated accessibility scans.
8. Manual assistive-technology release-candidate records.
9. Package/source parity tests.
10. Source-install golden tests.
11. Locally modified source-update tests.

## 16.5 Adapter conformance

Every implementation of a capability runs the same suite.

Positioning adapter tests verify:

- Stable cleanup.
- Placement normalization.
- Geometry snapshots.
- Resize and scroll updates.
- Hidden-anchor reporting.
- No ownership of focus or open state.
- No roles, ARIA, semantic attributes, classes, or theme variables in adapter output.
- No public DOM creation.
- SSR-safe imports and initialization.

An adapter that passes engine tests but violates the Solidiom port is incompatible.

## 16.5.1 Adapter side-effect conformance

Type surface and lint rules stop accidental styling or attribute injection through the capability port. They do not stop side effects that bypass the port. Every adapter must additionally pass a runtime side-effect suite that mounts the adapter in an isolated test document and asserts:

- No `<style>` or `<link rel="stylesheet">` element is appended to any document during module load, capability creation, `update()`, or `destroy()`.
- No global CSS rule is inserted into `document.adoptedStyleSheets` or a `CSSStyleSheet` reachable from any document.
- No mutation of `document.body` or `document.documentElement` attributes.
- No mutation of `class`, `style`, `data-*`, `role`, or `aria-*` on any element the adapter did not itself create as a declared internal node.
- No installation of global event listeners on `window` or `document` beyond those declared by the capability contract.
- No writes to `localStorage`, `sessionStorage`, or `IndexedDB`.
- On `destroy()`, all observers, listeners, timers, and engine handles created by the adapter are released and no leaked references remain reachable from the adapter module.

The suite runs against each official adapter and each policy-allowed enterprise adapter before release. An adapter that passes capability tests but fails side-effect conformance is incompatible.

## 16.6 Migration conformance

Each migration requires:

- Explicit input-version and source-pattern preconditions.
- **AST-based transformation only.** Structural migrations must operate on a typed abstract syntax tree with anchor detection; regex-based rewrites are prohibited for any migration that renames identifiers, moves imports, changes prop names, or transforms JSX. Regex is permitted only inside string-literal or comment-body rewrites where syntactic risk is bounded.
- Idempotence tests that verify a second run over the transformed source produces no additional changes.
- Positive and negative fixtures.
- Parse and type validation after transformation.
- A no-change path when preconditions do not match.
- A report of unresolved semantics rather than silent approximation.
- Rollback or patch-only operation.

## 16.7 Legacy facade conformance

Each legacy facade must:

- Delegate to first-party Solidiom primitives.
- Preserve or improve accessibility.
- Emit development deprecation diagnostics.
- Document unsupported old behavior.
- Do not import Kobalte, Corvu, or another primitive runtime; unsupported behavior must be reported by migration tooling.
- Include a migration that removes the facade.
- Publish a support end date or release condition.

Legacy facades are tested as migration aids, not as alternative primitive implementations.

---

> **Purpose:** For Solidiom performance engineers and primitive authors, explains why Solidiom is runtime-first, which bottlenecks matter, how optional static tooling may evolve, and the benchmark program used to gate stable release.

# 17. Runtime-first performance model and future static tooling

## 17.1 Runtime-first decision

Solidiom uses runtime primitives as its correctness foundation because Solid 2 already provides fine-grained accessors, direct DOM updates, owner-scoped cleanup, and explicit lifecycle behavior.

This choice provides:

- Readable and editable source-mode output.
- Ordinary TypeScript and TSX debugging.
- No compiler-plugin requirement for consumers.
- Easier enterprise source review.
- Stable adapter and primitive contracts while Solid 2 evolves.
- Identical semantics in package and source modes.

Runtime-first does not mean that runtime abstraction is automatically faster than every compile-time alternative. Performance must be demonstrated through measurement and disciplined implementation.

## 17.2 Fine-grained runtime rules

Primitive implementation should:

- Read only required accessors.
- Avoid broad stores for scalar state.
- Avoid effects that update derived state.
- Avoid recreating context values.
- Share document listeners and services.
- Keep item-level selection updates local.
- Avoid recomputing entire collections for one item change.
- Start layout observers and engine auto-update only while active.
- Avoid broad adapter snapshots when a narrow accessor suffices.
- Deduplicate source-installed runtime modules.

## 17.3 Likely bottlenecks

The dominant costs are expected to be:

- Focus and overlay coordination.
- Layout measurement and collision work.
- Resize, scroll, and mutation observers.
- Dynamic collection navigation.
- Virtualized rendering and measurement.
- Pointer gesture loops.
- Date-grid generation.
- SSR and hydration consistency.

A compiler transform does not automatically remove these costs.

## 17.4 Compile-time roadmap

Compile-time optimization is deferred behind the runtime contract, not abandoned. The staged plan is version-anchored so adopters can compare bundle projections against compile-time competitors.

| Solidiom version | Compile-time deliverable             | Scope                                                                                                                                | Enforcement                                  |
| ------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------- |
| 0.6.x        | Runtime contract stabilization       | Primitive, adapter, styling, and distribution contracts frozen                                                                       | Contract tests                               |
| 0.7.x        | ESLint plugin: import boundaries     | Rules block engine imports outside `adapters/`, primitive imports of legacy, adapter imports of recipes                              | Lint fails CI                                |
| 0.8.x        | ESLint plugin: anatomy and semantics | Rules verify required part relationships (Dialog.Root wraps Dialog.Content, etc.), missing accessible name warnings, forbidden props | Lint fails CI                                |
| 1.0          | Runtime-first stable release         | No compile-time features required for correctness; behavior guaranteed at runtime                                                    | Stable release gate                          |
| 1.1          | Static recipe extraction plugin      | Vite and Rollup plugin extracts static recipe classes at build time; source unchanged when plugin absent                             | Opt-in; produces measurable bundle reduction |
| 1.2          | Static variant expansion             | Compile-time variant tables replace runtime `defineRecipe` lookups for statically knowable variants                                  | Opt-in                                       |
| 1.3          | Dead-part elimination                | Unreachable optional parts pruned when consumer never renders them                                                                   | Opt-in                                       |
| 2.0          | Unused-capability detection          | Build fails if a resolved capability adapter is never invoked in the primitive graph; recipe-only paths shrink dep cone accordingly  | Enforced when enabled                        |

Rules that apply across the roadmap:

- No compile-time feature may change primitive semantics observable through public APIs, DOM contracts, or accessibility.
- Every compile-time feature ships with a "runtime-equivalent" mode used by tests and enterprise reviewers who cannot enable transforms.
- Each release publishes a bundle-size delta report versus the previous release with and without the compile-time features enabled.
- Compile-time features that require Solid-compiler internals are gated on Solid 2 stable; features that operate on TS/TSX AST alone may ship earlier.
- No feature listed here is a correctness dependency for source-mode consumers.

Potential lint and compile-time tooling within these milestones may:

- Validate required part relationships.
- Extract static recipe classes.
- Precompute variant tables.
- Detect unused capabilities.
- Remove unreachable optional parts.
- Validate semantic attribute vocabularies.
- Flag missing labels, titles, or descriptions where statically knowable.

No optional compiler feature may change primitive semantics or be required for correctness.

## 17.5 Benchmark program

Before stable release, CI should track:

- Dialog open and close latency.
- Nested overlay escape and focus-restoration latency.
- Select navigation with 1,000 items.
- Virtualized collection behavior with 10,000 items.
- Tabs activation cost.
- Calendar month navigation and range selection.
- Carousel drag frame stability.
- Observer and listener counts after mount/unmount cycles.
- Package-mode bundle size.
- Source-mode bundle size.
- Package/source runtime parity.
- Hydration mismatch rate and hydration completion time.

Budgets should be set from measured baselines rather than asserted without evidence.

## 17.6 Source graph minimization

Installing or importing a checkbox must not pull in:

- Overlay infrastructure.
- Positioning.
- Collection navigation.
- Virtualization.
- Date math.

A dialog must not pull in positioning. A popover may require positioning, but not listbox or form-model infrastructure unless another selected item requires it.

## 17.7 Engine loading

Specialized engines are present only when a selected item requires their capability.

A project using no floating content, virtual lists, data models, carousels, or calendars should receive none of the corresponding engine dependencies.

## 17.8 Package/source performance parity

Package mode may share a compiled `@solidiom/runtime`; source mode may deduplicate local runtime files. The two modes may differ in bundler topology, but they must preserve equivalent behavior and should remain within documented bundle and interaction budgets.

---

> **Purpose:** For Solidiom maintainers and contributors, defines the recommended monorepo layout, allowed and forbidden dependency directions, and the CI static enforcement that keeps the layers separated.

# 18. Repository and package structure

```text
apps/
├── docs/
└── playground/

packages/
├── runtime/
├── primitives/
│   ├── dialog/
│   ├── select/
│   ├── calendar/
│   └── ...
├── recipes/
│   ├── css/
│   ├── tailwind/
│   └── unocss/
├── adapters/
│   ├── positioning-floating-ui/
│   ├── virtualization-tanstack/
│   ├── table-tanstack/
│   ├── carousel-embla/
│   └── date-internationalized/
├── cli/
├── registry-sdk/
├── conformance/
└── eslint-plugin/

registry/
├── runtime/
├── primitives/
├── adapters/
├── recipes/
└── blocks/

migrations/
├── shadcn-solid/
├── kobalte-imports/
├── corvu-imports/
├── state-attributes/
└── solidiom-versioned/

legacy/
├── shadcn-solid/
├── import-aliases/
└── prop-facades/

tests/
├── contracts/
├── browser/
├── hydration/
├── package-source-parity/
├── source-install/
├── source-update/
├── adapter-conformance/
├── migration-fixtures/
└── legacy-conformance/
```

## 18.1 Dependency directions

```text
blocks       → recipes, primitives
recipes      → primitives, public runtime utilities
primitives   → runtime, capability ports
adapters     → capability ports, declared framework-neutral engines
runtime      → Solid 2, browser platform
legacy       → public primitives and recipes only
migrations   → source-analysis tooling, manifests, legacy metadata
```

## 18.2 Forbidden dependencies

```text
primitives   ✕ external engines, migrations, legacy
runtime      ✕ external engines, migrations, legacy
adapters     ✕ Kobalte, Corvu, Radix, Ark, Zag component bindings,
               Base UI, React Aria, recipes, legacy
recipes      ✕ primitive systems, adapter implementation details, legacy
legacy       ✕ runtime internals, adapter implementation details
migrations   ✕ transitive runtime dependency of normal components
```

## 18.3 Static enforcement

Repository CI should include:

- Import-boundary lint rules.
- Public-type scans for engine and legacy types.
- Adapter-output type checks.
- Package/source parity generation checks.
- Manifest-to-package integrity checks.
- Legacy sunset checks.
- Migration fixture tests.
- Dependency graph reports.

---

> **Purpose:** For Solidiom maintainers, release managers, and adopters, describes the version dimensions Solidiom tracks, package/source parity rules, the legacy facade lifecycle, and the Solid 2 beta channel policy.

# 19. Versioning, deprecation, and compatibility policy

Solidiom separates the following version dimensions:

- Package version.
- Source artifact version.
- Public primitive API contract.
- DOM and semantic attribute contract.
- Accessibility behavior contract.
- Adapter capability version.
- Engine dependency version.
- Migration input/output version.
- Legacy facade lifecycle version.
- Solid runtime compatibility.

Examples:

```text
capability/positioning@1
capability/virtualization@1
api/controlled-value@1
dom/dialog@1
a11y/listbox@1
legacy/shadcn-solid-dialog@1
```

A new engine version does not require a capability major version unless the Solidiom port changes incompatibly.

## 19.1 Package/source version parity

For a given Solidiom item version:

- Package and source modes share one public API contract.
- Package and source manifests identify the same canonical source revision.
- DOM and accessibility changes are documented once.
- A package release cannot silently ship source-install files from another version.

## 19.2 Legacy lifecycle

Every legacy facade declares:

- The old API it approximates.
- The first Solidiom version that introduced it.
- The preferred replacement.
- Unsupported behaviors.
- The migration that removes it.
- A target removal release or explicit review date.

Legacy facades use deprecation warnings in development and are excluded from umbrella packages by default.

## 19.3 Solid 2 beta policy

Until Solid 2 is stable:

- Solidiom publishes through a `next` channel.
- Each package and source item records exact tested runtime and compiler versions.
- CI runs the supported beta matrix.
- The CLI checks compatibility before package or source installation.
- Solid 1 compatibility code is not added to primitives.
- Breaking Solid beta changes may produce new channels or item versions.

After Solid 2 stabilizes:

- Stable Solidiom requires Solid 2.
- Beta-specific compatibility code is removed.
- Migration tooling may assist older applications, but the primitive runtime remains Solid 2-only.

---

> **Purpose:** For Solidiom project leads and roadmap owners, lists the four delivery phases and the exit criteria that gate each phase.

# 21. Delivery phases

## Phase 0: architectural proof

Implement six hard proofs:

1. Dialog primitive and runtime overlay stack.
2. Select primitive plus snapshot-only positioning adapter.
3. Calendar primitive plus engine-type-free date-math port.
4. Carousel primitive plus isolated physics adapter.
5. Package/source parity and modified-source three-way update.
6. One shadcn-solid migration and one temporary legacy facade implemented outside `adapters/`.

Exit criteria:

- No Kobalte or Corvu imports in primitives, runtime, recipes, or adapters.
- Adapters expose capability snapshots only.
- No adapter outputs classes, roles, ARIA, semantic attributes, or public DOM parts.
- Package and source modes pass identical contract tests.
- SSR and hydration pass.
- Local edits survive a source update.
- Migration and legacy support are structurally isolated.

## Phase 1: primitive and package alpha

Deliver:

- Runtime kernel.
- Core behavioral families.
- 15–20 primitives.
- Per-component packages and optional umbrella package.
- Plain-CSS recipes.
- Package and source modes.
- `init`, `plan`, `add`, `source`, `manifest`, `diff`, and `doctor`.
- Initial accessibility and package/source parity suites.

## Phase 2: distribution and enterprise beta

Deliver:

- Three-way source update engine.
- Structural migrations.
- Tailwind and UnoCSS recipe profiles.
- Package-backed registry index.
- Artifact signatures and integrity verification.
- Internal-registry and offline workflows.
- Policy file enforcement.
- License and SBOM output.
- Adapter authoring kit restricted to framework-neutral engines.
- Source graph visualizer.
- shadcn-solid migration reports and selected legacy facades.
- Runtime performance benchmark dashboard.

## Phase 3: stable

Stable release requires:

- Solid 2 stable support.
- Public API, DOM, accessibility, and capability contract review.
- External accessibility audit.
- Cross-browser interaction suite.
- Package/source parity certification.
- Source-update conflict suite.
- Enterprise no-network install and verification test.
- Documentation for every behavior family and consumer mode.
- At least one test double or alternative implementation for each critical capability.
- Published legacy sunset policy.
- No dependency-boundary exceptions.
- Performance budgets based on measured baselines.

---

> **Purpose:** For Solidiom project leads and adopters, catalogs the primary architectural risks Solidiom faces with the consequence of each risk and the mitigation strategy that keeps the program on track.

# 22. Risks and mitigations

| Risk                                                  | Consequence                                                       | Mitigation                                                                                                             |
| ----------------------------------------------------- | ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| First-party accessibility burden                      | Solidiom owns regressions directly                                    | Constrained primitive scope, shared conformance, external audits, release blockers                                     |
| Solid 2 beta churn                                    | Lifecycle and scheduling assumptions change                       | `next` channel, exact tested versions, isolated runtime modules, no Solid 1 branches                                   |
| Hybrid-mode confusion                                 | Developers do not know whether to import or source-own components | Package mode default for app teams, source mode default for platform teams, explicit CLI mode, three onboarding tracks |
| Package/source drift                                  | Two consumption paths behave differently                          | Generate both from one canonical source and require parity tests before publish                                        |
| Package sprawl                                        | Release and dependency management becomes complex                 | Per-component automation, changesets, thin umbrella package, shared runtime discipline                                 |
| Local source divergence                               | Source updates become difficult                                   | Immutable base artifacts, lockfile provenance, `diff`, structural migrations, three-way merge, `detach`                |
| Registry and source-install supply-chain risk         | Malicious files or transforms modify projects                     | Package-backed artifacts, digests, signatures, declared writes, policy, no automatic arbitrary scripts                 |
| Adapter abstraction grows too broad                   | Engines regain semantic authority                                 | Snapshot-only ports, prohibited output types, static import rules, conformance, no escape hatches                      |
| False framework neutrality                            | Solid wrappers or primitive systems enter as adapters             | Core-engine eligibility rule and explicit denylist for primitive systems                                               |
| Adapter CSS injection                                 | Third-party engine dictates styling                               | No JSX prop bags, no classes/ARIA/data/style output, lint and conformance enforcement                                  |
| Semantic attributes are mistaken for a styling system | Teams lack tokens, variants, and themes                           | Document four-part styling contract and ship optional recipe profiles                                                  |
| Legacy facades become permanent                       | Architecture accumulates old APIs and dependencies                | Explicit install, sunset metadata, CI warnings, `legacy status`, removal migrations, no umbrella inclusion             |
| Migration overreach                                   | Codemods silently change semantics                                | Preconditions, idempotent fixtures, patch-only mode, diagnostics for unresolved cases                                  |
| Runtime abstraction overhead                          | Excess memos, contexts, observers, or snapshots reduce gains      | Fine-grained rules, benchmark suite, listener counts, test doubles, narrow capabilities                                |
| Compiler-first pressure                               | Correctness becomes tied to unstable transforms                   | Runtime contract first; optional static tooling must preserve semantics                                                |
| Enterprise governance gaps                            | Teams cannot approve or reproduce installations                   | Policy files, internal mirrors, offline mode, JSON plans, signatures, SBOM/license output                              |
| Ownership ambiguity for copied source                 | App and platform teams disagree on maintenance                    | Provenance, ownership docs, source-mode governance, and explicit `detach` semantics                                    |
| Catalog pressure                                      | Quality declines while chasing parity                             | Behavioral-family roadmap and contract completion before catalog expansion                                             |
| Styling profiles drift                                | CSS, Tailwind, and UnoCSS recipes diverge                         | Shared primitive fixtures and semantic attribute contract across profiles                                              |
| Engine upgrades alter behavior                        | Algorithm changes cause subtle regressions                        | Pin engine versions, adapter conformance, independent adapter releases, benchmark comparison                           |

---

> **Purpose:** For Solidiom release managers and adopters, lists the numbered acceptance criteria that gate stable release across primitive ownership, adapter isolation, migration/legacy isolation, Solid 2 support, styling, hybrid distribution, enterprise experience, and demonstration cases.

# 23. Acceptance criteria

## Primitive ownership

1. No source under `runtime/` or `primitives/` imports Kobalte, Corvu, Ark, Zag component bindings, Radix, Base UI, React Aria, or another primitive system.
2. Common focus, overlay, collection, presence, form, state, and accessibility behavior is first-party.
3. All primitives use the same controlled/uncontrolled and change-details contracts.
4. All public parts use the same semantic attribute vocabulary.
5. Alert Dialog, Sheet, Hover Card, Command, and similar variants reuse behavior families rather than duplicate primitive stacks.

## Adapter isolation

6. `adapters/` contains only integrations with framework-neutral specialized engines.
7. Kobalte, Corvu, and other primitive systems have no adapter packages or capability providers.
8. External engine imports occur only under `adapters/`.
9. Adapter public interfaces return Solidiom snapshots or model data, not JSX attribute bags.
10. Adapter output cannot include classes, public style objects, roles, ARIA, semantic state attributes, or public DOM parts.
11. Public primitive types contain no engine types.
12. Primitive props contain no generic engine escape hatches.
13. Every adapter passes capability, lifecycle, SSR, and styling-boundary conformance.
14. Replacing an adapter does not require editing primitive APIs or public DOM contracts.

## Migration and legacy isolation

15. Migration code lives under `migrations/` and is not a production dependency of normal components.
16. Legacy facades live under `legacy/` and are never capability adapters.
17. Legacy facades delegate to first-party Solidiom primitives.
18. Legacy packages are explicitly installed and excluded from umbrella packages by default.
19. Every legacy facade documents unsupported behavior, replacement, migration, and sunset metadata.
20. `solidiom migrate shadcn-solid` reports unresolved Kobalte/Corvu contracts rather than hiding them behind runtime adapters.

## Solid 2 and runtime-first support

21. Primitive code contains no `use:` directives.
22. Primitive code does not depend on `classList`.
23. Primitive transitions do not rely on synchronous reads after writes.
24. Browser synchronization follows Solid 2 lifecycle and ownership behavior.
25. SSR and hydration tests pass for all primitives.
26. Stable implementation contains no Solid 1 compatibility branch.
27. No custom compiler transform is required for primitive correctness.
28. Optional static tooling produces behaviorally equivalent output.

## Styling boundary

29. Primitives are visually unstyled except for behaviorally necessary values.
30. Semantic attributes are emitted only by first-party primitives.
31. Adapters do not inject public CSS, classes, theme variables, or semantic state attributes.
32. Plain CSS, Tailwind, and UnoCSS recipes can target the same DOM contract.
33. Primitive behavior works with no recipe package installed.
34. Documentation states that semantic attributes do not replace tokens, themes, variants, or recipes.

## Hybrid distribution

35. Package and source modes are generated from the same canonical source revision.
36. Package and source modes pass the same API, DOM, accessibility, SSR, and interaction tests.
37. Package mode supports normal package-manager installation and internal mirroring.
38. Source mode applications have no required Solidiom primitive runtime package after materialization.
39. `plan` displays mode, packages, source items, adapter choices, dependency changes, file writes, policy decisions, and integrity status.
40. Every source-installed file has item identity, base digest, and artifact provenance.
41. `diff` distinguishes local edits from upstream changes.
42. `update` performs a three-way merge and never silently overwrites conflicts.
43. Registry and package artifacts are content-addressed.
44. Arbitrary registry JavaScript is not automatically executed.
45. Offline and internal-registry plan/add/verify flows work.

## Enterprise and CLI experience

46. `.solidiom/policy.json` can restrict modes, registries, adapters, legacy use, signatures, and executable transforms.
47. Policy violations fail during planning before project mutation.
48. `plan`, `verify`, and `audit` support machine-readable JSON.
49. The CLI exposes source paths, manifests, file lists, explanations, and provenance.
50. License and SBOM output is available for selected items and their dependencies.
51. Failed operations are atomic or provide a complete rollback path.
52. The documentation presents package-user, source-owner, and design-system tracks.

## Accessibility, quality, and performance

53. Every primitive has behavioral-family contract tests.
54. Overlay primitives pass nested-layer, focus restoration, dismissal, and modal-isolation tests.
55. Collection primitives pass keyboard, typeahead, dynamic-item, RTL, and virtualization tests.
56. Form-capable primitives work with native forms without a form-model engine.
57. Release candidates have manual assistive-technology verification records.
58. Adapter, migration, legacy, package/source parity, and source-update suites are release-gating.
59. Performance benchmarks track interaction latency, observer cleanup, large collections, hydration, and bundle topology.
60. Stable release budgets are based on measured baselines.

## Demonstration cases

61. `solidiom add dialog --mode package` installs no external primitive system or positioning engine.
62. `solidiom add dialog --mode source` materializes first-party runtime and primitive source with provenance.
63. `solidiom add select --mode source` installs first-party collection and overlay source plus only the configured positioning adapter.
64. `solidiom add calendar` exposes an Solidiom value contract rather than date-engine classes.
65. `solidiom add carousel` exposes Solidiom state and events rather than an Embla instance.
66. `solidiom add dialog --style unocss` uses UnoCSS only for styling.
67. A locally modified Select can be upgraded without losing unrelated local changes.
68. `solidiom migrate shadcn-solid` can offer a temporary legacy facade without creating a compatibility adapter.
69. `solidiom legacy status` identifies all remaining facade usages and removal paths.
70. Replacing the positioning adapter changes no primitive API or semantic selector.

---

> **Purpose:** For Solid 2 platform engineers and Solidiom reviewers, records the architectural alternatives that were considered and the reasoning behind each rejection.

# 24. Rejected alternatives

## 24.1 Update current peer ranges

Rejected because it preserves dependency-shaped APIs, mixed behavior, and upstream type leakage.

## 24.2 Replace current dependencies with another primitive suite

Rejected because Solidiom would still not own primitive contracts.

## 24.3 Fork Kobalte or Corvu wholesale

Rejected because it inherits their architecture and becomes a maintenance fork rather than a new Solid 2-native system.

## 24.4 Mechanical shadcn/ui port

Rejected because it preserves React-oriented component boundaries and prioritizes catalog parity over runtime coherence.

## 24.5 Use UnoCSS as the component system

Rejected because UnoCSS generates CSS and does not own accessibility, focus, forms, overlays, collections, or state semantics.

## 24.6 Publish only compiled primitive packages

Rejected as the sole model because it removes app-owned source and makes deep customization an override problem.

## 24.7 Require source mode for every team

Rejected because normal application teams benefit from conventional packages, enterprise mirrors, and ordinary upgrades. Source ownership remains first-class without being mandatory.

## 24.8 Use compatibility adapters for Kobalte or Corvu

Rejected because primitive systems are not specialized framework-neutral engines. Their support belongs in build-time migrations and temporary legacy facades.

## 24.9 Let adapters return arbitrary part props

Rejected because JSX prop bags allow adapters to inject roles, ARIA, data attributes, classes, styles, and event semantics, making the adapter the real primitive implementation.

## 24.10 Treat semantic attributes as the full styling system

Rejected because attributes expose state but do not define tokens, themes, variants, responsive behavior, resets, or visual consistency.

## 24.11 Make a compiler transform the primary primitive abstraction

Rejected for the initial architecture because it reduces source readability, complicates enterprise review, and couples correctness to evolving compiler semantics. Optional static assistance may be added later.

## 24.12 Make a mutable public web registry canonical

Rejected because package-backed immutable artifacts integrate better with internal mirrors, signatures, scanning, offline workflows, and deterministic source updates.

---

> **Purpose:** For Solidiom project leads and Solid 2 platform engineers, consolidates the Solidiom recommendation, defines relationships to related systems, sets defaults per consumer type, and prescribes the build order for the initial implementation.

# 25. Final recommendation

Create Solidiom as a new repository and product identity with this permanent mental model:

> **Primitives own behavior. Adapters provide algorithms. Recipes provide styling. Migrations help users move. Legacy facades are temporary.**

Treat related systems as follows:

| System                      | Solidiom relationship                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------ |
| shadcn/ui                   | Source-ownership precedent, registry UX reference, visual vocabulary, and demand map |
| shadcn-solid                | Migration source, example inventory, and dependency-leakage map                      |
| Kobalte                     | External primitive system recognized only by migrations and selected legacy facades  |
| Corvu                       | External primitive system recognized only by migrations and selected legacy facades  |
| UnoCSS                      | Optional recipe and styling backend                                                  |
| Floating UI                 | Eligible positioning engine behind a snapshot-only adapter                           |
| TanStack Virtual/Table core | Eligible virtualization and table-model engines behind adapters                      |
| Embla core                  | Eligible carousel-physics engine behind an adapter                                   |
| `@internationalized/date`   | Eligible date-math engine behind an engine-type-free adapter                         |

Use these defaults:

```text
Application team:
  package mode

Platform or design-system team:
  source mode with policy and provenance

Specialized engine:
  approved framework-neutral adapter

Existing shadcn-solid application:
  migration first, temporary legacy facade only when necessary
```

Build in this order:

1. First-party Solid 2 runtime kernel.
2. Dialog, Select, Calendar, and Carousel hard slices.
3. Snapshot-only adapter contracts and conformance.
4. Per-component packages, optional umbrella package, canonical source exports, and parity tests.
5. Source install, lockfile, provenance, diff, and three-way update.
6. Plain CSS recipes, then Tailwind and UnoCSS profiles.
7. Enterprise policy, signatures, offline operation, license/SBOM reporting, and machine-readable CLI output.
8. shadcn-solid migrations and narrowly scoped temporary legacy facades.
9. Broader primitive, recipe, and block catalog.
10. Optional lint and compiler assistance after runtime contracts and benchmarks are stable.

The success criterion is not early visual parity or the number of component names. The success criterion is that Solidiom provides one coherent Solid 2-native primitive contract across package and source modes, isolates every specialized engine behind an algorithm-only capability port, gives enterprises a deterministic and auditable integration path, and helps existing users migrate without turning old primitive systems into permanent runtime architecture.

---

> **Purpose:** For Solidiom reviewers and contributors, records the internal documents consolidated into v0.4 and the external references retained from v0.3.

# 26. Reference basis

This v0.6 document consolidates:

- `Solidiom-design-v0.5.md` (all normative decisions carried forward).
- The v0.5 architecture review, which produced the refinements enumerated in §0.1.
- `Solidiom-design-v0.4.md` (historical basis for v0.5).
- The earlier shadcn/ui and UnoCSS relationship clarifications.

External references retained from v0.3 include:

- Solid releases and Solid 2 beta notes: https://github.com/solidjs/solid/releases
- Solid documentation: https://docs.solidjs.com/
- shadcn/ui CLI and configuration: https://ui.shadcn.com/docs/cli and https://ui.shadcn.com/docs/components-json
- shadcn/ui registry documentation: https://ui.shadcn.com/docs/registry/registry-json and https://ui.shadcn.com/docs/registry/registry-item-json
- shadcn-solid documentation: https://shadcn-solid.com/docs/introduction and https://shadcn-solid.com/docs/about
- UnoCSS documentation: https://unocss.dev/
- Kobalte documentation: https://kobalte.dev/docs/core/overview/introduction/
- Corvu documentation: https://corvu.dev/docs/
- Floating UI `autoUpdate`: https://floating-ui.com/docs/autoupdate
- TanStack Virtual `Virtualizer`: https://tanstack.com/virtual/v3/docs/api/virtualizer
- Embla Carousel documentation: https://www.embla-carousel.com/docs/v8
- `@internationalized/date`: https://react-aria.adobe.com/internationalized/date/
- WAI-ARIA Authoring Practices Guide: https://www.w3.org/WAI/ARIA/apg/

---

> **Purpose:** For Solidiom project leads and implementers, records the tooling and process decisions made during creation of the implementation plan (`solidiom-implementation-plan.md`) and clarifies how each decision satisfies the normative design in §§1–26.

# 27. Implementation-time decisions

The design in §§1–26 is normative for architecture. This section records the operational choices made during implementation planning. Each decision names the mechanism, the alternatives that were considered and rejected, and the design sections it satisfies. These choices are pushback-able before implementation begins but become normative for the implementation once ratified.

Companion file: `docs/solidiom-implementation-plan.md` breaks these decisions into 68 sequenced tasks across the four phases in §21.

## 27.1 Monorepo tooling

**Decision:** Nx (integrated) + pnpm workspaces + Changesets.

**Rationale:** Nx's project graph mechanically enforces §5.5 forbidden authorities and §18.1–§18.2 dependency directions via `tags`. pnpm's workspace protocol and strict isolation surface phantom dependencies that would violate §6.7 (legacy transitive install) and §13.3 (per-component package boundaries). Changesets matches §19's per-package version dimensions and enables the independent release cadences described in §13.3.

**Rejected:** pnpm + Turborepo (relies on ESLint alone for boundary enforcement, duplicating a §18.3 deliverable), Bun workspaces (splits the toolchain for enterprise consumers who need Node per §13.14), single-config Rush/Lerna (boundary enforcement is manual).

## 27.2 Build tooling

**Decision:** `tsup` for pure-TS packages (runtime kernel, adapters that return data only, CLI, migrations, ESLint plugin). Vite library mode + `vite-plugin-solid` for JSX packages (primitives, component-shaped recipes, umbrella). Both presets dual-emit: `dist/` compiled ESM + `source/` canonical TSX. Package `exports` include the `"solid"` condition alongside `"import"` and `"types"`.

**Rationale:** Solid libraries require the `"solid"` export condition to hand uncompiled JSX to a downstream compiler when available; `vite-plugin-solid` handles this correctly out of the box. Dual emission is the mechanical enforcement of §13.5 (package/source parity) — one canonical source, two outputs, one build. §13.7 manifests reference the `source/` output for `solidiom add --mode source`. tsup's simplicity is preferred where no JSX is involved (§12.4 adapters return data structures only).

**Rejected:** tsup everywhere (Solid-shape correctness is fiddly under esbuild), pure Rollup (too much boilerplate at 15+ packages), unbuild (community Solid preset, not first-party).

## 27.3 Testing stack

**Decision:** Vitest with `@vitest/browser` mode (Playwright as browser provider) for both unit and browser layers. `@solidjs/testing-library` for component APIs. `expect-type` for §16.4 layer 5 type tests.

**Rationale:** One framework, one config, one CI shape. Real Chromium via `@vitest/browser` gives correct focus semantics, real Portal insertion, real IntersectionObserver, and real `document.adoptedStyleSheets` — the last is required by §16.5.1 side-effect conformance and is not provided honestly by jsdom or happy-dom.

**Risk:** `@vitest/browser` is not yet at 1.0 feature parity with standalone Playwright CT. Fallback path: if `@vitest/browser` becomes a persistent blocker, split browser tests out to Playwright standalone. Component-facing test authoring remains against `@solidjs/testing-library` which is portable across both harnesses.

**Rejected:** Vitest + Playwright CT standalone (two frameworks; more moving parts), Node test runner + WebdriverIO (weaker Nx integration).

## 27.4 CLI framework

**Decision:** `clipanion` + `@clack/prompts` + `picocolors` + `zod`.

**Rationale:** clipanion class-based commands model §13.9's nested subcommand hierarchy (`solidiom inspect source|manifest|explain|files|provenance`) natively, including the deprecation-warning path for legacy top-level aliases. zod-first validation matches §13.13's "policy violations fail during `plan`, before project mutation" — schemas enforce the gate mechanically. clipanion is proven at enterprise scale (Yarn Berry uses it). `@clack/prompts` provides interactive UX; `picocolors` provides colors without an ESM/CJS split. Machine-readable JSON output (§13.9, §13.14, §23 #48) flows from typed args → zod-parsed policy → JSON emitter with zero cast surface.

**Rejected:** oclif (plugin architecture invites the arbitrary-JS execution antipattern §13.12 forbids by default), citty (too young for a program of this size), commander (nested subcommands + typed args require hand-rolled routing).

## 27.5 Registry architecture

**Decision:** Static JSON catalog on a CDN + npm-hosted tarballs (hybrid). The catalog is built from tarballs by CI so drift is impossible.

**Rationale:** §13.1 makes the tarball canonical; §13.14 requires existing npm mirrors to satisfy internal-mirror needs. The static catalog gives `solidiom inspect` and `solidiom plan` fast, cacheable, signable discovery without operating a service (which would contradict "no arbitrary registry JavaScript" per §13.12). Enterprise mirroring reduces to: mirror the npm scope you already mirror + copy one JSON file to your internal CDN.

**Rejected:** pure static registry (breaks enterprise "existing npm mirrors" story of §13.14), npm-native only (cold-cache `npm search` too slow against private mirrors for good UX), HTTP registry service (adds a service to run, contradicts §3.6).

## 27.6 AST toolchain

**Decision:** `ts-morph` for structural migrations and source-mode update replay (§13.11 step 3). `@typescript-eslint/parser` (TSESTree) for the ESLint plugin (§17.4 0.7.x, 0.8.x milestones). `oxc-parser` for fast read-only paths in the CLI (`solidiom plan`, `solidiom inspect explain`). An ast-grep-style declarative authoring layer sits on top of ts-morph for the ~80% of migrations that are pattern-to-pattern rewrites.

**Rationale:** §16.6 forbids regex for identifier/import/prop/JSX transforms. §20.3 Class C ("leaked upstream contracts — Kobalte Select generics, Corvu drawer context") requires type-aware transforms that only the TypeScript Compiler API (via ts-morph) supports. TSESTree is mandatory for ESLint. oxc provides subsecond parse for scanning without full-project type resolution — essential for `solidiom plan` UX on large monorepos. Declarative pattern layer keeps migration authoring readable per §16.6 fixture-first requirement.

**Rejected:** jscodeshift (Babel AST is not TS-semantic; grafting TS on top reinvents ts-morph), raw Babel (too low-level), Solid compiler AST as primary (Solid 1 → Solid 2 primitive migrations are out of scope per §4.2).

## 27.7 Three-way merge

**Decision:** `node-diff3` for the textual merge + ts-morph for pre-merge migration replay AND post-merge AST validation + postcss for CSS validation. Atomic: write iff validation passes; else emit a patch and leave the project untouched.

**Rationale:** §13.11 step 3 ("reapply recorded transformations to both artifacts") is precisely the normalization step that makes textual three-way merge behave correctly on generated code — after both sides have been AST-normalized, textual conflicts collapse to genuine semantic conflicts developers can resolve. `node-diff3` in-process avoids requiring `git` on PATH, which matters for §13.9 `solidiom verify --no-network` and for Alpine CI containers. §13.11 step 6 ("parse and validate resulting TS/TSX/CSS") is satisfied by ts-morph + postcss; validation failure downgrades to patch, keeping the transaction atomic per §13.11 rules.

**Rejected:** git `merge-file` shell-out (adds a binary dependency), pure textual merge without AST validation (fails §13.11 step 6), semantic AST merge as the primary path (§13.11 forbids silent incorrect merges; semantic merge on TSX is research territory).

## 27.8 Signature and key distribution

**Decision:** `@sigstore/verify` embedded in `@solidiom/cli` for both Mode A (Sigstore keyless) and Mode B (explicit trusted keys, via Node `crypto.verify`). `@sigstore/sign` isolated in a separate `@solidiom/release-tools` package used exclusively by CI (never by end-user CLI).

**Rationale:** §13.12.1 requires the CLI to _verify_; it does not require the CLI to _sign_. Splitting sign into a CI-only package keeps the client binary lean, avoids shipping OIDC browser flows to developer machines, and prevents accidental developer signing. `@sigstore/verify` supports the offline bundle format (Rekor inclusion proofs travel with the artifact), directly satisfying §13.9 `solidiom verify --no-network`. Mode B via Node stdlib crypto keeps enterprise internal-mirror consumers free of extra dependencies. Both modes share one machine-readable failure-reason vocabulary per §13.12.1.

**Rejected:** cosign binary shell-out (adds a Go binary to every environment), custom implementation (never write your own signature verifier).

## 27.9 Solid 2 targeting

**Decision:** 3-beta rolling window (`{low, mid, high}`) as `peerDependencies` range with CI matrix over `{low, mid, high} × {node 20, node 22} × chromium`. pnpm catalogs enforce a single source of truth for `solid-js` and `babel-preset-solid`. Window rolls forward as Solid ships beta N+3 (deprecate N in the release notes).

**Rationale:** §19.3 says CI runs the supported beta matrix and each item records exact tested versions — a range window satisfies this literally. §13.14 enterprise mirrors update on their own cadence; a 3-beta window means an internal mirror does not have to move the day after every Solid beta. §13.5 package/source parity applies across the window, so drift is caught in CI, not in production. When Solid 2 stabilizes, this collapses to `solid-js@^2` per §19.3.

**Rejected:** single-pin tracking (§19.3 matrix would be trivially one number), two-channel `next` + `canary` (doubles the release surface for every package × 15+ packages).

## 27.10 Recipe shape and profile order

**Decision:** Every recipe is authored once in canonical source that emits both a stylesheet AND a component-shaped TSX wrapper per styling profile. Profile order: Plain-CSS and Tailwind together in Phase 1; UnoCSS in Phase 2 alongside `@solidiom/unocss-preset`.

**Rationale:** The design requires both shapes simultaneously — §14 says the primitive is styleable without any recipe (stylesheet form), §15.1 says Solidiom adopts shadcn's installable component-shaped assets (TSX form), §21 Phase 1 says plain-CSS recipes ship. Only a canonical-source single-authoring model satisfies all three without drift. §23 #32 requires CSS/Tailwind/UnoCSS to target the same DOM contract; this is only mechanically provable with two profiles running in parallel, so Phase 1 ships Plain-CSS + Tailwind together rather than the design's as-written Phase 1 = CSS-only sequence. UnoCSS's unique value is the preset (§14.6), which is genuinely Phase 2.

**Rejected:** stylesheets only (contradicts §15.1), component-shaped only (contradicts §14 headless-first + §23 #33), UnoCSS parallel with CSS/Tailwind at Phase 1 (preset is not ready that early).

## 27.11 Test doubles

**Decision:** Deterministic hand-coded test doubles (< 200 lines each) for every capability + one second production positioning adapter (minimal implementation, ~500 lines) implementing the same `PositioningCapability@1` port.

**Rationale:** §12.7 requires primitive tests not depend exclusively on one engine, and §21 Phase 3 gates on at least one test double per capability. Deterministic doubles remove real-engine non-determinism from CI (a class of §16.4 flake that would otherwise be indistinguishable from regressions) and structurally prove the port is narrow. Positioning uniquely warrants a second real adapter because it is used by every overlay (Dialog, Popover, Tooltip, Menu, Select, Combobox, Hover Card), because §13.13 `allowedAdapters` explicitly allows enterprise swap, and because §23 #70 gates stable release on adapter replacement changing no primitive API. Other capabilities' second real adapters can emerge organically post-1.0 without blocking §12.7.

**Rejected:** two real adapters per capability (speculative complexity for virtualization/table/carousel/date-math without user demand), deterministic doubles only (does not satisfy the spirit of §23 #70 for positioning specifically).

## 27.12 Documentation site

**Decision:** SolidStart + `@mdx-js/solid` + a custom Diátaxis-aware sidebar/routing convention. Playground routes embedded inside `apps/docs` (no separate `apps/playground`).

**Rationale:** SolidStart runs primitives against real Solid 2 in the real supported beta matrix — a documented behavior in the docs site is a live test, not a demo. §17.4 compile-time roadmap deliverables (0.7.x lint, 1.1 recipe extraction, 1.2 variant expansion) validate themselves against `apps/docs` continuously because it lives in the same Nx workspace with the same Vite config as the primitives. §13.15 track-based onboarding requires package-mode and source-mode side-by-side in the same site — trivial in SolidStart, awkward across Astro islands.

**Rejected:** Astro + Solid islands + Starlight (hydration boundary shape breaks nested overlays and SSR-hydrated Dialog Portals), VitePress (Vue substrate is wrong signal for a Solid-native project), React-based docs (contradicts §3.1 spirit).

**Known cost:** SolidStart on the `next` channel will occasionally break with Solid 2 betas. This is a feature — the docs site running against the same beta matrix as the primitives is early-warning for Solid ecosystem drift. Budget one platform-team afternoon per beta bump.

## 27.13 Benchmark harness

**Decision:** Playwright traces + custom probes for interaction latency and lifecycle introspection. `mitata` for microbenchmark throughput. `size-limit` for bundle topology. All wrapped in a single `@solidiom/bench` package emitting a JSON dashboard.

**Rationale:** §17.5's twelve metrics split into four families requiring four best-of-breed tools. Real-browser measurements need Playwright (already in the test stack via `@vitest/browser`); observer/listener counts require live introspection via a debug-only runtime accessor; large-collection throughput needs `mitata`'s statistical rigor (used by Bun, oxc); bundle budgets need `size-limit`. Aggregating to JSON satisfies §13.14 machine-readable requirement and drives the docs benchmark dashboard (Task 56).

**§23 #60 implication:** Phase 0 hard slices record baselines for each metric during their implementation; Phase 3 promotes those baselines (with headroom) into CI-gated budgets. The harness is built once in Phase 0 (Task 11) and grown through Phases 1–2.

**Rejected:** tinybench only (not the right tool for real-browser interaction or lifecycle introspection), Web Vitals (calibrated for whole-page loading, not primitive-level latencies).

## 27.14 Policy defaults

These are pushback-able but recorded for reference. Any of them can be revisited before implementation begins without changing the architectural decisions in §§27.1–27.13.

| Area                  | Default                                                                       | Rationale                                                                                 |
| --------------------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| License               | MIT                                                                           | Solid ecosystem norm; permissive; compatible with §13.14 enterprise adoption              |
| CI provider           | GitHub Actions                                                                | Aligns with §13.12.1 Mode A OIDC identity example (`token.actions.githubusercontent.com`) |
| Release cadence       | Changesets-per-PR; `next` channel on `main` merge; `latest` on tagged release | Matches §19.3 `next` channel model and §19 per-package versioning                         |
| SBOM format           | CycloneDX 1.5 JSON                                                            | Enterprise scanner incumbent; §13.14 requirement satisfied                                |
| Legacy sunset default | Deprecated 2 minors + removed in next major, unless facade metadata overrides | Bounded but not aggressive; can be tightened by policy per §19.2                          |
| Playground scope      | Interactive routes inside `apps/docs`; no separate `apps/playground`          | Reduces one app to maintain; every playground is a live test                              |

## 27.15 Traceability

The implementation-plan tasks reference these decisions:

| Decision               | Primary tasks                                                          |
| ---------------------- | ---------------------------------------------------------------------- |
| §27.1 Monorepo         | Task 1                                                                 |
| §27.2 Build tools      | Task 2                                                                 |
| §27.3 Testing          | Task 3                                                                 |
| §27.4 CLI              | Task 19                                                                |
| §27.5 Registry         | Task 20                                                                |
| §27.6 AST              | Tasks 21, 25, 26, 28, 41                                               |
| §27.7 Three-way merge  | Task 25                                                                |
| §27.8 Signatures       | Tasks 43, 44, 45                                                       |
| §27.9 Solid 2 matrix   | Tasks 4, 60                                                            |
| §27.10 Recipes         | Tasks 36, 37, 48                                                       |
| §27.11 Test doubles    | Tasks 10, 14, 18                                                       |
| §27.12 Docs            | Task 13 (docs playground first-use), continuous thereafter             |
| §27.13 Benchmarks      | Tasks 11, 17, 56                                                       |
| §27.14 Policy defaults | Various; called out in `solidiom-implementation-plan.md` §Locked decisions |
