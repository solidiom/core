---
contentSchemaVersion: 1
title: "Data Governance"
description: "Gobernanza de datos con catálogo, linaje y políticas de clasificación."
keywords: [data-governance, plantilla, inicio, solid, datos, catálogo, linaje, enterprise]
locale: es
maturity: draft
product: "Data Governance"
productLayer: template
status: draft
package: "@solidiom/template-data-governance"
stack: vite-solid-router
portfolios: ["enterprise"]
translationSourceHash: "e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7"
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
