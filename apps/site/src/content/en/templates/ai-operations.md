---
contentSchemaVersion: 1
title: "AI Operations"
description: "AI operations with model monitoring, deployments, and cost tracking."
keywords: [ai-operations, template, starter, solid, mlops, monitoring, enterprise]
locale: en
maturity: draft
product: "AI Operations"
productLayer: template
status: draft
package: "@solidiom/template-ai-operations"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

AI Operations provides a production-ready starting point for building MLOps and AI model management consoles for platform teams.

## Overview

This template scaffolds a complete AI operations application with a model monitoring dashboard tracking performance, latency, error rates, and drift, a deployment pipeline manager for rollbacks, canary releases, and versioning, and cost tracking with token usage, inference budgets, and allocation reports.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-AI-01 (Chat Interface)
- BLOCK-AI-02 (Prompt Studio)
- BLOCK-AI-03 (Workflow Builder)
- BLOCK-OBS-01 (Observability Overview)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template ai-operations
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
