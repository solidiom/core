---
contentSchemaVersion: 1
title: "SaaS Dashboard"
description: "SaaS dashboard with navigation, metrics, and resource management."
keywords: [saas-dashboard, template, starter, solid, dashboard]
locale: en
maturity: beta
product: "SaaS Dashboard"
productLayer: template
status: published
package: "@solidiom/template-saas-dashboard"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

SaaS Dashboard provides a production-ready starting point for SaaS applications with observability and resource management.

## Overview

This template scaffolds a complete SaaS dashboard with navigation shell, metrics overview, real-time events, and resource list views.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-SHELL-03 (Notifications Center)
- BLOCK-OBS-01 (Dashboard Overview)
- BLOCK-OBS-02 (Real-time Events)
- BLOCK-RESOURCE-01 (Resource List)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template saas-dashboard
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
