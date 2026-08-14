---
contentSchemaVersion: 1
title: "Data Governance"
description: "Gobernanza de datos con catálogo, linaje y políticas de clasificación."
keywords: [data-governance, plantilla, inicio, solid, datos, catálogo, linaje, enterprise]
locale: es
maturity: beta
product: "Data Governance"
productLayer: template
status: published
package: "@solidiom/template-data-governance"
stack: vite-solid-router
portfolios: ["enterprise-platform-governance"]
translationSourceHash: "e00361d0e24ee45c46c389c91a42b9d00f89565cb60b9a3ab55cc09671cae325"
translationStatus: draft
---

Data Governance proporciona un punto de partida listo para producción para construir plataformas de gobernanza de datos con descubrimiento, linaje y clasificación.

## Resumen

Esta plantilla crea una aplicación completa de gobernanza de datos con un catálogo de datos para descubrir, documentar y buscar activos de datos, un explorador de linaje para trazar el flujo de datos desde el origen al destino, y un gestor de políticas de clasificación para etiquetas de sensibilidad, reglas y retención.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-RESOURCE-01 (Resource List)
- BLOCK-RESOURCE-02 (Resource Detail)
- BLOCK-RESOURCE-03 (Resource Create)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template data-governance
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
