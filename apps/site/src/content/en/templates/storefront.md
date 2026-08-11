---
contentSchemaVersion: 1
title: "Storefront"
description: "E-commerce storefront with product catalog, cart, and checkout."
keywords: [storefront, template, starter, solid, ecommerce, commerce, shop]
locale: en
maturity: beta
product: "Storefront"
productLayer: template
status: published
package: "@solidiom/template-storefront"
stack: vite-solid-router
portfolios: ["balanced-product"]
---

Storefront provides a production-ready starting point for building e-commerce product browsing and purchase experiences.

## Overview

This template scaffolds a complete e-commerce storefront with a product listing page with category filters and search, a shopping cart with quantity management and discount codes, and a multi-step checkout flow with shipping and payment.

## Stack

- **Framework:** Vite + Solid Router
- **Routing:** File-based routing with Solid Router
- **Rendering:** Client-side rendering
- **Build tool:** Vite

## Required Blocks

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-COMMERCE-01 (Product Catalog)
- BLOCK-COMMERCE-02 (Shopping Cart)
- BLOCK-COMMERCE-03 (Order Tracking)

## Styling

The template ships with a pre-configured Tailwind styling profile. The theme system allows switching between presets without modifying component code.

## Installation

```sh
solidiom create my-app --template storefront
```

Pass `--yes` to skip prompts and `--styling` to select a styling profile.

## Deployment

Deploy the static output to any CDN or static hosting platform. Vercel, Netlify, and Cloudflare Pages are supported targets.
