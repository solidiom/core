---
contentSchemaVersion: 1
title: Vite + Solid Router Starter
description: "Starter template for vite solid router projects."
keywords: [vite-solid-router, template, starter, solid]
locale: en
maturity: beta
product: Vite + Solid Router Starter
productLayer: template
status: published
package: "@solidiom/template-vite-solid-router"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Vite + Solid Router Starter provides a production-ready starting point for Solid projects using the vite solid router stack.

## Overview

This template scaffolds a complete project with routing, styling setup, and Solidiom integration pre-configured. It serves as the foundation for building applications with the vite solid router architecture.

## Stack

- **Framework:** vite solid router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

This template integrates blocks for common application patterns including authentication, onboarding, and resource management. Specific block dependencies vary by portfolio selection.

## Authentication

The template includes a default authentication setup compatible with the Sign In and Sign Up blocks. Authentication is configured as a composable layer that can be replaced or extended.

## Styling

The template ships with a pre-configured styling profile (CSS, Tailwind, or UnoCSS). The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template vite-solid-router
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
