---
contentSchemaVersion: 1
title: "Styling-System Neutrality"
description: "How Solidiom supports CSS, Tailwind, and UnoCSS without favoring any single approach."
keywords: [styling, css, tailwind, unocss, recipes, neutrality, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [styling, tailwind, architecture]
translationSourceHash: "44f10bc82b67ff8f663b51802cfb70b5096b8ab43afa3c2803c7d42c11ca54b6"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

# Neutralidad del Sistema de Estilos

Solidiom no toma partido en el debate CSS-vs-Tailwind-vs-utilidades. Soporta los tres con igual fidelidad a través del sistema de recetas.

## El Problema

La mayoría de las bibliotecas de componentes fuerzan una elección de estilizado:

- Las bibliotecas de Tailwind requieren Tailwind
- Las bibliotecas CSS-in-JS requieren un runtime
- Las bibliotecas headless no te dan nada — estilizas todo desde cero

Los equipos cambian de opinión. Los proyectos tienen restricciones. Una biblioteca no debería ser la restricción.

## La Arquitectura de Recetas

Solidiom separa el comportamiento del estilizado a nivel de arquitectura:

```
Primitive (behavior) → Recipe (styling) → Component (composed)
```

- Los **primitivos** usan atributos de datos semánticos (`data-state`, `data-disabled`, `data-expanded`)
- Las **recetas** apuntan a esos atributos con reglas de estilo
- Los **componentes** componen primitivos + recetas en unidades instalables

Se incluyen tres perfiles de receta:

| Perfil     | Tecnología   | Foco                                               |
| ---------- | ------------ | -------------------------------------------------- |
| `css`      | CSS puro     | Clases tipo BEM + selectores de atributos de datos |
| `tailwind` | Tailwind CSS | Clases de utilidad + `@apply` para estados         |
| `unocss`   | UnoCSS       | Utilidades atómicas + reglas personalizadas        |

## Cómo Se Aplica la Paridad

La auditoría de paridad de recetas (`pnpm run audit:recipe-parity`) asegura:

1. Los tres perfiles cubren los mismos slots de primitivo
2. Los tres perfiles manejan los mismos estados (hover, foco, disabled, loading, error)
3. La salida visual es equivalente entre perfiles (verificado por comparación de computed-style)
4. Ningún perfil tiene funciones que los otros carezcan

Esto significa que cambiar de Tailwind a CSS puro es un cambio de configuración, no una reescritura.

## Elegir un Perfil

Establece tu perfil una vez en `.solidiom/config.json`:

```json
{
  "stylingProfile": "tailwind"
}
```

O por comando:

```sh
solidiom add button --styling css
```

## La Capa de Temas

Los temas son agnósticos al perfil. El mismo preset de tema (Ocean, Forest, Slate, Aurora) funciona de manera idéntica en los tres perfiles de estilizado porque los temas definen propiedades personalizadas CSS, no clases de utilidad.

```css
/* Works with any profile */
:root {
  --sol-color-primary: oklch(0.6 0.2 250);
}
```

## Extender Recetas

Las recetas tienen propiedad del codigo fuente. Para personalizar:

1. Instala en modo fuente: `solidiom add button --source`
2. Modifica el archivo de receta directamente
3. El estilizado permanece conectado a los atributos de datos del primitivo

Nunca estás atrapado en nuestras decisiones de diseño. La receta es un punto de partida, no una jaula.

## Optimización en Tiempo de Compilación

La Fase 3A introduce transformaciones opcionales en tiempo de compilación:

- **Extracción de recetas** — mueve los estilos de receta a CSS estático en tiempo de build
- **Eliminación de partes muertas** — elimina slots de componente no utilizados del bundle
- **Expansión de variantes** — pre-calcula combinaciones de variantes

Estas optimizaciones funcionan de manera idéntica en los tres perfiles porque operan sobre el contrato de atributos de datos, no sobre detalles de implementación de estilizado.
