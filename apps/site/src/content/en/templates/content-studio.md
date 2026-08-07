---
contentSchemaVersion: 1
title: "Content Studio"
description: "Content management studio with editor, library, and publishing workflow."
keywords: [content-studio, template, starter, solid, cms, editor, content]
locale: en
maturity: draft
product: "Content Studio"
productLayer: template
status: draft
package: "@solidiom/template-content-studio"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Content Studio provides a production-ready starting point for building content management and editorial publishing interfaces.

## Overview

This template scaffolds a complete content management studio with a rich text editor with formatting, media embedding, and version history, a content library for organizing assets and media, and a publishing workflow with drafts, review, and approval stages.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-CONTENT-01 (Content Editor)
- BLOCK-CONTENT-02 (Content Library)
- BLOCK-CONTENT-03 (Content Workflow)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template content-studio
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
