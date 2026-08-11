---
contentSchemaVersion: 1
title: "Search Application"
description: "Full-text search application with results, saved searches, and analytics."
keywords: [search-application, template, starter, solid, search, analytics]
locale: en
maturity: beta
product: "Search Application"
productLayer: template
status: published
package: "@solidiom/template-search-application"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Search Application provides a production-ready starting point for building full-text search interfaces with faceted filtering.

## Overview

This template scaffolds a complete search application with ranked results and filters, saved search queries with alert subscriptions, and a search analytics dashboard for monitoring query performance.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-SEARCH-01 (Search Results)
- BLOCK-SEARCH-02 (Saved Searches)
- BLOCK-SEARCH-03 (Search Analytics)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template search-application
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
