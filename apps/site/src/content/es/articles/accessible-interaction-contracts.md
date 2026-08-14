---
contentSchemaVersion: 1
title: "Accessible Interaction Contracts"
description: "How Solidiom defines, implements, and verifies keyboard and ARIA contracts for every primitive."
keywords: [accessibility, contracts, keyboard, aria, apg, testing, article]
locale: es
maturity: draft
product: "Solidiom"
productLayer: article
status: draft
date: "2026-08-07"
authors:
  - solidiom-core
tags: [accessibility, contracts, a11y]
translationSourceHash: "0a57c634687fb61e4169f800f123b91486594175c1333b66e5d7347902ea4fbc"
translationStatus: draft
---

# Contratos de Interacción Accesible

Cada primitivo de Solidiom incluye un contrato de interacción documentado. Este artículo explica qué significa eso y cómo lo aplicamos.

## ¿Qué es un Contrato de Interacción?

Un contrato de interacción define:

1. **Comportamiento de teclado** — qué teclas hacen qué, en qué estados
2. **Semántica ARIA** — qué roles, estados y propiedades se aplican
3. **Gestión del foco** — hacia dónde se mueve el foco al abrir, cerrar y navegar
4. **Anuncios del lector de pantalla** — qué se comunica a la tecnología de asistencia

Estos contratos no son documentación aspiracional. Son verificados por máquina.

## Estructura del Contrato

Cada primitivo tiene un archivo de contrato en `packages/<name>/docs/accessibility/contract.md` con:

```markdown
## Keyboard Interactions

| Key         | Action                      |
| ----------- | --------------------------- |
| Enter/Space | Toggle accordion item       |
| Arrow Down  | Move focus to next item     |
| Arrow Up    | Move focus to previous item |
| Home        | Move focus to first item    |
| End         | Move focus to last item     |

## ARIA Attributes

| Attribute       | Element       | Value      |
| --------------- | ------------- | ---------- |
| role="region"   | Content panel | —          |
| aria-expanded   | Trigger       | true/false |
| aria-controls   | Trigger       | Panel ID   |
| aria-labelledby | Panel         | Trigger ID |
```

## Capas de Aplicación

### 1. Automatizada (axe-core)

Cada primitivo es escaneado por axe-core en un navegador real. El escaneo verifica:

- No faltan atributos ARIA
- No hay combinaciones de roles inválidas
- No faltan nombres accesibles
- Jerarquía correcta de encabezados
- Contraste de color (mediante auditoría de tema)

### 2. Estructural (TypeScript)

El helper `applySemanticAttrs` garantiza que los primitivos apliquen atributos de datos de forma consistente. Los genéricos de TypeScript aseguran que se pasen los props ARIA correctos:

```tsx
// Compile error if required ARIA attributes are missing
<Dialog.Content aria-labelledby={titleId} aria-describedby={descId}>
```

### 3. Comportamental (Pruebas de teclado)

Las pruebas en navegador simulan la navegación por teclado y verifican:

- El foco se mueve al elemento correcto
- Las regiones en vivo del lector de pantalla se actualizan
- Las transiciones de estado coinciden con el contrato documentado

### 4. Evidencia (Artefactos comprometidos)

`packages/<name>/docs/accessibility/evidence.json` registra los resultados del último escaneo. La puerta del catálogo de primitivos (`PRIM-000`) rechaza cualquier primitivo donde `passes === 0`.

## Por Qué Contratos, No Directrices

Las directrices son sugerencias. Los contratos se aplican:

- Un primitivo no puede pasar la puerta del catálogo sin evidencia
- Una receta no puede publicarse sin que se cumpla el contrato del primitivo subyacente
- Una plantilla no puede declarar una dependencia de bloque sin que los primitivos de ese bloque estén verificados

Esta cadena de dependencias verificadas significa que cuando instalas una plantilla de Solidiom, cada elemento interactivo en ella tiene evidencia de accesibilidad comprobada.

## Limitaciones

- Los contratos verifican _estructura_, no _experiencia_ — la experiencia real de un usuario de lector de pantalla requiere pruebas humanas
- VoiceOver es la única tecnología de asistencia actualmente probada; NVDA/JAWS/TalkBack son trabajo de la Fase 4
- El contenido dinámico con tiempos (por ejemplo, auto-cierre de toast) tiene resultados `incomplete` de axe, no violaciones
