---
contentSchemaVersion: 1
title: "Workflow Automation"
description: "Workflow automation with visual designer, run history, and integrations."
keywords: [workflow-automation, template, starter, solid, workflows, automation, enterprise]
locale: en
maturity: beta
product: "Workflow Automation"
productLayer: template
status: published
package: "@solidiom/template-workflow-automation"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Workflow Automation provides a production-ready starting point for building no-code workflow orchestration platforms with visual design and monitoring.

## Overview

This template scaffolds a complete workflow automation application with a visual drag-and-drop workflow designer with triggers, conditions, and actions, a run history dashboard with step-level logs and retry controls, and an integrations manager for configuring third-party connectors and webhooks.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-AI-03 (Workflow Builder)
- BLOCK-OBS-01 (Observability Overview)
- BLOCK-RESOURCE-01 (Resource List)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template workflow-automation
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
