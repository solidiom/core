import type { AstroIntegration, AstroRenderer } from "astro"
import { readdirSync, readFileSync, existsSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { basename, dirname, resolve } from "node:path"
import solid from "vite-plugin-solid"
import { getContainerRenderer as getContainerRendererImpl } from "./container-renderer.js"

export function getContainerRenderer(): AstroRenderer {
  return getContainerRendererImpl()
}

/**
 * Options accepted by the integration. `include` / `exclude` are forwarded to
 * `vite-plugin-solid` to scope which modules it transforms. Typed structurally
 * (rather than `Pick<ViteSolidPluginOptions, …>`) so this package's public
 * `.d.ts` does not re-export `vite` types — which keeps declaration emit clean
 * in monorepos that hoist more than one `vite` copy.
 */
export interface Options {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}

export default function (options: Options = {}): AstroIntegration {
  return {
    name: "@solidiom/astrojs-solid-next",
    hooks: {
      "astro:config:setup": async ({ addRenderer, updateConfig }) => {
        addRenderer(getContainerRendererImpl())
        updateConfig({
          vite: getViteConfiguration(options),
        })
      },
      "astro:config:done": ({ logger, config }) => {
        const knownJsxRenderers = [
          "@astrojs/react",
          "@astrojs/preact",
          "@solidiom/astrojs-solid-next",
        ]
        const enabledKnownJsxRenderers = config.integrations.filter((renderer) =>
          knownJsxRenderers.includes(renderer.name),
        )

        if (enabledKnownJsxRenderers.length > 1 && !options.include && !options.exclude) {
          logger.warn(
            "More than one JSX renderer is enabled. This will lead to unexpected behavior unless you set the `include` or `exclude` option.",
          )
        }
      },
    },
  }
}

/**
 * Minimal structural shape of a Vite plugin: enough for Astro's
 * `DeepPartial<ViteUserConfig>.plugins` (which requires `name`) without
 * pulling the full `vite` `Plugin<any>` signature into this package's
 * declaration graph.
 *
 * Under TypeScript 6.0.3, emitting `.d.ts` while the complete `Plugin` type
 * from `vite-plugin-solid` is reachable triggers a compiler internal error
 * ("Debug Failure: parameter should have errors when reporting errors").
 * Typing the plugins by this structural shape severs that link. Runtime
 * behavior is unchanged — Vite consumes the real plugin objects.
 */
type VitePluginLike = { name: string; [key: string]: unknown }

function getViteConfiguration({ include, exclude }: Options) {
  // `solid(...)` returns an array of Vite plugins; flatten into one list.
  const plugins: VitePluginLike[] = [
    ...(solid({ include, exclude, ssr: true }) as unknown as VitePluginLike[]),
    configEnvironmentPlugin() as unknown as VitePluginLike,
  ]

  // `resolve.alias` is the robust way to pin `@solidiom/*` to their Solid
  // source across ALL Vite environments (including Astro's `prerender`), so
  // it lives at the config level rather than as a plugin.
  return {
    plugins,
    resolve: { alias: solidSourceAlias() },
  }
}

function configEnvironmentPlugin() {
  return {
    name: "@solidiom/astrojs-solid-next:config-environment",
    configEnvironment(environmentName: string) {
      return {
        optimizeDeps: {
          include: environmentName === "client" ? ["@solidiom/astrojs-solid-next/client.js"] : [],
          exclude: ["@solidiom/astrojs-solid-next/server.js"],
        },
      }
    },
  }
}

/**
 * Build a Vite `resolve.alias` table that maps every installed `@solidiom/*`
 * package to the file its `solid` export condition points at (typically
 * `source/index.tsx`, the real Solid JSX source).
 *
 * Why this is needed: each `@solidiom/*` primitive package ships two builds —
 *   - `"solid"`  -> `source/index.tsx`  (the real Solid JSX source)
 *   - `"import"` -> `dist/index.js`     (a React-compiled fallback build)
 *
 * In a pnpm workspace the `solid` condition is applied automatically (the
 * monorepo's own docs site relies on this). On npm, however, Astro's
 * `prerender` Vite environment does NOT apply the `solid` condition when
 * resolving bare `node_modules` specifiers, so `@solidiom/button` falls back
 * to its React `dist/` build. That build references `React`, which is absent
 * in a Solid project, so SSR throws `ReferenceError: React is not defined` —
 * which the renderer's `renderToStringAsync` swallows via `.catch(() => "")`,
 * leaving an empty `<astro-island>`.
 *
 * The alias forces the Solid source regardless of environment or package
 * manager. It only maps packages that actually declare a `solid` condition,
 * so it never touches `solid-js` / `@solidjs/web` (which `@solidjs/vite-plugin`
 * resolves per-environment on its own) or this integration package.
 */
function solidSourceAlias(): Record<string, string> {
  const alias: Record<string, string> = {}
  const scopeDir = findSolidiomScopeDir()
  if (!scopeDir) return alias
  for (const name of readdirSync(scopeDir)) {
    if (name === "astrojs-solid-next" || name.startsWith(".")) continue
    const dir = resolve(scopeDir, name)
    const pkgJsonPath = resolve(dir, "package.json")
    if (!existsSync(pkgJsonPath)) continue
    let pkg: { name?: string; exports?: Record<string, { solid?: string }> }
    try {
      pkg = JSON.parse(readFileSync(pkgJsonPath, "utf8"))
    } catch {
      continue
    }
    const entry = pkg.exports?.["."]?.solid
    if (pkg.name && entry) {
      alias[pkg.name] = resolve(dir, entry)
    }
  }
  return alias
}

/**
 * Locate the `node_modules/@solidiom` scope directory that holds the
 * primitives. This package lives at `.../node_modules/@solidiom/
 * astrojs-solid-next/`, so its scope dir is two levels up from this file.
 * Walking up from the file's own location (rather than `require.resolve`-ing a
 * sibling's `package.json`) is robust: sibling packages do not necessarily
 * export their `package.json` subpath, and the walk also tolerates pnpm's
 * `.pnpm` virtual-store layout where the scope dir is a real directory.
 */
function findSolidiomScopeDir(): string | null {
  // This file is <scope>/astrojs-solid-next/dist/index.js (or src/index.ts).
  // `<scope>` is the `node_modules/@solidiom` directory.
  const here = dirname(fileURLToPath(import.meta.url))
  let dir = here
  for (let i = 0; i < 6; i++) {
    // A scope dir is named "@solidiom" OR its basename is a package under the
    // @solidiom scope. Match both the literal scope folder and a nested
    // package whose parent is the scope.
    const base = basename(dir)
    if (base === "astrojs-solid-next") {
      const candidate = resolve(dir, "..")
      if (existsSync(candidate) && basename(candidate) === "@solidiom") return candidate
    }
    if (base === "@solidiom") return dir
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return null
}
