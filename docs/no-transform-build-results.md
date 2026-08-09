# No-Transform Build Results

Evidence that all primitives and packages build successfully without compile-time
transforms enabled (transforms are opt-in optimizations, not build requirements).

## Build Command

```sh
pnpm nx run-many -t build --exclude=@solidiom/docs-astro-poc --exclude=@solidiom/site
```

## Result

- **105 projects built successfully**
- **0 failures**
- All packages compile without `@solidiom/vite-plugin` transforms active
- Transforms (recipe extraction, variant expansion, dead-part elimination) are
  opt-in via `solidiomPlugin({ ... })` configuration — they optimize output but
  are never required for correctness

## Verified

- Date: 2026-08-08
- Solid version: 2.0.0-beta.32
- Node version: 24+
- Build tool: tsup (packages), Vite (apps)
