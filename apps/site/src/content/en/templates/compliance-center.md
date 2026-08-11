---
contentSchemaVersion: 1
title: "Compliance Center"
description: "Compliance center with framework tracking, control assessments, and evidence."
keywords: [compliance-center, template, starter, solid, compliance, audit, enterprise]
locale: en
maturity: beta
product: "Compliance Center"
productLayer: template
status: published
package: "@solidiom/template-compliance-center"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Compliance Center provides a production-ready starting point for building compliance management consoles with framework tracking, control assessments, and audit evidence collection.

## Overview

This template scaffolds a complete compliance center with framework tracking across SOC 2, ISO 27001, HIPAA, and custom compliance frameworks, control assessments for evaluating effectiveness, assigning owners, and tracking remediation, and an evidence collection interface for organizing and reviewing audit artifacts.

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
solidiom create my-app --template compliance-center
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
