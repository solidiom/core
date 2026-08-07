---
contentSchemaVersion: 1
title: "Incident Response"
description: "Incident response with active incidents, runbooks, and postmortems."
keywords: [incident-response, template, starter, solid, incidents, runbooks, enterprise]
locale: en
maturity: draft
product: "Incident Response"
productLayer: template
status: draft
package: "@solidiom/template-incident-response"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Incident Response provides a production-ready starting point for building incident management and operational response consoles.

## Overview

This template scaffolds a complete incident response application with an active incidents dashboard showing severity, assigned responders, and real-time timeline updates, a runbook library with step-by-step operational procedures for common scenarios, and a postmortem archive for documenting root causes, timelines, and follow-up action items.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-OBS-01 (Observability Overview)
- BLOCK-OBS-02 (Alert Management)
- BLOCK-OBS-03 (Event Explorer)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template incident-response
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
