---
contentSchemaVersion: 1
title: "Storefront"
description: "Tienda en línea con catálogo de productos, carrito y checkout."
keywords: [storefront, plantilla, inicio, solid, ecommerce, comercio, tienda]
locale: es
maturity: beta
product: "Storefront"
productLayer: template
status: published
package: "@solidiom/template-storefront"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "47f7905c7b106610298ece72e03f3775058005c89f223b6d18c6063d47d5fb12"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

Storefront proporciona un punto de partida listo para producción para construir experiencias de navegación y compra de productos e-commerce.

## Resumen

Esta plantilla crea una tienda en línea completa con una página de listado de productos con filtros por categoría y búsqueda, un carrito de compras con gestión de cantidades y códigos de descuento, y un flujo de checkout multi-paso con envío y pago.

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
solidiom create my-app --template storefront
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
