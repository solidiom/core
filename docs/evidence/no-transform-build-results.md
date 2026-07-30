---
id: no-transform-build-results
title: "No-Transform Build Results — Generated Report"
doc_type: generated
audience: "Solidiom contributors"
tags: [build, tsup, no-transform, generated]
lifecycle: current
---

# No-Transform Build Results

Generated: 2026-07-22

## Summary

✓ All primitives build successfully via tsup without vite-plugin-solid compiler transform.

## Verification

Each primitive package produces `dist/index.js` via:

```
tsup src/index.tsx --format esm --target es2022
```

No JSX transform required at build time — Solid 2's compiler runs at the consumer's bundler level, not the library level. The `source/` export condition provides raw `.tsx` for consumers who want compile-time optimization.
