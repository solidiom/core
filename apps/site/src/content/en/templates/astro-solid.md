---
contentSchemaVersion: 1
title: Astro + Solid Starter
description: "Starter template for Astro projects with Solid islands using the Solidiom integration."
keywords: [astro-solid, template, starter, solid, astro, islands, ssr]
locale: en
maturity: beta
product: Astro + Solid Starter
productLayer: template
status: published
package: "@solidiom/astrojs-solid-next"
stack: astro-solid
portfolios: ["balanced-product"]
---

Astro + Solid Starter provides a production-ready starting point for Astro projects with Solid 2 islands powered by the Solidiom integration.

## Overview

This template scaffolds a complete Astro project with Solid 2 component islands, automatic source aliasing for Solidiom primitives, and SSR support out of the box. It uses `@solidiom/astrojs-solid-next` to bridge Astro's island architecture with Solid's reactive rendering.

## Stack

- **Framework:** Astro + Solid 2
- **Routing:** File-based routing with Astro
- **Rendering:** SSR with partial hydration (islands)
- **Build tool:** Vite

## Key Features

- Automatic `solid` export condition resolution for all `@solidiom/*` primitives
- Multi-renderer support with configurable `include`/`exclude` scoping
- Container renderer for Astro's server-side rendering pipeline
- Compatible with Astro 5, 6, and 7

## Installation

```sh
npm install @solidiom/astrojs-solid-next
```

Then add the integration to your `astro.config.ts`:

```ts
import solid from "@solidiom/astrojs-solid-next"

export default defineConfig({
  integrations: [solid()],
})
```

If you use multiple JSX renderers (e.g., React and Solid), scope the integration with `include`/`exclude`:

```ts
solid({ include: ["**/components/solid/**"] })
```

## Styling

The template works with any Solidiom styling profile (CSS, Tailwind, or UnoCSS). The theme system allows switching between presets without modifying component code.

## Deployment

Deploy the output to any hosting platform that supports Astro. Vercel, Netlify, and Cloudflare Pages are supported targets.
