---
contentSchemaVersion: 1
title: "Content Studio"
description: "Estudio de gestión de contenido con editor, biblioteca y flujo de publicación."
keywords: [content-studio, plantilla, inicio, solid, cms, editor, contenido]
locale: es
maturity: beta
product: "Content Studio"
productLayer: template
status: published
package: "@solidiom/template-content-studio"
stack: vite-solid-router
portfolios: ["balanced-product"]
translationSourceHash: "8925fc5c985b15f9723df6bcc888f15a8603b1881309875bff1c7e6671715cda"
translationStatus: draft
---

Content Studio proporciona un punto de partida listo para producción para construir interfaces de gestión de contenido y publicación editorial.

## Resumen

Esta plantilla crea un estudio completo de gestión de contenido con un editor de texto enriquecido con formato, incrustación de medios e historial de versiones, una biblioteca de contenido para organizar activos y medios, y un flujo de publicación con borradores, revisión y etapas de aprobación.

## Stack

- **Framework:** Vite + Solid Router
- **Enrutamiento:** Enrutamiento basado en archivos con Solid Router
- **Renderizado:** Renderizado del lado del cliente
- **Herramienta de construcción:** Vite

## Bloques requeridos

- BLOCK-AUTH-01 (Sign In)
- BLOCK-SHELL-01 (Navigation Layout)
- BLOCK-CONTENT-01 (Content Editor)
- BLOCK-CONTENT-02 (Content Library)
- BLOCK-CONTENT-03 (Content Workflow)

## Estilos

La plantilla se entrega con un perfil de estilo Tailwind pre-configurado. El sistema de temas permite cambiar entre presets sin modificar el código de los componentes.

## Instalación

```sh
solidiom create my-app --template content-studio
```

Pasa `--yes` para saltar los prompts y `--styling` para seleccionar un perfil de estilo.

## Despliegue

Despliega la salida estática a cualquier CDN o plataforma de alojamiento estático. Vercel, Netlify y Cloudflare Pages son destinos soportados.
