---
contentSchemaVersion: 1
title: "Theming"
description: "Customize colors, typography, and spacing with theme presets or the visual builder."
keywords: [theming, themes, customization, presets, tokens, guide]
locale: es
maturity: beta
product: "Solidiom"
productLayer: guide
status: draft
translationSourceHash: "21419a26f3ad1ec39ac8355946327fe521ac59f17d42d6d69120e9232cf3ba5d"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Temas

El sistema de temas de Solidiom usa propiedades personalizadas de CSS para controlar colores, tipografía, espaciado y estados interactivos en todos los componentes.

## Presets de temas

Cinco temas se incluyen en `@solidiom/themes`:

| Preset           | Descripción              | Modos          |
| ---------------- | ------------------------ | -------------- |
| Solidiom Default | Base neutra              | Claro + Oscuro |
| Ocean            | Teal profundo y cian     | Claro + Oscuro |
| Forest           | Verdes terrosos          | Claro + Oscuro |
| Slate            | Grises neutros           | Claro + Oscuro |
| Aurora           | Púrpura y rosa vibrantes | Claro + Oscuro |

### Instalar un preset

Instala el paquete de temas e importa un punto de entrada CSS o Tailwind:

```sh
pnpm add @solidiom/themes
```

```css
@import "@solidiom/themes/css/ocean.css";
```

## Constructor de temas

El [Constructor de temas](/themes/builder/) visual te permite:

- Ajustar colores, tipografía, radio y espaciado en tiempo real
- Previsualizar los 32 componentes en modos claro y oscuro
- Exportar como variables CSS, configuración de Tailwind o un enlace compartible
- Importar temas existentes para modificarlos

## Temas personalizados

Crea un tema personalizado definiendo propiedades personalizadas de CSS:

```css
:root {
  --ui-primary: oklch(0.6 0.2 250);
  --ui-surface: oklch(0.98 0.005 250);
  --ui-fg: oklch(0.15 0.02 250);
  --ui-radius: 0.5rem;
}

:root[data-theme="dark"] {
  --ui-primary: oklch(0.7 0.18 250);
  --ui-surface: oklch(0.15 0.02 250);
  --ui-fg: oklch(0.92 0.01 250);
}
```

## Requisitos de contraste

Todos los tokens de tema deben cumplir los mínimos de contraste WCAG 2.2 AA:

- Texto del cuerpo: 4.5:1
- Componentes de UI: 3:1
- Indicadores de foco: 3:1

La auditoría de presets (`pnpm run audit:preset-themes`) valida estos ratios automáticamente.

## Modo oscuro

Los temas soportan modos claro y oscuro mediante el atributo `data-theme` o la media query `prefers-color-scheme`. Todos los presets incluyen ambos modos.
