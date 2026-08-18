---
contentSchemaVersion: 1
title: "Marketplace"
description: "Marketplace multi-vendedor con navegación, panel de vendedor y detalle de listado."
keywords: [marketplace, plantilla, inicio, solid, ecommerce, vendedores, listados]
locale: es
maturity: beta
product: "Marketplace"
productLayer: template
status: published
package: "@solidiom/template-marketplace"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "d53cdd0bd361517e638dbc1b6baeaf5ad24e8b0119c6bfd4495a2f6fe0271b53"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Marketplace proporciona un punto de partida listo para producción para construir plataformas de comercio multi-vendedor con descubrimiento de productos y herramientas para vendedores.

## Resumen

Esta plantilla crea una aplicación de marketplace completa con una experiencia de navegación de productos de múltiples vendedores, un panel de vendedor para gestionar listados y ver analíticas, y una página de detalle de listado con imágenes, reseñas y opciones de compra.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-COMMERCE-01 (Product Catalog)
- BLOCK-COMMERCE-02 (Shopping Cart)
- BLOCK-COMMERCE-03 (Order Tracking)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template marketplace
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
