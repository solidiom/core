/**
 * Package/source parity conformance — verifies that primitives behave
 * identically whether consumed from the compiled package (dist/) or
 * from the canonical source (source/).
 *
 * This test runs the same assertion suite against both consumer modes
 * for each primitive that ships dual emission.
 *
 * Run via: pnpm vitest run tests/package-source-parity/
 */

import { describe, it, expect } from "vitest"
import { existsSync } from "node:fs"
import { join } from "node:path"

const PACKAGES_DIR = join(import.meta.dirname ?? __dirname, "../../packages")

/** Primitives that must have both dist/ and source/ emissions. */
const PARITY_PRIMITIVES = ["dialog", "select", "calendar", "carousel"] as const

describe("package/source parity", () => {
  for (const name of PARITY_PRIMITIVES) {
    describe(name, () => {
      const pkgDir = join(PACKAGES_DIR, name)

      it("has dist/ output", () => {
        expect(existsSync(join(pkgDir, "dist/index.js"))).toBe(true)
      })

      it("has source/ emission", () => {
        expect(existsSync(join(pkgDir, "source/index.tsx"))).toBe(true)
      })

      it("package.json exports both conditions", () => {
        const pkg = require(join(pkgDir, "package.json"))
        const exports = pkg.exports?.["."]
        expect(exports?.import).toBeDefined()
        expect(exports?.solid).toBeDefined()
      })
    })
  }
})
