---
contentSchemaVersion: 1
title: "Authentication Starter"
description: "Authentication starter with sign-in, sign-up, and password reset flows."
keywords: [auth-starter, template, starter, solid, authentication]
locale: en
maturity: beta
product: "Authentication Starter"
productLayer: template
status: published
package: "@solidiom/template-auth-starter"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Authentication Starter provides a production-ready starting point for Solid projects with complete authentication flows.

## Overview

This template scaffolds a complete project with sign-in, sign-up, and password reset pages pre-configured with Solidiom components and blocks.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-AUTH-02 (Sign Up)
- BLOCK-AUTH-03 (Reset Password)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template auth-starter
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
