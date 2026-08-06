---
contentSchemaVersion: 1
title: "Settings Portal"
description: "Settings portal with account, notifications, and danger zone."
keywords: [settings-portal, template, starter, solid, settings]
locale: en
maturity: draft
product: "Settings Portal"
productLayer: template
status: draft
package: "@solidiom/template-settings-portal"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Settings Portal provides a production-ready starting point for application settings management.

## Overview

This template scaffolds a complete settings interface with account management, notification preferences, and destructive action confirmation flows.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SETTINGS-01 (Account Settings)
- BLOCK-SETTINGS-02 (Notification Preferences)
- BLOCK-SETTINGS-03 (Danger Zone)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template settings-portal
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
