---
contentSchemaVersion: 1
title: Tema Slate
description: A neutral monochrome palette with stone tones.
keywords: [slate, tema, preset, tokens, estilos]
locale: es
maturity: draft
product: Slate
productLayer: theme
status: draft
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
translationSourceHash: "f76489c1e14d163de9b0fa009e8b176f5c3127417fefeb38ca32780ab6ac7886"
translationStatus: draft
---

A neutral monochrome palette with stone tones.

## Resumen

Slate es un tema preset que proporciona un conjunto completo de tokens de diseño para los perfiles de estilo css, tailwind. Incluye paletas de modo claro y oscuro, escalas de tipografía, espaciado y estados interactivos.

## Paleta

Slate define una paleta de colores semántica completa que incluye capas de superficie, colores de primer plano, acciones primarias/secundarias y estados semánticos (éxito, advertencia, destructivo). La paleta está diseñada para el cumplimiento del contraste WCAG AA en ambos modos claro y oscuro.

## Tipografía

El tema hereda la configuración de fuentes del proyecto y aplica una escala tipográfica de seis pasos (xs, sm, base, md, lg, xl) con alturas de línea emparejadas. El texto de encabezado y cuerpo sigue las convenciones de tipos de Solidiom.

## Tokens

Slate expone tokens semánticos a través de propiedades CSS personalizadas:

- Superficie: `--sol-surface`, `--sol-surface-raised`, `--sol-surface-overlay`, `--sol-surface-sunken`
- Primer plano: `--sol-foreground`, `--sol-foreground-muted`, `--sol-foreground-subtle`
- Primario: `--sol-primary`, `--sol-primary-hover`, `--sol-primary-foreground`
- Estados: `--sol-success`, `--sol-warning`, `--sol-destructive`
- Radio: `--sol-radius-sm`, `--sol-radius`, `--sol-radius-lg`, `--sol-radius-full`

## Salidas

Slate se entrega en los siguientes formatos de salida:

- **css** — Hoja de estilo con propiedades CSS personalizadas
- **tailwind** — Mapeo de configuración Tailwind CSS

## Instalación

```sh
pnpm add @solidiom/themes
```

Importa el tema en el punto de entrada de tu proyecto y aplícalo a través de tu perfil de estilo elegido. El tema puede usarse de forma independiente o extenderse para crear un tema personalizado.
