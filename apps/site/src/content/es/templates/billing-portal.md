---
contentSchemaVersion: 1
title: "Billing Portal"
description: "Portal de facturación con suscripciones, pagos y facturas."
keywords: [billing-portal, plantilla, inicio, solid, facturacion]
locale: es
maturity: beta
product: "Billing Portal"
productLayer: template
status: published
package: "@solidiom/template-billing-portal"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "e0b2ae65ec9cdcb516630222632741e28e24cbd60f5a7da1a024193129774991"
translationStatus: draft
---

Billing Portal proporciona un punto de partida listo para producción para gestión de suscripciones y pagos.

## Resumen

Esta plantilla crea una interfaz completa de facturación con comparación de planes, gestión de métodos de pago e historial de facturas.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-BILLING-01 (Subscription Plans)
- BLOCK-BILLING-02 (Payment Method)
- BLOCK-BILLING-03 (Invoice History)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template billing-portal
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
