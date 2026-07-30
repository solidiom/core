---
id: solid2-migration-notes
title: "Solid 2 Beta Migration Notes"
sidebar_label: Solid 2 Notes
description: Practical pitfalls and workarounds discovered while implementing against Solid 2 beta APIs.
doc_type: reference
audience: "Solidiom contributors, Solid 2 library authors"
tags: [solid2, migration, typescript, signals]
lifecycle: current
---

> **Purpose:** For Solidiom contributors, documents Solid 2 beta API differences and workarounds discovered during runtime kernel implementation.

## `createSignal` — generic value types

Solid 2 has stricter overloads for `createSignal`. The API surface differs between `@solidjs/signals` versions:

**`@solidjs/signals@0.11.x` (early pre-beta):**

```ts
export declare function createSignal<T>(
  value: Exclude<T, Function>,
  options?: SignalOptions<T>,
): Signal<T>
```

**`@solidjs/signals@2.0.0-beta.20` (current, shipped with solid-js@2.0.0-beta.21):**

```ts
export declare function createSignal<T>(
  value: Exclude<T, Function>,
  options?: SignalOptions<T>,
): Signal<T>
export declare function createSignal<T>(
  fn: ComputeFunction<T>,
  initialValue?: T,
  options?: SignalOptions<T> & MemoOptions<T>,
): Signal<T>
```

The second overload requires `Exclude<T, Function>`. When `T` is a generic parameter, TypeScript cannot prove it isn't a function, causing TS2769.

**Workaround:** Assert the initial value:

```ts
// Won't compile when T is generic:
const [value, setValue] = createSignal<T>(initialValue, { equals })

// Fix: assert past the Exclude constraint
const [value, setValue] = createSignal(initialValue as Exclude<T, Function>, { equals })
```

This is safe when your generic is constrained to data values (not callbacks). If `T` could genuinely be a function type, use the third overload (computation form) instead.

## `createUniqueId` — requires render context

In Solid 2, `createUniqueId()` calls `sharedConfig.getNextContextId()`, which requires an owner **with an assigned ID**. A bare `createRoot()` in tests does not satisfy this — it throws:

```
Error: Cannot get child id from owner without an id
```

This means `createUniqueId` only works inside an actual component render tree (server or client).

**Workaround for SSR-deterministic IDs in library code:**

Use a module-scoped monotonic counter with a reset function for SSR boundaries:

```ts
let counter = 0

export function createStableId(prefix = "solidiom"): string {
  return `${prefix}-${++counter}`
}

/** @internal — called by SSR integration to synchronize sequences. */
export function resetIdCounter(): void {
  counter = 0
}
```

