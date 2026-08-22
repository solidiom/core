---
contentSchemaVersion: 1
title: Tema Forest
description: An earthy green palette with warm undertones.
keywords: [forest, tema, preset, tokens, estilos]
locale: es
maturity: beta
product: Forest
productLayer: theme
status: published
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
translationSourceHash: "2608af2a8b9757b3f131edf62acbc122b650c2492f8d9f7f506d846555951792"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

An earthy green palette with warm undertones.

## Resumen

Forest es un tema preset que proporciona un conjunto completo de tokens de diseño para los perfiles de estilo css, tailwind. Incluye paletas de modo claro y oscuro, escalas de tipografía, espaciado y estados interactivos.

## Paleta

Forest define una paleta de colores semántica completa que incluye capas de superficie, colores de primer plano, acciones primarias/secundarias y estados semánticos (éxito, advertencia, destructivo). La paleta está diseñada para el cumplimiento del contraste WCAG AA en ambos modos claro y oscuro.

## Tipografía

El tema hereda la configuración de fuentes del proyecto y aplica una escala tipográfica de seis pasos (xs, sm, base, md, lg, xl) con alturas de línea emparejadas. El texto de encabezado y cuerpo sigue las convenciones de tipos de Solidiom.

## Tokens

Forest expone tokens semánticos a través de propiedades CSS personalizadas:

- Superficie: `--ui-surface`, `--ui-surface-raised`, `--ui-surface-overlay`, `--ui-surface-sunken`
- Primer plano: `--ui-foreground`, `--ui-foreground-muted`, `--ui-foreground-subtle`
- Primario: `--ui-primary`, `--ui-primary-hover`, `--ui-primary-foreground`
- Estados: `--ui-success`, `--ui-warning`, `--ui-destructive`
- Radio: `--ui-radius-sm`, `--ui-radius`, `--ui-radius-lg`, `--ui-radius-full`

## Salidas

Forest se entrega en los siguientes formatos de salida:

- **css** — Hoja de estilo con propiedades CSS personalizadas
- **tailwind** — Mapeo de configuración Tailwind CSS

## Instalación

```sh
pnpm add @solidiom/themes
```

Importa el tema en el punto de entrada de tu proyecto y aplícalo a través de tu perfil de estilo elegido. El tema puede usarse de forma independiente o extenderse para crear un tema personalizado.
