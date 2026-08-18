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
translationSourceHash: "52d0c06814511c1ab99c7c3529ac42b57b86ba5976d093c038cb822f4fd415ef"
translationStatus: draft
---

# Temas

El sistema de temas de Solidiom usa propiedades personalizadas de CSS para controlar colores, tipografía, espaciado y estados interactivos en todos los componentes.

## Presets de temas

Cuatro presets se incluyen de serie:

| Preset | Descripción              | Modos          |
| ------ | ------------------------ | -------------- |
| Ocean  | Teal profundo y cian     | Claro + Oscuro |
| Forest | Verdes terrosos          | Claro + Oscuro |
| Slate  | Grises neutros           | Claro + Oscuro |
| Aurora | Púrpura y rosa vibrantes | Claro + Oscuro |

### Instalar un preset

```sh
npx solidiom add --theme ocean
```

O importar directamente:

```css
@import "@solidiom/themes/css/ocean.css";
```

```css
/* Tailwind profile */
@import "@solidiom/themes/tailwind/ocean.css";
```

## Constructor de temas

El [Constructor de temas](/themes/builder/) visual te permite:

- Ajustar colores, tipografía, radio y espaciado en tiempo real
- Previsualizar los 30 componentes en modos claro y oscuro
- Exportar como variables CSS, configuración de Tailwind o un enlace compartible
- Importar temas existentes para modificarlos

## Temas personalizados

Crea un tema personalizado definiendo propiedades personalizadas de CSS:

```css
:root {
  --sol-color-primary: oklch(0.6 0.2 250);
  --sol-color-surface: oklch(0.98 0.005 250);
  --sol-color-text: oklch(0.15 0.02 250);
  --sol-radius-md: 0.5rem;
  --sol-font-sans: "Inter", system-ui, sans-serif;
}

[data-theme="dark"] {
  --sol-color-primary: oklch(0.7 0.18 250);
  --sol-color-surface: oklch(0.15 0.02 250);
  --sol-color-text: oklch(0.92 0.01 250);
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
