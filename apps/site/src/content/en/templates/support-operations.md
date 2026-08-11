---
contentSchemaVersion: 1
title: "Support Operations"
description: "Support operations with ticket queue, knowledge base, and metrics."
keywords: [support-operations, template, starter, solid, support, tickets, enterprise]
locale: en
maturity: beta
product: "Support Operations"
productLayer: template
status: published
package: "@solidiom/template-support-operations"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Support Operations provides a production-ready starting point for building customer support consoles with ticket management, self-service knowledge, and team performance tracking.

## Overview

This template scaffolds a complete support operations application with a ticket queue for managing support requests with priority, assignment, and SLA tracking, a knowledge base for authoring, organizing, and searching help articles, and a metrics dashboard for tracking resolution times, CSAT scores, and agent performance.

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
- BLOCK-CONTENT-01 (Content Editor)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template support-operations
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
