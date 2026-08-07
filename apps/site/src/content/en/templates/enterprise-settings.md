---
contentSchemaVersion: 1
title: "Enterprise Settings"
description: "Enterprise settings with organization config, security, and integrations."
keywords: [enterprise-settings, template, starter, solid, settings, enterprise, sso]
locale: en
maturity: draft
product: "Enterprise Settings"
productLayer: template
status: draft
package: "@solidiom/template-enterprise-settings"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Enterprise Settings provides a production-ready starting point for building organization-level administration consoles with security, identity, and integration management.

## Overview

This template scaffolds a complete enterprise settings application with an organization settings page for profile, branding, and domain verification, a security settings page for SSO, MFA enforcement, session policies, and IP allowlists, and an integrations page for SCIM provisioning, SAML, directory sync, and webhooks.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-SETTINGS-01 (Account Settings)
- BLOCK-SETTINGS-02 (Notification Settings)
- BLOCK-SETTINGS-03 (Danger Zone)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template enterprise-settings
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
