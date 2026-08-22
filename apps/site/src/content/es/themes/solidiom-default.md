---
contentSchemaVersion: 1
title: Tema Solidiom Default
description: The canonical Solidiom theme with a cool slate canvas and indigo primary.
keywords: [solidiom-default, tema, preset, tokens, estilos]
locale: es
maturity: beta
product: Solidiom Default
productLayer: theme
status: published
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
translationSourceHash: "6e41548dc0ad84372fae42e030c338dbaf0763199dd521dcb5f42e4d3d6b2ebb"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

The canonical Solidiom theme with a cool slate canvas and indigo primary.

## Resumen

Solidiom Default es un tema preset que proporciona un conjunto completo de tokens de diseño para los perfiles de estilo css, tailwind. Incluye paletas de modo claro y oscuro, escalas de tipografía, espaciado y estados interactivos.

## Paleta

Solidiom Default define una paleta de colores semántica completa que incluye capas de superficie, colores de primer plano, acciones primarias/secundarias y estados semánticos (éxito, advertencia, destructivo). La paleta está diseñada para el cumplimiento del contraste WCAG AA en ambos modos claro y oscuro.

## Tipografía

El tema hereda la configuración de fuentes del proyecto y aplica una escala tipográfica de seis pasos (xs, sm, base, md, lg, xl) con alturas de línea emparejadas. El texto de encabezado y cuerpo sigue las convenciones de tipos de Solidiom.

## Tokens

Solidiom Default expone tokens semánticos a través de propiedades CSS personalizadas:

- Superficie: `--ui-surface`, `--ui-surface-raised`, `--ui-surface-overlay`, `--ui-surface-sunken`
- Primer plano: `--ui-foreground`, `--ui-foreground-muted`, `--ui-foreground-subtle`
- Primario: `--ui-primary`, `--ui-primary-hover`, `--ui-primary-foreground`
- Estados: `--ui-success`, `--ui-warning`, `--ui-destructive`
- Radio: `--ui-radius-sm`, `--ui-radius`, `--ui-radius-lg`, `--ui-radius-full`

## Salidas

Solidiom Default se entrega en los siguientes formatos de salida:

- **css** — Hoja de estilo con propiedades CSS personalizadas
- **tailwind** — Mapeo de configuración Tailwind CSS

## Instalación

```sh
pnpm add @solidiom/themes
```

Importa el tema en el punto de entrada de tu proyecto y aplícalo a través de tu perfil de estilo elegido. El tema puede usarse de forma independiente o extenderse para crear un tema personalizado.
