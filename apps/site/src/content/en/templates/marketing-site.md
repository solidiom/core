---
contentSchemaVersion: 1
title: "Marketing Site"
description: "Marketing website with landing page, features, and pricing."
keywords: [marketing-site, template, starter, solid, marketing, landing, pricing]
locale: en
maturity: draft
product: "Marketing Site"
productLayer: template
status: draft
package: "@solidiom/template-marketing-site"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Marketing Site provides a production-ready starting point for building product marketing websites with conversion-optimized layouts.

## Overview

This template scaffolds a complete marketing website with a hero landing page with value proposition and social proof, a features page showcasing product capabilities, and a pricing page with tier comparison and FAQ.

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
solidiom create my-app --template marketing-site
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
