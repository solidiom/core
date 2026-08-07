---
contentSchemaVersion: 1
title: "Identity & Access"
description: "Identity and access management with users, roles, and sessions."
keywords: [identity-access, template, starter, solid, iam, users, roles, enterprise]
locale: en
maturity: draft
product: "Identity & Access"
productLayer: template
status: draft
package: "@solidiom/template-identity-access"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
---

Identity & Access provides a production-ready starting point for building identity and access management consoles for enterprise organizations.

## Overview

This template scaffolds a complete IAM console with a user directory for provisioning, deactivating, and managing user profiles, a roles and permissions editor for defining RBAC policies, and a session monitor for reviewing active sessions and revoking tokens.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-AUTH-02 (Sign Up)
- BLOCK-AUTH-03 (Reset Password)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-ADMIN-01 (Team Management)
- BLOCK-ADMIN-02 (Role Management)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template identity-access
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
