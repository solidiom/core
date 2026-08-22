# @solidiom/astrojs-solid-next

Astro integration that renders Solid 2 components as islands using the Solidiom/Vite Solid 2 toolchain.

## Overview

This integration registers a Solid 2 renderer with Astro so that `.tsx` Solid
components can be used as Astro islands (`client:load`, `client:idle`,
`client:only`, etc.). It wires up `vite-plugin-solid` for SSR and aliases
installed `@solidiom/*` primitive packages to their real Solid JSX source so
they render correctly across every Vite environment and package manager.

## Installation

```sh
pnpm add @solidiom/astrojs-solid-next
```

### Peer dependencies

Provide these in your project (they are declared as peer dependencies):

| Package        | Supported range                  |
| -------------- | -------------------------------- |
| `astro`        | `^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0` |
| `solid-js`     | `>=2.0.0-beta.32 <3.0.0`         |
| `@solidjs/web` | `>=2.0.0-beta.32 <3.0.0`         |
| `vite`         | `^6.0.0 \|\| ^7.0.0 \|\| ^8.0.0` |

Requires Node `>=24`.

## Usage

Add the integration to your `astro.config.mjs`:

```js
import { defineConfig } from "astro/config"
import solid from "@solidiom/astrojs-solid-next"

export default defineConfig({
  integrations: [solid()],
})
```

### Options

The default export accepts an optional `Options` object. Both fields are
forwarded to `vite-plugin-solid` to scope which modules it transforms:

```ts
interface Options {
  include?: string | RegExp | (string | RegExp)[]
  exclude?: string | RegExp | (string | RegExp)[]
}
```

Set `include` / `exclude` when more than one JSX renderer (for example
`@astrojs/react` or `@astrojs/preact`) is enabled, so each renderer only
transforms its own components:

```js
import { defineConfig } from "astro/config"
import solid from "@solidiom/astrojs-solid-next"

export default defineConfig({
  integrations: [solid({ include: ["**/solid/**"] })],
})
```

## Exports

| Entry point                                       | Export                                                               |
| ------------------------------------------------- | -------------------------------------------------------------------- |
| `@solidiom/astrojs-solid-next`                    | Default: integration factory. Named: `getContainerRenderer`          |
| `@solidiom/astrojs-solid-next/container-renderer` | `getContainerRenderer` — returns the Astro container `AstroRenderer` |
| `@solidiom/astrojs-solid-next/client.js`          | Client-side island hydration entrypoint                              |
| `@solidiom/astrojs-solid-next/server.js`          | Server-side rendering entrypoint                                     |

`getContainerRenderer()` returns the renderer descriptor used with Astro's
Container API:

```ts
import { getContainerRenderer } from "@solidiom/astrojs-solid-next"
```

## License

Apache-2.0
