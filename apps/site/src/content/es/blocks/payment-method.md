---
contentSchemaVersion: 1
title: Payment Method
description: "Bloque Payment Method para flujos de trabajo de billing."
keywords: [payment-method, billing, bloque, payment method]
locale: es
maturity: draft
product: Payment Method
productLayer: block
status: published
category: "BILLING"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "17cfd62804b87cfb1bf8b8a734a23f74816347d32b847fe4db313ad28d43a47e"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Payment Method proporciona un flujo de trabajo billing componible para gestionar operaciones de payment method.

## Uso

Payment Method compone múltiples componentes de Solidiom en una interfaz billing cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de payment method.

## Dependencias

Payment Method depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Select**
- **Toast**
- **Spinner**

## Estados

Payment Method implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Payment Method opera dentro del siguiente límite de datos: se comunica con el servicio billing relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Payment Method se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Payment Method delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
