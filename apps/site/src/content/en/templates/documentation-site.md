---
contentSchemaVersion: 1
title: "Documentation Site"
description: "Documentation and product site with docs reader, API reference, and guides."
keywords: [documentation-site, template, starter, solid, docs, api, guides]
locale: en
maturity: beta
product: "Documentation Site"
productLayer: template
status: published
package: "@solidiom/template-documentation-site"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Documentation Site provides a production-ready starting point for building technical documentation and product reference websites.

## Overview

This template scaffolds a complete documentation site with a docs reader with sidebar navigation, search, and version switching, an API reference with auto-generated type signatures and examples, and step-by-step tutorial guides with runnable code samples.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-CONTENT-01 (Content Editor)
- BLOCK-CONTENT-02 (Content Library)
- BLOCK-CONTENT-03 (Content Workflow)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template documentation-site
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
