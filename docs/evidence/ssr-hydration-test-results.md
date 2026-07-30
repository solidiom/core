---
id: ssr-hydration-test-results
title: "SSR / Hydration Test Results — Generated Report"
doc_type: generated
audience: "Solidiom contributors"
tags: [ssr, hydration, testing, generated]
lifecycle: current
---

# SSR / Hydration Test Results

Generated: 2026-07-22

## Summary

All primitives render correctly via `renderToString` from `@solidjs/web` with no console warnings or undefined output. Hydration re-mounts without divergence.

## Results

| Primitive   | SSR Clean | Hydration Clean | Notes |
| ----------- | --------- | --------------- | ----- |
| Button      | ✓         | ✓               |       |
| Checkbox    | ✓         | ✓               |       |
| Dialog      | ✓         | ✓               |       |
| Select      | ✓         | ✓               |       |
| Switch      | ✓         | ✓               |       |
| Slider      | ✓         | ✓               |       |
| Tabs        | ✓         | ✓               |       |
| Accordion   | ✓         | ✓               |       |
| Popover     | ✓         | ✓               |       |
| Tooltip     | ✓         | ✓               |       |
| Menu        | ✓         | ✓               |       |
| Toast       | ✓         | ✓               |       |
| Input       | ✓         | ✓               |       |
| Label       | ✓         | ✓               |       |
| Field       | ✓         | ✓               |       |
| RadioGroup  | ✓         | ✓               |       |
| Progress    | ✓         | ✓               |       |
| Separator   | ✓         | ✓               |       |
| Skeleton    | ✓         | ✓               |       |
| Avatar      | ✓         | ✓               |       |
| Spinner     | ✓         | ✓               |       |
| AlertDialog | ✓         | ✓               |       |
| ToggleGroup | ✓         | ✓               |       |
| Breadcrumb  | ✓         | ✓               |       |
| Pagination  | ✓         | ✓               |       |
| Sheet       | ✓         | ✓               |       |
| HoverCard   | ✓         | ✓               |       |
| ContextMenu | ✓         | ✓               |       |
| Kbd         | ✓         | ✓               |       |
| Toolbar     | ✓         | ✓               |       |
| Card        | ✓         | ✓               |       |
| EmptyState  | ✓         | ✓               |       |

All primitives use `createStableId()` for deterministic IDs between server and client.
