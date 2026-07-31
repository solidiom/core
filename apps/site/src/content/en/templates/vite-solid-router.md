---
contentSchemaVersion: 1
title: Vite + Solid Router Starter
description: A client-only Solid starter scaffolded with Vite and Solid Router, ready for `solidiom add`.
keywords:
  - vite
  - solid-router
  - starter
  - template
  - client-only
locale: en
maturity: beta
product: solidiom
productLayer: template
status: published
package: "@solidiom/template-vite-solid-router"
stack: vite-solid-router
portfolios:
  - balanced-product
---

# Vite + Solid Router Starter

A minimal, client-only Solid application scaffolded with [Vite](https://vitejs.dev) and
[Solid Router](https://github.com/solidjs/solid-router). No server-side rendering — this
template is the fastest path to a working Solidiom project when you don't need SSR.

## What's included

- A Vite dev server and production build, pre-configured for Solid.
- Two routes (`/` and `/about`) wired through `@solidjs/router`, demonstrating client-side
  navigation with the `<A>` component.
- One Solidiom primitive (`@solidiom/button`) rendered with the Tailwind styling recipe, so
  you can see a real component styled out of the box.
- A generated `.solidiom/config.json`, so the project is immediately ready for
  `solidiom add <primitive>`.

## Scaffold a project

```sh
solidiom create my-app --template vite-solid-router
```

Pass `--yes` to skip prompts, `--styling` to pick a styling profile (`css`, `tailwind`, or
`unocss`), and `--no-install` if you'd rather run the install step yourself.

## When to choose this template

Choose `vite-solid-router` when your project doesn't need server-side rendering — dashboards,
internal tools, and single-page apps that ship a static bundle are a good fit. If you need SSR,
a SolidStart-based template is planned for a future release.
