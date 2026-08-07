---
contentSchemaVersion: 1
title: "Security Center"
description: "Security center with threat dashboard, vulnerabilities, and policy management."
keywords: [security-center, template, starter, solid, security, threats, enterprise]
locale: en
maturity: draft
product: "Security Center"
productLayer: template
status: draft
package: "@solidiom/template-security-center"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Security Center provides a production-ready starting point for building security operations consoles with threat visibility, vulnerability management, and policy enforcement.

## Overview

This template scaffolds a complete security center with a real-time threat dashboard with severity distribution and active alerts, a vulnerability scanner view with CVE details, affected assets, and remediation guidance, and a policy management interface for defining, enforcing, and auditing security policies.

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
solidiom create my-app --template security-center
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
