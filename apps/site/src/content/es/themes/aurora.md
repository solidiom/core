---
contentSchemaVersion: 1
title: Tema Aurora
description: A vibrant purple and pink gradient palette.
keywords: [aurora, tema, preset, tokens, estilos]
locale: es
maturity: draft
product: Aurora
productLayer: theme
status: draft
themeSchemaVersion: 1
outputs: ["css", "tailwind"]
translationSourceHash: "5926998784e78ee73cacb99830c3ccef059fb05659614a428ca8f14efc639043"
translationStatus: draft
---

A vibrant purple and pink gradient palette.

## Resumen

Aurora es un tema preset que proporciona un conjunto completo de tokens de diseño para los perfiles de estilo css, tailwind. Incluye paletas de modo claro y oscuro, escalas de tipografía, espaciado y estados interactivos.

## Paleta

Aurora define una paleta de colores semántica completa que incluye capas de superficie, colores de primer plano, acciones primarias/secundarias y estados semánticos (éxito, advertencia, destructivo). La paleta está diseñada para el cumplimiento del contraste WCAG AA en ambos modos claro y oscuro.

## Tipografía

El tema hereda la configuración de fuentes del proyecto y aplica una escala tipográfica de seis pasos (xs, sm, base, md, lg, xl) con alturas de línea emparejadas. El texto de encabezado y cuerpo sigue las convenciones de tipos de Solidiom.

## Tokens

Aurora expone tokens semánticos a través de propiedades CSS personalizadas:

- Superficie: `--sol-surface`, `--sol-surface-raised`, `--sol-surface-overlay`, `--sol-surface-sunken`
- Primer plano: `--sol-foreground`, `--sol-foreground-muted`, `--sol-foreground-subtle`
- Primario: `--sol-primary`, `--sol-primary-hover`, `--sol-primary-foreground`
- Estados: `--sol-success`, `--sol-warning`, `--sol-destructive`
- Radio: `--sol-radius-sm`, `--sol-radius`, `--sol-radius-lg`, `--sol-radius-full`

## Salidas

Aurora se entrega en los siguientes formatos de salida:

- **css** — Hoja de estilo con propiedades CSS personalizadas
- **tailwind** — Mapeo de configuración Tailwind CSS

## Instalación

```sh
pnpm add @solidiom/themes
```

Importa el tema en el punto de entrada de tu proyecto y aplícalo a través de tu perfil de estilo elegido. El tema puede usarse de forma independiente o extenderse para crear un tema personalizado.
