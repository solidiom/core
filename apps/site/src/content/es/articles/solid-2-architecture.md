---
contentSchemaVersion: 1
title: "Building on Solid 2: Architecture Decisions"
description: "How Solidiom leverages Solid 2's fine-grained reactivity for accessible, performant UI primitives."
keywords: [solid-2, architecture, reactivity, signals, primitives, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [architecture, solid-2, reactivity]
translationSourceHash: "a6235813c14877df8aea29c99885b27868a3fa09bd3f4612e3a81432a893b57a"
translationStatus: draft
---

# Construido sobre Solid 2: Decisiones de Arquitectura

Solidiom está construido exclusivamente sobre Solid 2. Este artículo explica por qué, y cómo los primitivos reactivos del framework informan nuestra arquitectura de componentes.

## Por Qué Solid 2

El modelo de reactividad de grano fino de Solid elimina la sobrecarga de difusión del DOM virtual que otros frameworks acarrean. Para una biblioteca de componentes enfocada en accesibilidad y rendimiento, esto importa:

- **Sin renders desperdiciados** — solo los nodos DOM exactos afectados por un cambio de estado se actualizan
- **Temporización predecible** — los effects se ejecutan síncronamente después de los cambios de estado, haciendo la gestión del foco confiable
- **Runtime pequeño** — sin sobrecarga de reconciliador significa bundles más pequeños por primitivo
- **Composición sobre herencia** — los signals y stores se componen naturalmente sin infierno de proveedores

## Accesibilidad Reactiva

Las bibliotecas de componentes tradicionales luchan contra su framework para gestionar el foco. Cuando un diálogo se abre, la biblioteca debe asegurar que el foco se mueva dentro del diálogo _después_ de que se renderice. En React, esto requiere refs, effects y temporización cuidadosa. En Solid 2, el DOM se actualiza síncronamente:

```tsx
function openDialog() {
  setOpen(true)
  // DOM is already updated — focus management is immediate
  dialogRef.focus()
}
```

Este modelo síncrono es la razón por la que cada primitivo de Solidiom puede garantizar su contrato de teclado sin condiciones de carrera.

## Máquinas de Estado Impulsadas por Signals

Cada primitivo interactivo se modela como una máquina de estados impulsada por signals:

- **Disclosure** — el signal `open` impulsa accordion, dialog, popover, tooltip
- **Selección** — el signal `value` impulsa tabs, select, radio-group, listbox
- **Navegación** — el signal `activeIndex` impulsa menu, combobox, tree
- **Validación** — el signal `validity` impulsa field, input, controles de formulario

La máquina de estados es el primitivo. El estilizado es una capa separada (recetas) que lee los mismos signals a través de atributos de datos.

## Primitivos como Límites

Solidiom establece un límite firme entre primitivos y componentes estilizados:

- Los **primitivos** son dueños del comportamiento: máquinas de estado, manejo de teclado, atributos ARIA
- Las **recetas** son dueñas de la apariencia: colores, espaciado, tipografía, animaciones
- Las **plantillas** son dueñas de la composición: cómo los primitivos y recetas se combinan en páginas

Esta separación significa que puedes cambiar perfiles de estilizado (CSS, Tailwind, UnoCSS) sin tocar el comportamiento, y actualizar primitivos sin romper tu diseño.

## Qué Significa Esto para los Consumidores

1. **Sin capa de compatibilidad con React** — Solidiom es nativo de Solid, no un port
2. **Sin sobrecarga en runtime** — los primitivos se compilan a operaciones DOM directas
3. **Tamaños de bundle predecibles** — cada primitivo es independientemente tree-shakeable
4. **A prueba de futuro** — cuando Solid 2 llegue a estable, Solidiom se mueve con él
