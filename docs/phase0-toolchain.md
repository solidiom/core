# Phase 0 Toolchain Versions

Recorded at baseline establishment.

| Tool        | Version           |
| ----------- | ----------------- |
| Node.js     | v26.5.0           |
| pnpm        | 10.34.5           |
| TypeScript  | 6.0.3             |
| Vitest      | 4.1.10            |
| Playwright  | 1.61.1            |
| Solid.js    | 2.0.0-beta.21     |
| @solidjs/web| 2.0.0-beta.21     |
| Nx          | ^23.1.0           |
| OS          | macOS (darwin-arm64) |

## Solid 2 Rolling Beta Window

From `tools/solid-matrix.json`:

- **low:** 2.0.0-beta.18
- **mid:** 2.0.0-beta.19
- **high:** 2.0.0-beta.20
- **Installed (override):** 2.0.0-beta.21

## Notes

- The `pnpm-workspace.yaml` override pins `solid-js` to `2.0.0-beta.21` which is outside the matrix window declared in `tools/solid-matrix.json`. This will be reconciled in P0.4.
- Generated build outputs (`dist/`) are gitignored and must not be used as proof of source completion.
