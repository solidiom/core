---
contentSchemaVersion: 1
title: "Observability Console"
description: "Observability console with dashboards, events, and alerts."
keywords: [observability-console, template, starter, solid, monitoring, enterprise]
locale: en
maturity: draft
product: "Observability Console"
productLayer: template
status: draft
package: "@solidiom/template-observability-console"
stack: vite-solid-router
portfolios: ["balanced-product", "enterprise"]
---

Observability Console provides a production-ready starting point for system monitoring and alerting.

## Overview

This template scaffolds a complete observability interface with dashboard metrics, real-time event stream, and alert configuration.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-OBS-01 (Dashboard Overview)
- BLOCK-OBS-02 (Real-time Events)
- BLOCK-OBS-03 (Alert Configuration)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template observability-console
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
