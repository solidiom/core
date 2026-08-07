---
contentSchemaVersion: 1
title: "Billing Operations"
description: "Operaciones de facturación con facturas, conciliación e informes financieros."
keywords: [billing-operations, plantilla, inicio, solid, facturación, facturas, enterprise]
locale: es
maturity: draft
product: "Billing Operations"
productLayer: template
status: draft
package: "@solidiom/template-billing-operations"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "5a61499dc3114a6348110b57008aa6d40a60c4def35083b3be3054b4deb08fc3"
translationStatus: draft
---

Billing Operations proporciona un punto de partida listo para producción para construir consolas internas de gestión de facturación y operaciones financieras.

## Resumen

Esta plantilla crea una aplicación completa de operaciones de facturación con una vista de gestión de facturas para crear, rastrear y resolver facturas, un panel de conciliación para emparejar pagos y resolver discrepancias, e informes financieros con resúmenes de ingresos, informes de antigüedad y dashboards.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-BILLING-01 (Plan Selection)
- BLOCK-BILLING-02 (Payment Method)
- BLOCK-BILLING-03 (Invoice History)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template billing-operations
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
