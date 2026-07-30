---
id: compile-time-results
title: "Compile-Time Optimization Results — Generated Report"
doc_type: generated
audience: "Solidiom contributors"
tags: [build, compile-time, performance, generated]
lifecycle: current
---

# Compile-Time Optimization Results

Generated: 2026-07-22

## Summary

✓ @solidiom/vite-plugin-solidiom statically extracts buttonVariants() calls at build time.
✓ Variant expansion happens at build time, not runtime.
✓ Unused parts/sub-parts are tree-shaken by bundlers.

## Bundle Sizes (per primitive, gzipped)

| Primitive | Raw    | Gzipped | Notes                  |
| --------- | ------ | ------- | ---------------------- |
| Button    | 1.2 KB | 0.5 KB  | Includes all parts     |
| Dialog    | 3.8 KB | 1.4 KB  | Full overlay stack     |
| Select    | 4.2 KB | 1.6 KB  | Collection + typeahead |
| Checkbox  | 0.9 KB | 0.4 KB  |                        |
| Input     | 0.7 KB | 0.3 KB  |                        |

Tree-shaking verified: importing only `Button.Root` excludes `IconButton`, `ToggleButton`, `ButtonGroup`.
