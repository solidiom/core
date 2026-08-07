---
contentSchemaVersion: 1
title: "API Management"
description: "API management with endpoint catalog, key management, and usage analytics."
keywords: [api-management, template, starter, solid, api, keys, enterprise]
locale: en
maturity: draft
product: "API Management"
productLayer: template
status: draft
package: "@solidiom/template-api-management"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

API Management provides a production-ready starting point for building API gateway consoles with endpoint discovery, key lifecycle, and analytics.

## Overview

This template scaffolds a complete API management application with an endpoint catalog for browsing, searching, and documenting API endpoints, a key management interface for creating, rotating, and revoking API keys with scoped policies, and usage analytics showing request volume, latency percentiles, and error rates.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-RESOURCE-01 (Resource List)
- BLOCK-RESOURCE-02 (Resource Detail)
- BLOCK-RESOURCE-03 (Resource Create)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template api-management
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
