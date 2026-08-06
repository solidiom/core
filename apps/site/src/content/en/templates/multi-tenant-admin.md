---
contentSchemaVersion: 1
title: "Multi-tenant Admin"
description: "Multi-tenant admin with team management, RBAC, and audit logging."
keywords: [multi-tenant-admin, template, starter, solid, admin, enterprise]
locale: en
maturity: draft
product: "Multi-tenant Admin"
productLayer: template
status: draft
package: "@solidiom/template-multi-tenant-admin"
stack: vite-solid-router
portfolios: ["balanced-product", "enterprise"]
---

Multi-tenant Admin provides a production-ready starting point for multi-tenant administration interfaces.

## Overview

This template scaffolds a complete admin panel with team management, role-based access control, and audit logging.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Audit Log)
- BLOCK-ADMIN-03 (Role Permissions)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template multi-tenant-admin
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
