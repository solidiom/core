---
contentSchemaVersion: 1
title: "AI Workflow"
description: "AI workflow automation with pipeline builder, model registry, and execution logs."
keywords: [ai-workflow, template, starter, solid, ai, pipelines, automation]
locale: en
maturity: draft
product: "AI Workflow"
productLayer: template
status: draft
package: "@solidiom/template-ai-workflow"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

AI Workflow provides a production-ready starting point for building multi-step AI pipeline automation interfaces.

## Overview

This template scaffolds a complete AI workflow management application with a visual pipeline builder for composing multi-step AI workflows, a model registry for managing and versioning AI models, and an execution log viewer for monitoring pipeline runs.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-AI-01 (Chat Interface)
- BLOCK-AI-02 (Prompt Studio)
- BLOCK-AI-03 (Workflow Builder)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template ai-workflow
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