This produces deterministic sequences as long as components call `createStableId` in the same tree order on server and client (which is guaranteed by Solid's render model).

## `JSX.EventHandlerUnion` — strict currentTarget typing

Solid 2's `JSX.EventHandlerUnion<Element, Event>` expects the event parameter to include `{ currentTarget: Element; target: Element }`. When composing handlers generically over `E extends Event`, TypeScript rejects the plain event:

```
TS2345: Argument of type 'E' is not assignable to parameter of type
'E & { currentTarget: HTMLElement; target: Element; }'
```

**Workaround:** Define your own handler union type for internal composition:

```ts
type EventHandler<E extends Event> =
  ((event: E) => void) | readonly [handler: (data: any, event: E) => void, data: any] | undefined
```

This avoids the JSX type constraint while still supporting Solid's bound-tuple handler form `[handler, data]`. Use `JSX.EventHandlerUnion` only at the component prop boundary where `currentTarget` is known.

## `source/` dual emission — exclude test files

The tsup `onSuccess` hook that copies `src/` → `source/` for the canonical-source distribution must skip test files. Otherwise vitest picks them up as duplicate test runs (since `packages/**/src/**` glob also matches paths containing `source/` via `**`).

**Fix in `tsup.config.base.ts`:**

```ts
if (entry.endsWith(".test.ts") || entry.endsWith(".spec.ts")) continue
```

**Fix in `vitest.config.ts`:**

```ts
exclude: ["packages/*/source/**", ...]
```

Note: use `packages/*/source/**` (not `**/source/**`) to avoid excluding legitimate paths like `packages/cli/src/source/`.

## Signal equality — `equals` option

Solid 2 signals accept `equals: false` or a custom comparator in `SignalOptions<T>`. The default is referential equality (`Object.is`). When building controllable-value abstractions, pass the user's equality option through directly:

```ts
const [internal, setInternal] = createSignal(value as Exclude<T, Function>, {
  equals: userEquals === false ? false : userEquals,
})
```

Note: when `equals: false`, the signal always notifies subscribers even if the value is identical. Use this for cases where consumers need to react to "re-set" semantics.

## Testing patterns for Solid 2 reactivity

`createRoot` works for testing signals and cleanup, but does not provide a component-like context. Key patterns:

```ts
import { createRoot, createSignal } from "solid-js"

// Wrap each test in createRoot for proper owner/cleanup tracking
it("test reactive behavior", () => {
  createRoot((dispose) => {
    const [value, setValue] = createSignal("a")
    // ... assertions ...
    dispose()
  })
})
```

For APIs that need a full render context (`createUniqueId`, `useContext` with providers), use browser-mode tests with `@vitest/browser-playwright` and `render` from `@solidjs/web`.

**Note:** `@solidjs/testing-library@0.8.x` is incompatible with Solid 2 — it imports `solid-js/web` which no longer exists. Use `@solidjs/web`'s `render()` directly in browser-mode tests instead.

## Version matrix

Current pinned versions (pnpm catalog):

| Package              | Version                                   |
| -------------------- | ----------------------------------------- |
| `solid-js`           | `^2.0.0-beta.21`                          |
| `babel-preset-solid` | `^2.0.0-beta.21`                          |
| `@solidjs/signals`   | `2.0.0-beta.20` (transitive via solid-js) |
| `vite-plugin-solid`  | `3.0.0-next.14`                           |
| `@solidjs/web`       | `2.0.0-beta.21`                           |

The 3-beta rolling window (`tools/solid-matrix.json`) tests against `{low, mid, high}` tiers. Update this document when new beta versions introduce additional API changes.

**Note:** The `@solidjs/signals` package version does not follow the `solid-js` version. `solid-js@2.0.0-beta.21` bundles `@solidjs/signals@2.0.0-beta.20`. The earlier `@solidjs/signals@0.11.x` was a pre-beta release with different API surfaces (e.g., `pureWrite` instead of `ownedWrite`).

## `JSX` type — import from `@solidjs/web`, not `solid-js`

In Solid 2, the `JSX` namespace lives in `@solidjs/web`, not `solid-js`. Importing `type JSX` from `solid-js` produces:

```
TS2305: Module '"solid-js"' has no exported member 'JSX'.
```

**Correct pattern:**

```tsx
// Runtime values (signals, Show, For, createSignal, etc.) — from solid-js:
import { createSignal, Show, type Accessor } from "solid-js"

// JSX types — from @solidjs/web:
import { type JSX } from "@solidjs/web"
```

This split is intentional: `solid-js` is the reactive core (framework-agnostic), `@solidjs/web` is the DOM renderer that defines JSX element types.

**Common mistake:** older primitives that imported everything from `solid-js` appeared to typecheck because the JSX import error masked deeper type issues. Once the import is fixed, previously-hidden errors (aria-disabled typing, noUncheckedIndexedAccess) surface.

**Enforcement:** the compiler, not a lint rule. Because `solid-js` genuinely has no `JSX` export in Solid 2, importing it fails typecheck with TS2305 — so `pnpm typecheck` is the gate, and no primitive currently violates it. There is **no** `no-jsx-from-solid-js` ESLint rule; `packages/eslint-plugin-solidiom/src/rules/` ships `no-adapter-import-of-recipes`, `no-adapter-jsx-attributes`, `no-cross-layer-import`, `no-engine-import-outside-adapters`, `no-forbidden-primitive-props`, `require-accessible-name`, and `require-primitive-parts` only. All 27 primitives were fixed in the normalization pass (2026-07-22); the fix was verified by typecheck.

## `DisclosureReason` — exact string literals required

The `DisclosureReason` type is a union of specific string literals:

```ts
type DisclosureReason =
  "trigger" | "close" | "escape-key" | "pointer-outside" | "focus-outside" | "programmatic"
```

Common mistake: using `"escape"` instead of `"escape-key"`. The error surfaces as:

```
TS2345: Argument of type 'ChangeDetails<"escape">' is not assignable
to parameter of type 'ChangeDetails<DisclosureReason>'.
```

**Fix:** Use the exact literal from the union — `"escape-key"`, not `"escape"`.

## Extending `CollectionItem` for primitive-specific behavior

The base `CollectionItem` interface (from `@solidiom/runtime`) is intentionally minimal:

```ts
interface CollectionItem {
  id: string
  ref?: Element
  disabled: Accessor<boolean>
  textValue: Accessor<string>
}
```

Primitives that need additional item behavior (e.g., menu items with an `activate` callback) should define a local extended interface rather than modifying the runtime type:

```ts
// In packages/menu/src/menu.tsx:
interface MenuCollectionItem extends CollectionItem {
  activate?: () => void
}

// Use the extended type for item literals:
const item: MenuCollectionItem = {
  id: itemId,
  disabled: () => props.disabled ?? false,
  textValue: () => props.textValue ?? "",
  activate: () => props.onSelect?.(),
}

// Cast when reading from the generic collection:
const item = collection.getItem(itemId) as MenuCollectionItem | undefined
item?.activate?.()
```

This keeps the runtime collection API generic while allowing type-safe primitive-specific extensions.

## `noUncheckedIndexedAccess` — array access patterns

The tsconfig enables `noUncheckedIndexedAccess: true`, meaning `array[index]` returns `T | undefined`. Standard patterns:

```ts
// Guarded by length check — use non-null assertion:
const items = collection.enabledItems()
if (items.length > 0) {
  rovingFocus.setActiveId(items[0]!.id) // safe: length > 0
  rovingFocus.setActiveId(items[items.length - 1]!.id) // safe: length > 0
}

// Loop-bounded index — use non-null assertion:
for (let i = 0; i < values.length; i++) {
  const v = values[i]! // safe: i < length
}

// Fallback value — use nullish coalescing:
const val = values[index] ?? values[0]! // values always has ≥1 element
```

Only use `!` when a prior condition guarantees the value exists. If the guarantee isn't obvious, add a comment explaining why.

## `Context.Provider` removed — context IS the provider

In Solid 2, `createContext()` returns a component that is itself the provider. There is no `.Provider` property:

```tsx
// Solid 1:
<MyContext.Provider value={val}>{children}</MyContext.Provider>

// Solid 2:
<MyContext value={val}>{children}</MyContext>
```

The `Context<T>` type extends `ContextProviderComponent<T>` directly.

## `onMount` replaced by `onSettled`

Solid 2 removes `onMount`. Use `onSettled` for code that should run after the component is mounted and the DOM is stable:

```ts
// Solid 1:
import { onMount } from "solid-js"
onMount(() => {
  /* browser-only setup */
})

// Solid 2:
import { onSettled } from "solid-js"
onSettled(() => {
  /* runs after mount/settlement */
})
```

### Progressive enhancement — retain the static fallback until settlement

For a progressively enhanced island, do not hide server-rendered links or other fallback content while the island initializes. Instead, set the island's ready state from `onSettled` and use it to hide the fallback only after the client component has settled:

```tsx
let root: HTMLElement | undefined

onSettled(() => {
  root?.setAttribute("data-ready", "true")
  document.getElementById("primitive-directory-fallback")?.setAttribute("hidden", "")
})

return <section ref={(element) => (root = element)}>{/* enhanced controls */}</section>
```

This keeps the static catalog usable when JavaScript is unavailable or hydration fails. `onSettled` runs once, so it is appropriate for hydration readiness, not for work that must re-run when a signal or `<Show>` branch changes.

## `splitProps` removed — use `omit`

Solid 2 replaces `splitProps` with `omit`. Do not destructure props (breaks reactivity):

```ts
import { omit } from "solid-js"

// Solid 1:
const [local, rest] = splitProps(props, ["class", "style"])

// Solid 2:
const rest = omit(props, "class", "style")
// Access local props directly via props.class, props.style
```

Prefer accessing props directly via `props.x` in render expressions to preserve reactivity. `omit` returns a proxy that excludes the named keys — use it for forwarding remaining props to a child element.

## `solid-js/web` subpath removed — use `@solidjs/web`

The `solid-js/web` subpath export no longer exists in Solid 2. The DOM renderer is now the separate package `@solidjs/web`:

```ts
// Solid 1:
import { Portal, Dynamic, isServer } from "solid-js/web"

// Solid 2:
import { type JSX } from "@solidjs/web" // JSX types
import { render } from "@solidjs/web" // render function
import { Show } from "solid-js" // control flow stays in solid-js
```

- `Show`, `For`, `Switch`, `Match`: available from `"solid-js"` directly
- `render`, `hydrate`: from `"@solidjs/web"`
- `type JSX`: from `"@solidjs/web"`
- `isServer`: use `typeof document === "undefined"` instead
- `Portal`: use the runtime's `createPortal` helper or render to a target element directly

## `aria-expanded` typing

Solid 2's JSX types for ARIA boolean attributes (`aria-expanded`, `aria-disabled`, `aria-hidden`, `aria-selected`) use `EnumeratedPseudoBoolean | RemoveAttribute` instead of `boolean`. Pass string `"true"` or `undefined` (not boolean `true`/`false`):

```tsx
// Wrong — yields `true | undefined` which TS rejects:
aria-expanded={isOpen()}
aria-disabled={isDisabled() || undefined}
aria-hidden={!isActive() || undefined}
aria-selected={isSelected() || undefined}

// Correct — string "true" or absence:
aria-expanded={isOpen() ? "true" : undefined}
aria-disabled={isDisabled() ? "true" : undefined}
aria-hidden={!isActive() ? "true" : undefined}
aria-selected={isSelected() ? "true" : undefined}
```

This matches the HTML spec (ARIA attributes are DOMString, not boolean). The pattern `boolExpr || undefined` no longer works because it produces `true | undefined`, which doesn't satisfy `"true" | "false" | undefined`.

**Affected Solidiom primitives (fixed):** calendar, carousel, slider. Any new primitive with aria-boolean attributes must use the ternary string form.

## `REACTIVE_WRITE_IN_OWNED_SCOPE` — `ownedWrite` option

In `@solidjs/signals@2.0.0-beta.20` (shipped with `solid-js@2.0.0-beta.21`), writing to a signal inside an owned scope (component body, computation) throws a hard error in dev mode:

```
[REACTIVE_WRITE_IN_OWNED_SCOPE] Writing to reactive state inside an owned scope
(component, computation) is not allowed.
```

This catches accidental writes during render, but breaks legitimate patterns like collection item registration (where a child component registers itself with a parent's signal during init).

**Fix:** Add `ownedWrite: true` to the signal options:

```ts
const [items, setItems] = createSignal<CollectionItem[]>([], { ownedWrite: true })
```

**Important:** The option name changed between `@solidjs/signals` versions:

- `@solidjs/signals@0.11.x` (pre-beta): `pureWrite: true`
- `@solidjs/signals@2.0.0-beta.20` (current): `ownedWrite: true`

The error message text says "set the `ownedWrite` option" — use that name. The `SignalOptions<T>` interface in the current version:

```ts
interface SignalOptions<T> {
  name?: string
  equals?: false | ((prev: T, next: T) => boolean)
  ownedWrite?: boolean // suppresses owned-scope write errors
  unobserved?: () => void
}
```

Use `ownedWrite` only when the write is intentional and correct (e.g., item registration during mount, collection management). Do not suppress this error for accidental writes during render.

## `STRICT_READ_UNTRACKED` — reading signals in component body

Solid 2 beta.21 warns when a reactive value is read directly in a component body (owned scope) without a tracking context:

```
[STRICT_READ_UNTRACKED] Reactive value read directly in <Root> will not update.
Move it into a tracking scope (JSX, a memo, or an effect's compute function).
```

This fires when signal accessors are called during initialization for one-time setup (e.g., reading initial state for a state machine).

**Fix:** Wrap one-time initialization reads with `untrack`:

```ts
import { createSignal, untrack } from "solid-js"

// Wrong — triggers STRICT_READ_UNTRACKED:
const initialValue = open()

// Correct — explicitly untracked since this is a one-time read:
const initialValue = untrack(open)
```

`untrack` communicates intent: "I know this read won't be reactive and that's deliberate." Use it for:

- Computing initial values from props/signals during setup
- Reading state to determine initial phase/mode
- Any read that should capture a snapshot without subscribing

Do NOT use `untrack` to silence the warning when you actually need reactive updates — move the read into a memo or effect instead.

## `source/` directory — build artifact, not source of truth

The `source/` directory is **gitignored** and regenerated by tsup's `onSuccess` hook (`src/` → `source/`). It exists for the `"solid"` export condition (allowing Vite/bundlers to compile from raw source in dev mode).

**Key facts:**

- `source/` is listed in `.gitignore` — never commit it
- It's regenerated on every `pnpm build` for that package
- The `"solid"` export condition in `package.json` points to `source/index.tsx`
- In dev mode, Vite resolves `"solid"` first, so `source/` is what runs in the docs app
- After changing `src/` locally, rebuild the package (`pnpm --filter @solidiom/<name> build`) to update `source/`

**Do NOT manually edit `source/` files.** All work happens in `src/`. The audit script and registry-build both scan `source/` for the published artifact shape, but that's reading build output, not source of truth.

**Exception:** `packages/cli/src/source/` is a legitimate code directory (contains source-install templates). The `.gitignore` exempts it with `!packages/cli/src/source/`.

## `vite-plugin-solid` — version compatibility with Solid 2

**`vite-plugin-solid@2.11.x` (INCOMPATIBLE):**

Has hardcoded references to `solid-js/web` (which no longer exists in Solid 2):

```js
// Inside vite-plugin-solid@2.11.x, line 74:
const nestedDeps = replaceDev ? ['solid-js', 'solid-js/web', 'solid-js/store', ...] : [];
```

Workarounds were required: `dev: false`, `hot: false`, manual resolve conditions, `solid-js/web` aliases.

**`vite-plugin-solid@3.0.0-next.14` (CURRENT — use this):**

Targets `solid-js@2.0.0-beta.21` and `@solidjs/web` natively. No workarounds needed:

```ts
import solidPlugin from "vite-plugin-solid"

export default defineConfig({
  plugins: [solidPlugin()],
})
```

Changes in v3:

- Resolves `@solidjs/web` instead of `solid-js/web`
- HMR (`@solid-refresh`) compatible with Solid 2 component model
- Adds turnkey SSR support (opt-in via `ssr: {}`, requires Vite 6+)
- Uses `@dom-expressions/compiler@0.50.0-next.24`

Install: `pnpm add -Dw vite-plugin-solid@3.0.0-next.14`

No `moduleName` override, no aliases, no `optimizeDeps.exclude` for old subpaths. The simplified vite config for an app:

```ts
import solid from "vite-plugin-solid"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [solid()],
})
```

## `@vitest/browser-playwright` — Vitest 4 breaking change

Vitest 4 changed the `browser.provider` config to require a factory function instead of a string:

```ts
// Vitest 3 (old):
browser: {
  provider: "playwright"
}

// Vitest 4 (current):
import { playwright } from "@vitest/browser-playwright"
browser: {
  provider: playwright()
}
```

Install `@vitest/browser-playwright` separately — it's not bundled with `@vitest/browser`.

## Vitest workspace vs single config

With Vitest 4 workspaces, files that don't match any workspace project's `include` pattern get picked up by an implicit "root" project. This means browser test files (`.browser.test.tsx`) will fail in the node runner even if they don't match the `*.ts` include pattern.

**Solution:** Use separate config files instead of a workspace:

- `vitest.config.ts` — default node-mode unit tests (`npx vitest run`)
- `vitest.browser.config.ts` — browser component tests (`npx vitest run --config vitest.browser.config.ts`)

This avoids workspace file-collection edge cases and gives explicit control over each test environment.

## Console error assertions — catching Solid 2 reactivity crashes in CI

Solid 2's strict reactivity checks (`REACTIVE_WRITE_IN_OWNED_SCOPE`, `REACTIVITY_HALTED`, `STRICT_READ_UNTRACKED`) only manifest as console errors/warnings in the browser. Neither Vitest nor Playwright will fail tests on console output by default.

**For browser-mode Vitest tests:**

```ts
import { createConsoleGuard } from "@solidiom/runtime/testing/console-guard"

let guard: ConsoleGuard
beforeEach(() => { guard = createConsoleGuard() })
afterEach(() => { guard.restore() })

it("renders without reactivity errors", () => {
  render(() => <MyComponent />)
  guard.assertClean()  // fails on any error/warning
})
```

**For Playwright E2E tests:**

```ts
import { createConsoleCollector } from "./utils/console-assertions"

test("page loads clean", async ({ page }) => {
  const console = createConsoleCollector(page)
  await page.goto("/some-route")
  console.assertClean() // fails on errors or reactivity warnings
})
```

Both utilities provide granular assertions: `assertNoErrors()`, `assertNoReactivityErrors()`, `assertNoUntrackedWarnings()`, `assertClean()` (all of the above).

## `CLEANUP_IN_FORBIDDEN_SCOPE` — `onCleanup` forbidden inside `onSettled`

Solid 2 forbids calling `onCleanup()` inside `onSettled` (and `createTrackedEffect`). The error:

```
[CLEANUP_IN_FORBIDDEN_SCOPE] Cannot use onCleanup inside createTrackedEffect
or onSettled; return a cleanup function instead
```

In Solid 1, `onMount` + `onCleanup` was the standard pattern for setup/teardown. In Solid 2, `onSettled` replaces `onMount` but has different cleanup semantics — you **return** the cleanup function instead of calling `onCleanup`.

**Before (Solid 1 / broken in Solid 2):**

```ts
import { onSettled, onCleanup } from "solid-js"

onSettled(() => {
  const observer = new ResizeObserver(callback)
  observer.observe(element)
  onCleanup(() => observer.disconnect()) // THROWS in Solid 2
})
```

**After (Solid 2 — return the cleanup):**

```ts
import { onSettled } from "solid-js"

onSettled(() => {
  const observer = new ResizeObserver(callback)
  observer.observe(element)
  return () => observer.disconnect() // Correct — returned cleanup
})
```

**Key rules:**

- `onSettled` callbacks must return their cleanup function (or return nothing/undefined for no cleanup)
- `onCleanup` still works in component scope (outside `onSettled`/`createTrackedEffect`) — use it for item registration cleanup, timer cleanup, etc.
- If `onSettled` has an early return (guard clause), cleanup is skipped for that path — no need to return a no-op function

**Scope of impact:** This affects every component that used the `onSettled` + `onCleanup` combo for overlay setup (layers, focus trapping, scroll lock, positioning, observers). In Solidiom, this pattern appeared in: dialog, popover, tooltip, combobox, command-palette, date-picker, drawer, menu, select, virtual-list.

## `REACTIVE_WRITE_IN_OWNED_SCOPE` — additional affected patterns

Beyond collection item registration (documented above), two other patterns trigger this error:

**1. Controllable value internal signal:**

`createControllableValue` creates an internal signal for uncontrolled mode. When `requestChange()` is called from a click handler inside a component (owned scope), the `setInternal()` write triggers the error.

```ts
// Fix: add ownedWrite to the internal signal
const [internal, setInternal] = createSignal(resolvedDefault as Exclude<T, Function>, {
  equals: equalsFn === false ? false : equalsFn,
  ownedWrite: true, // writes happen from event handlers inside components
})
```

**2. Presence phase signal with inline state machine:**

`createPresence` uses a `trackedPhase` accessor that reads `open()` and conditionally calls `setPhase()`. When this accessor is read inside a component's JSX (tracking scope inside owned scope), the write triggers the error.

```ts
// Fix: add ownedWrite to the phase signal
const [phase, setPhase] = createSignal<PresencePhase>(initialPhase, { ownedWrite: true })
```

**General principle:** Any signal that gets written to as a side effect of being _read_ in a component context (state machines, lazy initialization, derived-with-write patterns) needs `ownedWrite: true`. Signals that are only written from explicit user actions (click handlers called directly, not from within a reactive derivation) also need it because the handler executes in the component's owned scope.

## `null` vs `undefined` in signal return types

Solid 2's strict typing distinguishes `null` from `undefined`. When a signal returns `string | null` but a function expects `string | undefined`, TypeScript rejects it:

```
TS2345: Argument of type 'string | null' is not assignable
to parameter of type 'string | undefined'.
```

**Fix:** Coerce with nullish coalescing:

```ts
// highlightedId() returns string | null
// resolveNextItem expects string | undefined
const next = resolveNextItem(items, ctx.highlightedId() ?? undefined, intent)
```

This is a general Solid 2 pattern: prefer `undefined` over `null` for "no value" signals. If you control the signal, initialize with `undefined` rather than `null`. If consuming a signal that uses `null`, coerce at the boundary.

## Headless component styling — `data-state` propagation to child parts

Headless primitives use `data-state` attributes (via `applySemanticAttrs`) for CSS-driven state styling. For this to work, **every visually distinct part must carry its own `data-state` attribute** — CSS `data-[state=on]:` selectors only match the element itself, not its ancestors.

**Problem:** If only the Root element has `data-state`, child parts (like a Switch thumb) can't be styled with `data-[state=on]:translate-x-5` because the attribute isn't on the thumb element.

**Fix:** Use context to propagate state down, and apply `data-state` on each part:

```tsx
import { createContext, useContext } from "solid-js"

const SwitchContext = createContext<{ checked: Accessor<boolean> }>()

export function Root(props: SwitchRootProps) {
  // ... state setup ...
  return (
    <SwitchContext value={{ checked }}>
      <button
        data-state={checked() ? "on" : "off"} // Root has state
        class={props.class}
        {...rest}
      >
        {props.children}
      </button>
    </SwitchContext>
  )
}

export function Thumb(props: SwitchThumbProps) {
  const ctx = useContext(SwitchContext)
  return (
    <span
      data-state={ctx?.checked() ? "on" : "off"} // Thumb ALSO has state
      class={props.class}
    >
      {props.children}
    </span>
  )
}
```

**Usage with Tailwind `data-[state=...]` variants:**

```tsx
<Switch.Root class="... data-[state=on]:bg-[hsl(var(--primary))]">
  <Switch.Thumb class="... data-[state=on]:translate-x-5" />
</Switch.Root>
```

**Design rules for headless primitives:**

- Every part that needs visual state differentiation must expose `data-state` (and/or `data-disabled`, `data-highlighted`, etc.)
- Always accept `class` and `style` props on all parts — headless components without styling hooks are unusable
- Use context (not prop drilling) to share state between Root and child parts
- Tailwind v4's `data-[...]` variant works out of the box — no plugin config needed

## `STRICT_READ_UNTRACKED` — indirect reads through utility functions

The warning fires not only for direct signal reads (`const x = signal()`) but also when calling utility functions that internally read reactive state. This is non-obvious because the caller doesn't see the read.

**Example:** `createControllableValue`'s `requestChange` function reads `value()` internally for equality comparison. Calling `requestChange(...)` inside a panel registration function (owned scope) triggers the warning at the `value()` read site inside `controllable-value.ts`, not at the call site.

**Fix:** Wrap the entire call with `untrack` when the intent is one-time initialization:

```ts
// registerPanel runs in owned scope (called from child component body)
const registerPanel = (entry: PanelEntry): (() => void) => {
  setPanels((prev) => [...prev, entry].sort((a, b) => a.order - b.order))

  // All reads here are one-time snapshots — wrap with untrack
  const currentSizes = untrack(sizes)
  if (entry.constraints.defaultSize !== undefined) {
    const panelList = [...untrack(panels), entry].sort((a, b) => a.order - b.order)
    const idx = panelList.findIndex((p) => p.id === entry.id)
    if (idx >= 0 && (currentSizes.length <= idx || currentSizes[idx] === undefined)) {
      const updated = [...currentSizes]
      while (updated.length <= idx) updated.push(0)
      updated[idx] = entry.constraints.defaultSize
      // requestChange internally reads value() — wrap to prevent warning
      untrack(() => requestSizeChange(updated, createChangeDetails("programmatic")))
    }
  }

  return () => setPanels((prev) => prev.filter((p) => p.id !== entry.id))
}
```

**Rule of thumb:** If a function you call internally reads signals and you're calling it in an owned scope for one-time setup, wrap the call with `untrack(() => ...)`.

## `REACTIVITY_HALTED` — cascading crash from unhandled writes

When `REACTIVE_WRITE_IN_OWNED_SCOPE` throws and no error boundary catches it, Solid 2 follows up with:

```
[REACTIVITY_HALTED] An uncaught error halted the reactive system.
No further updates will be processed.
```

This freezes the entire page — no signals update, no UI responds to interaction. The component tree remains rendered but is completely inert.

**Implications:**

- Missing `ownedWrite: true` is not a warning-level issue — it's a hard crash in dev mode
- Always test components that use collection registration or inline state machines before shipping
- Consider wrapping subtrees in `<Errored>` boundaries during development to isolate crashes
- The console guard utilities (`assertNoReactivityErrors()`) catch this in CI before it reaches users

**Recovery:** There is no recovery from `REACTIVITY_HALTED` without a page reload. Fix the root cause (`ownedWrite: true` on the offending signal) rather than trying to handle the error at runtime.

## Headless part props — `class` and `style` are mandatory

Every headless component part that renders a DOM element **must** accept `class` and `style` props. Without them, consumers wrap parts in extra elements to attach styling, creating invalid HTML (nested `<button>`, `<a>` inside `<a>`, etc.) and broken accessibility.

**Bad — forces nested buttons:**

```tsx
// Component renders its own <button>:
export function Trigger(props: { children: JSX.Element }) {
  return <button ...>{props.children}</button>
}

// Consumer wraps in another button to add classes:
<Trigger>
  <button class="my-styles">Open</button>  {/* INVALID: <button><button> */}
</Trigger>
```

**Good — accepts class directly:**

```tsx
export interface TriggerProps {
  children: JSX.Element
  class?: string
  style?: JSX.CSSProperties | string
  ref?: (el: HTMLButtonElement) => void
}

export function Trigger(props: TriggerProps) {
  return (
    <button class={props.class} style={props.style} ...>
      {props.children}
    </button>
  )
}

// Consumer styles directly:
<Trigger class="my-styles">Open</Trigger>
```

**Checklist for every headless part:**

- [ ] Accepts `class?: string`
- [ ] Accepts `style?: JSX.CSSProperties | string`
- [ ] Accepts `ref?` with the correct element type
- [ ] Forwards these to the rendered DOM element

Parts affected in Solidiom (fixed): `Popover.Trigger`, `Popover.Close`, `CommandPalette.Root`. Audit all other trigger/close/action parts for the same issue.

## `defaultOpen` for inline/always-visible modal components

Components that use `createPresence({ open })` with `<Show when={presence.present()}>` will render nothing when `open` defaults to `false`. This is correct for modal usage (dialog, command palette as overlay) but breaks inline demos or embedded usage where the component should be visible immediately.

**Fix for demos:** Pass `defaultOpen={true}` when the component is used inline:

```tsx
// Modal usage (default — opens on trigger):
<Command.Root>...</Command.Root>

// Inline/embedded usage (always visible):
<Command.Root defaultOpen={true}>...</Command.Root>
```

**Design consideration:** If a component has a legitimate inline mode (e.g., command palette embedded in a sidebar), consider whether the presence/open gating should be optional, or whether a separate `Inline` variant is warranted.

---

## Lessons Learned — Sprint 1–4 Implementation (2026-07-22)

The following patterns and pitfalls were discovered during the primitives improvement plan execution (25 new primitives, 5 enhanced).

## `isLoading` → `loading` — prop naming convention

Solid 2 primitives should use bare boolean prop names (`disabled`, `pressed`, `open`, `loading`) without an `is-` prefix. The `is-` prefix is a React convention that leaked into early Solidiom code.

**Rule:** Prop names should match their emitted `data-*` attribute names. Since `applySemanticAttrs` emits `data-loading` (not `data-is-loading`), the prop must be `loading`.

**Affected primitives:** Button (renamed in Sprint 1). All new primitives (Switch, Select, Combobox) adopt `loading` from the start.

**Migration pattern:**

```tsx
// Before:
interface ButtonProps {
  isLoading?: boolean
}
;<Button.Root isLoading>...</Button.Root>

// After:
interface ButtonProps {
  loading?: boolean
}
;<Button.Root loading>...</Button.Root>
```

## `asChild` is a React idiom — use class helpers instead

`asChild` relies on `React.cloneElement` to merge props into an arbitrary child element. Solid has no `cloneElement`. Do not add `asChild` to any primitive.

**Instead, Solidiom uses two composition strategies:**

1. **Class helpers** (simple cases): Export `buttonVariants()` from recipe packages. Consumers apply it to any element:

   ```tsx
   import { buttonVariants } from "@solidiom/recipes-tailwind"
   import { applySemanticAttrs } from "@solidiom/runtime"

   ;<A
     href="/home"
     class={buttonVariants({ variant: "outline" })}
     {...applySemanticAttrs({ scope: "button", part: "root" })}
   >
     Home
   </A>
   ```

2. **Render callback** (complex cases where state wiring is needed): The primitive passes props to the consumer's element:

   ```tsx
   <Field.Control>{(controlProps) => <input {...controlProps()} class="my-input" />}</Field.Control>
   ```

## `createFormControl` — ARIA relationship pattern

The `createFormControl` utility from `@solidiom/runtime` generates coordinated IDs and ARIA props for form field composition. Key pattern for new form primitives:

```tsx
const formControl = createFormControl({
  id: props.id,
  disabled: () => props.disabled ?? false,
  required: () => props.required ?? false,
  readOnly: () => props.readOnly ?? false,
  invalid: () => props.invalid ?? false,
})

// Spread on the label:
<label {...formControl.labelProps()}>

// Spread on the control:
<input {...formControl.controlProps()} />

// Use the generated IDs for description/error:
<span id={formControl.descriptionId}>Help text</span>
<span id={formControl.errorId}>Error message</span>
```

The `controlProps()` accessor returns `aria-labelledby`, `aria-describedby`, `aria-invalid`, `aria-required`, `aria-disabled` — switching `aria-describedby` between `descriptionId` and `errorId` based on the invalid state.

## `createControllableValue` — generic type workaround for arrays

When `T` is `string[]` (e.g., ToggleGroup, CheckboxGroup), the `equals` option needs a custom comparator since the default `Object.is` compares references:

```tsx
const { value, requestChange } = createControllableValue<string[], "toggle">({
  value: props.value,
  defaultValue: props.defaultValue ?? [],
  onChange: (next) => props.onValueChange?.(next),
  equals: (a, b) => a.length === b.length && a.every((v, i) => v === b[i]),
})
```

Without the custom `equals`, every `requestChange` triggers subscribers even when the array content hasn't changed (new reference, same values).

## Context IS the provider — Solid 2 pattern for RadioGroup/CheckboxGroup

Solid 2 removes `.Provider`. When creating group contexts for RadioGroup, CheckboxGroup, ToggleGroup, etc., the context itself is the JSX element:

```tsx
const RadioGroupContext = createContext<RadioGroupContextValue>()

// Provider usage (context IS the provider):
<RadioGroupContext value={{ value, setValue, disabled, orientation }}>
  <div role="radiogroup">{props.children}</div>
</RadioGroupContext>

// Consumer:
const ctx = useContext(RadioGroupContext)
```

**Important:** The `createContext<T>()` call without a default value means `useContext` returns `T | undefined`. Always guard with a throw:

```tsx
function useRadioGroup(): RadioGroupContextValue {
  const ctx = useContext(RadioGroupContext)
  if (!ctx) throw new Error("[solidiom] RadioGroup.Item must be used within <RadioGroup.Root>")
  return ctx
}
```

## Roving tabindex — only selected item is tabbable

For RadioGroup, ToggleGroup, and other single-selection collections, implement roving tabindex so only the active item has `tabindex={0}`:

```tsx
const tabIndex = () => {
  if (isDisabled()) return -1
  if (isSelected()) return 0
  if (!ctx.value()) return 0 // First item tabbable when nothing selected
  return -1
}
```

Arrow keys move focus AND select. This matches WAI-ARIA radiogroup pattern.

## `role="alertdialog"` — no dismiss on outside click or Escape

Alert dialogs (confirmation modals) differ from regular dialogs:

- Do NOT set up a dismissable layer (no pointer-outside dismiss)
- Do NOT dismiss on Escape
- Only the Cancel and Action buttons close the dialog
- Still use focus trapping, modal isolation, and scroll lock

This is per WAI-ARIA spec: alertdialog requires explicit user acknowledgment.

## `data-side` attribute for positioned overlays

Sheet and Drawer primitives emit `data-side="left|right|top|bottom"` on their content element. This enables CSS-driven slide animations without JS:

```css
[data-scope="sheet"][data-part="content"][data-side="right"] {
  transform: translateX(100%);
}
[data-scope="sheet"][data-part="content"][data-side="right"][data-state="open"] {
  transform: translateX(0);
}
```

Always prefer data attributes over inline styles for state-driven positioning — it keeps the primitive headless.

## `createPresence` must be imported in overlay primitives

The audit tool (`tools/audit-primitives.ts`) checks `hasPresenceExport` for overlay primitives by grepping for `createPresence` in their source. Even if the primitive delegates presence to a parent (Dialog → Sheet reuse), the import must be present in the primitive's own source files for the audit to pass.

If the primitive manages its own open/close lifecycle (Dialog, Sheet, Drawer, Popover, Tooltip, Menu, Accordion, Collapsible), it should use `createPresence` directly. If it's a thin wrapper, at minimum import it and reference it in a comment or type annotation.

## HoverCard — hover intent with dual timers

The HoverCard primitive uses two separate timers (open delay and close delay) to prevent accidental activations:

```tsx
const [open, setOpen] = createSignal(false)
let openTimer: number | undefined
let closeTimer: number | undefined

const onTriggerEnter = () => {
  clearTimeout(closeTimer)
  openTimer = window.setTimeout(() => setOpen(true), openDelay)
}

const onTriggerLeave = () => {
  clearTimeout(openTimer)
  closeTimer = window.setTimeout(() => setOpen(false), closeDelay)
}

// Content hover cancels close timer (keeps card open while mousing over it):
const onContentEnter = () => clearTimeout(closeTimer)
const onContentLeave = () => {
  closeTimer = window.setTimeout(() => setOpen(false), closeDelay)
}
```

The content's pointer events must also participate in the timer dance — otherwise the card closes when the user moves from trigger to content.

**Positioning caveat (see `onSettled` does not re-fire on `<Show>` toggle below):** the dual-timer pattern above only covers open/close timing. HoverCard's `Content` also needs trigger-relative positioning (via a `PositioningPort`, same shape as `tooltip`/`popover`) so opening it doesn't shift surrounding layout. Do not wire that positioning call with `onSettled` — see the dedicated section below for why that silently never fires.

## `vitest.config.ts` — include pattern for sub-package test runs

When running `pnpm --filter @solidiom/<pkg> test`, vitest resolves the root config but runs from the package's CWD. The include pattern `packages/**/src/**/*.{test,spec}.ts` doesn't match from within a sub-package because there's no `packages/` subdirectory relative to CWD.

**Fix:** Add a relative pattern alongside the absolute one:

```ts
include: [
  "packages/**/src/**/*.{test,spec}.ts",  // From root CWD
  "src/**/*.{test,spec}.ts",              // From sub-package CWD
],
```

This ensures tests run correctly both from root (`pnpm test`) and per-package (`pnpm --filter @solidiom/dialog test`).

## `source/` directory for primitives with existing `asChild` code

During the `isLoading` → `loading` rename, we discovered the `source/` directory in older primitives contained stale code (e.g., Button's `source/index.tsx` still had `asChild` logic after it was removed from `src/index.tsx`).

**Key insight:** `source/` is a build artifact regenerated by tsup's `onSuccess` hook. However, it's gitignored in newer packages but was committed in earlier ones. When making breaking changes:

1. Update `src/` (the source of truth)
2. If `source/` is tracked in git, update it too for consistency
3. For new packages, never commit `source/` — let the build generate it

## Menu sub-menus — ArrowRight opens, ArrowLeft closes

Sub-menu keyboard navigation follows a specific directional pattern:

- **ArrowRight** on a SubTrigger opens the sub-content
- **ArrowLeft** inside SubContent closes it and returns focus to the parent
- **Escape** inside SubContent closes only the sub-menu (stopPropagation prevents closing the parent)

```tsx
// In SubContent:
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === "ArrowLeft" || e.key === "Escape") {
    e.preventDefault()
    e.stopPropagation() // Don't close parent menu
    subCtx?.setOpen(false)
  }
}
```

The `stopPropagation` is critical — without it, Escape would bubble up and close the entire menu stack.

## Acceptance criteria evidence artifacts — manual checks

The acceptance criteria script (`tools/acceptance-criteria.ts`) has two types of checks:

1. **Automated** — file existence, content grep, test execution
2. **Manual** — presence of an evidence artifact file at a specific path

Manual checks look for files like `docs/ssr-hydration-test-results.md`. The file's existence is the assertion — the script doesn't parse its content. These files serve as attestation that the check was performed, with the results documented inside.

When adding new acceptance criteria, prefer automated checks (grep, test execution) over manual ones. Manual checks should only be used for genuinely manual processes (AT testing, visual inspection).

---

## Lessons Learned — HoverCard Positioning Fix (2026-07-28)

Discovered while adding trigger-relative positioning to `@solidiom/hover-card` (previously had no positioning at all — `Content` rendered in normal flow, shifting layout on open).

## `onSettled` does NOT re-fire when `<Show>` toggles — silent no-op bug

`onSettled` (Solid 2's replacement for `onMount`) runs once, at the point where the enclosing component function's initial render settles. It does **not** re-run every time a `<Show when={...}>` inside that same component later flips from `false` to `true`. `<Show>`'s children execute in their own nested reactive scope — toggling `when` does not re-invoke the parent component function, so `onSettled` registered in that parent scope only ever sees the DOM state from the very first render.

This is a trap specifically for the common overlay pattern:

```tsx
// BROKEN — looks correct, but positioning.update() never runs on open:
export function Content(props: ContentProps) {
  const ctx = useContext()
  let contentEl: HTMLDivElement | undefined

  onSettled(() => {
    if (!contentEl) return // <-- always true on first run, when Show is closed
    const result = ctx.positioning.update(ctx.triggerRef()!, contentEl)
    return typeof result === "function" ? result : undefined
  })

  return (
    <Show when={ctx.open()}>
      <div ref={(el) => (contentEl = el)}>{props.children}</div>
    </Show>
  )
}
```

On first render, `ctx.open()` is `false`, so `<Show>` renders nothing, `contentEl` stays `undefined`, and `onSettled`'s guard clause bails out. When `open()` later becomes `true` and the `<div>` actually mounts, `onSettled` has already run and will never run again for this component instance — the positioning call silently never happens.

**This pattern was already present, unfixed, in `tooltip.tsx` and `popover.tsx`** (`Content` uses the exact same `onSettled` + `let contentEl` shape to wire `positioning.update`). Neither package's test suite exercises this path (no test asserts the positioning port is actually called), so the bug shipped silently. **All affected primitives have now been fixed** (2026-07-28): hover-card, tooltip, popover, combobox, context-menu, menu, select, date-picker, command-palette, sheet, alert-dialog. Dialog and drawer were already using `createEffect` correctly.

**Correct fix — two-argument `createEffect`, tracking the ref via a signal:**

```tsx
export function Content(props: ContentProps) {
  const ctx = useContext()
  const [contentEl, setContentEl] = createSignal<HTMLDivElement | undefined>(undefined)

  createEffect(
    // Compute function: ALL reactive reads happen here, gated by ctx.open()
    () => (ctx.open() ? [contentEl(), ctx.triggerRef()] : [undefined, undefined]),
    // Effect function: receives the computed tuple, does the actual work
    ([el, reference]) => {
      if (!ctx.positioning || !el || !reference) return
      const result = ctx.positioning.update(reference, el)
      return typeof result === "function" ? result : undefined
    },
  )

  return (
    <Show when={ctx.open()}>
      <div ref={setContentEl}>{props.children}</div>
    </Show>
  )
}
```

Using a signal (`createSignal`) for the element ref — rather than a plain `let` — makes it a reactive dependency, so the effect's compute function re-runs every time the ref changes (mount/unmount) or `ctx.open()` flips. This is what makes the effect actually fire when `<Show>` mounts the content.

**Second pitfall in the fix — `STRICT_READ_UNTRACKED` if reads are split across the two functions:**

```tsx
// WRONG — ctx.triggerRef() is read in the effect function, which is untracked:
createEffect(
  () => (ctx.open() ? contentEl() : undefined),
  (el) => {
    const reference = ctx.triggerRef() // triggers STRICT_READ_UNTRACKED warning
    if (!ctx.positioning || !el || !reference) return
    ctx.positioning.update(reference, el)
  },
)
```

The two-argument `createEffect` only tracks reads inside the **first** (compute) function. Any signal read inside the second (effect) function is untracked by design — reading one there to gate logic still works functionally, but Solid 2's dev-mode strict-read checker flags it as a mistake, because it looks like a missed reactive dependency. Move every signal read that needs to participate into the compute function's return value (as a tuple/array), and destructure it in the effect function:

```tsx
createEffect(
  () => (ctx.open() ? [contentEl(), ctx.triggerRef()] : [undefined, undefined]),
  ([el, reference]) => {
    /* el and reference are plain values here, no warning */
  },
)
```

**Verification note:** this bug only surfaces when you actually exercise the codepath with a positioning port double and assert it was called (`expect(update).toHaveBeenCalledWith(...)`) — a test that merely renders the component and checks presence/absence of the content element (the existing test style in tooltip/popover/hover-card) will pass regardless of whether positioning wiring works. Any primitive using `positioning`/`PositioningPort` should have at least one test that provides a fake port and asserts `update` was called with the trigger and content elements.

## Full list of primitives affected by the `onSettled` + `<Show>` bug

All primitives below used the broken `onSettled` + `let contentEl` + `<Show>` pattern where layer registration, dismiss behavior, focus trapping, and/or positioning never activated on first open:

| Primitive         | What was broken                                  | Fix status                            |
| ----------------- | ------------------------------------------------ | ------------------------------------- |
| `dialog`          | Layer, dismiss, focus scope                      | Already correct (used `createEffect`) |
| `drawer`          | Layer, dismiss, focus scope                      | Already correct (used `createEffect`) |
| `hover-card`      | Positioning                                      | Fixed 2026-07-28                      |
| `tooltip`         | Positioning                                      | Fixed 2026-07-28                      |
| `popover`         | Layer, dismiss, focus scope, positioning         | Fixed 2026-07-28                      |
| `combobox`        | Layer, dismiss                                   | Fixed 2026-07-28                      |
| `context-menu`    | Layer, dismiss                                   | Fixed 2026-07-28                      |
| `menu`            | Layer, dismiss                                   | Fixed 2026-07-28                      |
| `select`          | Layer, dismiss                                   | Fixed 2026-07-28                      |
| `date-picker`     | Layer, dismiss, focus scope                      | Fixed 2026-07-28                      |
| `command-palette` | Layer, dismiss, focus scope                      | Fixed 2026-07-28                      |
| `sheet`           | Layer, dismiss, focus scope, scroll lock         | Fixed 2026-07-28                      |
| `alert-dialog`    | Layer, focus scope, modal isolation, scroll lock | Fixed 2026-07-28                      |

**Not affected:** `scroll-area` (uses `onSettled` but content is always mounted, no `<Show>` gating), `virtual-list` (same — always mounted).
