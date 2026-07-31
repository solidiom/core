import { createRouter as createTanStackRouter } from "@tanstack/solid-router"
import { routeTree } from "./routeTree.gen"

/**
 * Router factory consumed by TanStack Start's hydration entry.
 *
 * MUST be exported as `getRouter` — TanStack Start's internal hydration
 * code (`@tanstack/start-client-core`) does a named `{ getRouter }` import
 * from this file's resolved virtual module. Any other export name fails
 * the build with a MISSING_EXPORT error. `createRouter` is aliased on
 * import specifically so this file can still call the real factory
 * function under its own name from `@tanstack/solid-router`.
 */
export function getRouter() {
  return createTanStackRouter({
    routeTree,
    defaultPreload: "intent",
    scrollRestoration: true,
  })
}

declare module "@tanstack/solid-router" {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
