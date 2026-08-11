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
translationSourceHash: "de5d84e730f995da22dc98832334afacd8baf16265f59100402b65b36c1ae587"
translationStatus: draft
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

- Superficie: `--sol-surface`, `--sol-surface-raised`, `--sol-surface-overlay`, `--sol-surface-sunken`
- Primer plano: `--sol-foreground`, `--sol-foreground-muted`, `--sol-foreground-subtle`
- Primario: `--sol-primary`, `--sol-primary-hover`, `--sol-primary-foreground`
- Estados: `--sol-success`, `--sol-warning`, `--sol-destructive`
- Radio: `--sol-radius-sm`, `--sol-radius`, `--sol-radius-lg`, `--sol-radius-full`

## Salidas

Forest se entrega en los siguientes formatos de salida:

- **css** — Hoja de estilo con propiedades CSS personalizadas
- **tailwind** — Mapeo de configuración Tailwind CSS

## Instalación

```sh
pnpm add @solidiom/themes
```

Importa el tema en el punto de entrada de tu proyecto y aplícalo a través de tu perfil de estilo elegido. El tema puede usarse de forma independiente o extenderse para crear un tema personalizado.
