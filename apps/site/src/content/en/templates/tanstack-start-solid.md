---
contentSchemaVersion: 1
title: TanStack Start Solid
description: "Starter template for tanstack start solid projects."
keywords: [tanstack-start-solid, template, starter, solid]
locale: en
maturity: draft
product: TanStack Start Solid
productLayer: template
status: draft
package: "@solidiom/template-tanstack-start-solid"
stack: tanstack-start-solid
portfolios: ["balanced-product"]
---

TanStack Start Solid provides a production-ready starting point for Solid projects using the tanstack start solid stack.

## Overview

This template scaffolds a complete project with routing, styling setup, and Solidiom integration pre-configured. It serves as the foundation for building applications with the tanstack start solid architecture.

## Stack

- **Framework:** tanstack start solid
- **Routing:** File-based routing with TanStack Router
- **Rendering:** SSR with hydration
- **Build tool:** Vite

## Required Blocks

This template integrates blocks for common application patterns including authentication, onboarding, and resource management. Specific block dependencies vary by portfolio selection.

## Authentication

The template includes a default authentication setup compatible with the Sign In and Sign Up blocks. Authentication is configured as a composable layer that can be replaced or extended.

## Styling

The template ships with a pre-configured styling profile (CSS, Tailwind, or UnoCSS). The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template tanstack-start-solid
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy to any Node.js-compatible hosting platform that supports SSR. Vercel, Netlify, and Cloudflare Pages are supported targets.
