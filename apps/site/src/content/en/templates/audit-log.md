---
contentSchemaVersion: 1
title: "Audit Log"
description: "Audit log viewer with event stream, filters, and export."
keywords: [audit-log, template, starter, solid, audit, compliance, enterprise]
locale: en
maturity: draft
product: "Audit Log"
productLayer: template
status: draft
package: "@solidiom/template-audit-log"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Audit Log provides a production-ready starting point for building audit trail and compliance event viewers for enterprise applications.

## Overview

This template scaffolds a complete audit log application with a real-time event stream showing actor, action, and resource details, advanced filters for narrowing events by actor, type, resource, date, and severity, and an export facility for generating CSV, JSON, and compliance reports.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Role Management)
- BLOCK-ADMIN-03 (Audit Log)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template audit-log
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
