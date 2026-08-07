---
contentSchemaVersion: 1
title: "Data Governance"
description: "Data governance with catalog, lineage, and classification policies."
keywords: [data-governance, template, starter, solid, data, catalog, lineage, enterprise]
locale: en
maturity: draft
product: "Data Governance"
productLayer: template
status: draft
package: "@solidiom/template-data-governance"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Data Governance provides a production-ready starting point for building data governance platforms with discovery, lineage, and classification.

## Overview

This template scaffolds a complete data governance application with a data catalog for discovering, documenting, and searching data assets, a lineage explorer for tracing data flow from source to destination, and a classification policy manager for sensitivity labels, rules, and retention.

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
solidiom create my-app --template data-governance
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
