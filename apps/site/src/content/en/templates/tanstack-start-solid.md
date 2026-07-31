---
contentSchemaVersion: 1
title: TanStack Start (Solid) SSR Starter
description: A server-rendered Solid starter scaffolded with TanStack Start and TanStack Router, ready for `solidiom add`.
keywords:
  - tanstack
  - tanstack-start
  - tanstack-router
  - ssr
  - starter
  - template
locale: en
maturity: beta
product: solidiom
productLayer: template
status: published
package: "@solidiom/template-tanstack-start-solid"
stack: tanstack-start-solid
portfolios:
  - balanced-product
---

# TanStack Start (Solid) SSR Starter

A server-rendered Solid application scaffolded with [TanStack Start](https://tanstack.com/start)
and [TanStack Router](https://tanstack.com/router), both built natively against Solid 2 rather
than retrofitted from a Solid 1 codebase. This is the SSR counterpart to `vite-solid-router` —
choose this template when your project needs full-document server-side rendering.

## What's included

- A TanStack Start Vite plugin setup, pre-configured for Solid, producing separate client and
  server production bundles.
- Two file-based routes (`/` and `/about`) wired through `@tanstack/solid-router`, demonstrating
  server-rendered navigation.
- One Solidiom primitive (`@solidiom/button`) rendered with the Tailwind styling recipe, so you
  can see a real component styled out of the box — the same demo `vite-solid-router` uses, for a
  direct comparison between the two templates.
- A generated `.solidiom/config.json`, so the project is immediately ready for
  `solidiom add <primitive>`.

## Scaffold a project

```sh
solidiom create my-app --template tanstack-start-solid
```

Pass `--yes` to skip prompts, `--styling` to pick a styling profile (`css`, `tailwind`, or
`unocss`), and `--no-install` if you'd rather run the install step yourself.

## When to choose this template

Choose `tanstack-start-solid` when your project needs server-side rendering — content-driven
sites, anything that benefits from SEO, and pages that need data available before first paint are
a good fit. If your project is a dashboard, internal tool, or single-page app that doesn't need a
server render, `vite-solid-router` ships a smaller, simpler client-only alternative.

## Why TanStack Start instead of SolidStart

This workspace pins `solid-js@2.0.0-beta.24`. At the time this template was built, SolidStart's
released line still depended on `solid-js@1.x` internally and its config API did not export the
function this workspace's tooling expected, so it could not build against this pin. TanStack
Start's `peerDependencies` declare `solid-js: ">=2.0.0-0 <3.0.0"` and
`@solidjs/web: ">=2.0.0-0 <3.0.0"` — built for Solid 2 from the start, not adapted after the fact.
