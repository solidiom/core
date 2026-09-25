# shadcn reference — pinned versions

CLI: shadcn 3.8.5 (last release with classic theme-based `init -b <base-color>`; newer 4.x changed `-b` to mean base component library radix|base|aria)
react: ^19.0.0 (pinned 19.3.0)
react-dom: ^19.0.0 (pinned 19.3.0)
tailwindcss: ^3.4.17 (pinned 3.4.19)
base theme: neutral (init -b neutral), style new-york, cssVariables true
Components added (id: version-if-shown):

- button: registry new-york (no version field in registry entry)

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

| package                  | version |
| ------------------------ | ------- |
| react                    | 19.3.0  |
| react-dom                | 19.3.0  |
| react-router-dom         | 7.18.4  |
| class-variance-authority | 0.7.1   |
| clsx                     | 2.1.1   |
| tailwind-merge           | 2.6.1   |
| lucide-react             | 0.469.0 |
| @radix-ui/react-slot     | 1.3.3   |
| tailwindcss-animate      | 1.0.7   |
| tailwindcss              | 3.4.19  |
| vite                     | 6.4.3   |
| typescript               | 5.6.3   |
| @vitejs/plugin-react     | 4.7.0   |
| postcss                  | 8.5.28  |
| autoprefixer             | 10.6.1  |
| @types/react             | 19.3.0  |
| @types/react-dom         | 19.3.0  |
