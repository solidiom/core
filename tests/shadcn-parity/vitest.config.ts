import { defineConfig } from "vitest/config"
import { dirname } from "node:path"
import { fileURLToPath } from "node:url"

// Scope to the parity dir so a filter-less `vitest run --config …/vitest.config.ts`
// finds ONLY the parity tests. Without an explicit `root` here, vitest resolves
// `root` to the invocation cwd (the worktree root) and `**/*.test.ts` sweeps the
// whole worktree (38 unrelated pre-existing files) — confusing noise.
const here = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  root: here,
  test: {
    include: ["**/*.test.ts"],
  },
})
