# shadcn reference — pinned versions

CLI: shadcn 3.8.5 (last release with classic theme-based `init -b <base-color>`; newer 4.x changed `-b` to mean base component library radix|base|aria)
react: ^19.0.0 (pinned 19.3.0)
react-dom: ^19.0.0 (pinned 19.3.0)
tailwindcss: ^3.4.17 (pinned 3.4.19)
base theme: neutral (init -b neutral), style new-york, cssVariables true
Components added (id: version-if-shown):

- button: registry new-york (no version field in registry entry)
- input: registry new-york (no version field)
- label: registry new-york (no version field)
- checkbox: registry new-york (no version field)
- radio-group: registry new-york (no version field)
- switch: registry new-york (no version field)
- slider: registry new-york (no version field)
- select: registry new-york (no version field)
- textarea: registry new-york (no version field)
- input-otp: registry new-york (no version field); dep `input-otp` ^1.5.0
- field: registry new-york (no version field); pulled in `separator` dependency (@radix-ui/react-separator)
- input-group: registry new-york (no version field); ran with `--overwrite` because its button.tsx template differed from Task 1's — only formatting changed, no class/API change
- combobox: **not available in pinned version** — shadcn 3.8.5 registry returns "The item at https://ui.shadcn.com/r/styles/new-york/combobox.json was not found". No page created, no hand-approximation (per brief).

Batch 2 (overlays) — all 10 resolved cleanly in the 3.8.5 registry
(`npx -y shadcn@3.8.5 add <name> -y`; `alert-dialog` added separately after the
bulk add stalled on the button.tsx overwrite prompt — answered `n`, then ran
`add alert-dialog`):

- dialog: registry new-york; dep @radix-ui/react-dialog ^1.1.23
- alert-dialog: registry new-york; dep @radix-ui/react-alert-dialog ^1.1.23
- sheet: registry new-york; dep @radix-ui/react-dialog (reused from dialog)
- drawer: registry new-york; dep vaul ^1.1.2 (vaul-based, NOT radix dialog — vaul
  is the shadcn drawer implementation; behaves as a bottom sheet by default)
- popover: registry new-york; dep @radix-ui/react-popover ^1.1.23
- tooltip: registry new-york; dep @radix-ui/react-tooltip ^1.2.16
- hover-card: registry new-york; dep @radix-ui/react-hover-card ^1.1.23
- dropdown-menu: registry new-york; dep @radix-ui/react-dropdown-menu ^2.1.24
- context-menu: registry new-york; dep @radix-ui/react-context-menu ^2.3.7
- menubar: registry new-york; dep @radix-ui/react-menubar ^1.1.24 (page created;
  mapping entry is `gap` — no Solidiom live island, see mapping.json)

No 3.8.5 registry 404s in Batch 2: all 10 names returned HTTP 200 from
https://ui.shadcn.com/r/styles/new-york/<name>.json and `shadcn add` wrote
`src/components/ui/<name>.tsx` for each.

Batch 3 (navigation & structure) — 11 mapped + 2 deps/extras added:

- tabs: registry new-york; dep @radix-ui/react-tabs ^1.1.21
- accordion: registry new-york; dep @radix-ui/react-accordion ^1.2.20
- collapsible: registry new-york; dep @radix-ui/react-collapsible ^1.1.20
- breadcrumb: registry new-york (no new radix dep; renders nav/ol/li)
- navigation-menu: registry new-york; dep @radix-ui/react-navigation-menu ^1.2.22
- pagination: registry new-york (no new radix dep; renders nav/ul)
- resizable-panels: shadcn slug `resizable-panels` → the `resizable` component file
  (`src/components/ui/resizable.tsx`); dep react-resizable-panels ^4.14.1 (NOT radix)
- scroll-area: registry new-york; dep @radix-ui/react-scroll-area ^1.2.18
- avatar: registry new-york; dep @radix-ui/react-avatar ^1.2.6
- badge: registry new-york (no new radix dep; cva variants)
- kbd: registry new-york (no new radix dep)
- sidebar: added as a DEPENDENCY/extras (uses @radix-ui/react-separator via field +
  react-resizable-panels); page created but mapping entry is `gap` — no Solidiom live island
- skeleton: added as a dep/extra (no mapping entry)

No 3.8.5 registry 404s in Batch 3: all names resolved and `shadcn add` wrote
`src/components/ui/<name>.tsx`. `src/index.css` (canonical hsl token set) and
`tailwind.config.js` (`plugins: []`) were re-verified unchanged after the adds —
no oklch clobber occurred (the `--sidebar-*` hsl tokens the sidebar component needs
are present in the canonical block).

Reference pages (src/pages/<id>.tsx, registered in src/main.tsx `pages`):
each overlay uses the real shadcn API with a minimal interactive setup —
dialog/alert-dialog/sheet/drawer/popover/tooltip/hover-card/dropdown-menu/
context-menu/menubar, all at 1280×720 viewport. tooltip page uses
`<TooltipProvider delayDuration={0}>` so the Radix tooltip opens immediately on
hover (the default 700ms hover-delay would otherwise race the parity engine's
per-state settle window and capture the tooltip still closed, producing a
false behavior gap).

Note: the shadcn CLI 3.8.5 registry writes **oklch** token values into
`src/index.css` but generates a v3 `tailwind.config.js` that wraps them as
`hsl(var(--token))` — `hsl()` of an `oklch(...)` value is an invalid CSS color
and the property is dropped, so the rendered UI appears unstyled. Per the
brief, the canonical **hsl** token block (light + dark) from Step 3 is applied
to `src/index.css`, and the brief's canonical v3 `tailwind.config.js` is
restored (which omits the oklch-only `--chart-*`/`--sidebar-*` tokens). This
makes the v3 token system self-consistent. The shadcn-generated
`tailwindcss-animate` plugin (CJS `require`) is not loaded in this ESM
`type: module` project and is excluded (plugins: []).

Lockfile-pinned versions (package-lock.json, npm 11.19.0, Node v26.7.0):

| package                       | version |
| ----------------------------- | ------- |
| react                         | 19.3.0  |
| react-dom                     | 19.3.0  |
| react-router-dom              | 7.18.4  |
| class-variance-authority      | 0.7.1   |
| clsx                          | 2.1.1   |
| tailwind-merge                | 2.6.1   |
| lucide-react                  | 0.469.0 |
| @radix-ui/react-slot          | 1.3.3   |
| vaul                          | 1.1.2   |
| @radix-ui/react-dialog        | 1.1.23  |
| @radix-ui/react-alert-dialog  | 1.1.23  |
| @radix-ui/react-popover       | 1.1.23  |
| @radix-ui/react-tooltip       | 1.2.16  |
| @radix-ui/react-hover-card    | 1.1.23  |
| @radix-ui/react-dropdown-menu | 2.1.24  |
| @radix-ui/react-context-menu  | 2.3.7   |
| @radix-ui/react-menubar       | 1.1.24  |
| tailwindcss-animate           | 1.0.7   |
| tailwindcss                   | 3.4.19  |
| vite                          | 6.4.3   |
| typescript                    | 5.6.3   |
| @vitejs/plugin-react          | 4.7.0   |
| postcss                       | 8.5.28  |
| autoprefixer                  | 10.6.1  |
| @types/react                  | 19.3.0  |
| @types/react-dom              | 19.3.0  |
