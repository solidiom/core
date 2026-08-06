---
contentSchemaVersion: 1
title: "AI Chat"
description: "AI chat with conversational interface, prompts, and workflows."
keywords: [ai-chat, template, starter, solid, ai, chat]
locale: en
maturity: draft
product: "AI Chat"
productLayer: template
status: draft
package: "@solidiom/template-ai-chat"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

AI Chat provides a production-ready starting point for AI-powered conversational applications.

## Overview

This template scaffolds a complete AI chat interface with message history, prompt engineering workspace, and visual workflow builder.

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
solidiom create my-app --template ai-chat
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
