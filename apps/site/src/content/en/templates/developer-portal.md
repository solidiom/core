---
contentSchemaVersion: 1
title: "Developer Portal"
description: "Developer portal with documentation, SDK playground, and app management."
keywords: [developer-portal, template, starter, solid, developer, sdk, enterprise]
locale: en
maturity: draft
product: "Developer Portal"
productLayer: template
status: draft
package: "@solidiom/template-developer-portal"
stack: vite-solid-router
portfolios: ["enterprise"]
---

Developer Portal provides a production-ready starting point for building developer experience platforms with documentation, interactive tooling, and app lifecycle management.

## Overview

This template scaffolds a complete developer portal with API documentation with guides, SDK references, and code examples, an interactive playground for testing API calls and SDK integrations, and an application management console for registering OAuth clients and configuring webhooks.

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
solidiom create my-app --template developer-portal
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
