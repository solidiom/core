---
contentSchemaVersion: 1
title: "Resource Manager"
description: "Resource manager with list, detail, and creation views."
keywords: [resource-manager, template, starter, solid, resources, enterprise]
locale: en
maturity: draft
product: "Resource Manager"
productLayer: template
status: draft
package: "@solidiom/template-resource-manager"
stack: vite-solid-router
portfolios: ["balanced-product", "enterprise"]
---

Resource Manager provides a production-ready starting point for CRUD resource management applications.

## Overview

This template scaffolds a complete resource management interface with filterable list, detail view, and guided creation form.

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
- BLOCK-RESOURCE-03 (Resource Creator)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template resource-manager
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
