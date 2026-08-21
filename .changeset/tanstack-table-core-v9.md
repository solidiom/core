---
"@solidiom/adapter-table-tanstack": minor
---

Upgrade `@tanstack/table-core` to v9. The adapter is rewritten against v9's feature-modular API (`tableFeatures` + `constructTable` with `createCoreRowModel`/`createSortedRowModel`/`createFilteredRowModel`), replacing the v8 `createTable`/`getCoreRowModel` shape. The public capability surface (`createTanStackTableAdapter` and the `TableModelCapability` interfaces) is unchanged, but consumers now resolve `@tanstack/table-core@9`.
