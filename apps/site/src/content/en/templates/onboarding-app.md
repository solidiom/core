---
contentSchemaVersion: 1
title: "Onboarding App"
description: "Onboarding application with multi-step wizards and guided setup."
keywords: [onboarding-app, template, starter, solid, onboarding]
locale: en
maturity: beta
product: "Onboarding App"
productLayer: template
status: published
package: "@solidiom/template-onboarding-app"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Onboarding App provides a production-ready starting point for guided user onboarding flows.

## Overview

This template scaffolds a complete project with welcome wizards, profile setup, and project creation steps pre-configured with Solidiom components and blocks.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-ONBOARD-01 (Welcome Wizard)
- BLOCK-ONBOARD-02 (Profile Setup)
- BLOCK-ONBOARD-03 (Project Starter)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template onboarding-app
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
