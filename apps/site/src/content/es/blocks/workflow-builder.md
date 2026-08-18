---
contentSchemaVersion: 1
title: Workflow Builder
description: "Bloque Workflow Builder para flujos de trabajo de ai."
keywords: [workflow-builder, ai, bloque, workflow builder]
locale: es
maturity: draft
product: Workflow Builder
productLayer: block
status: published
category: "AI"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "f2d604f540194fbb9203a141218cc3a6b73cacfd86852b6de6f2076ff4f505f2"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Workflow Builder proporciona un flujo de trabajo ai componible para gestionar operaciones de workflow builder.

## Uso

Workflow Builder compone múltiples componentes de Solidiom en una interfaz ai cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de workflow builder.

## Dependencias

Workflow Builder depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Data Table**
- **Toast**
- **Checkbox**
- **Switch**
- **Progress**
- **Spinner**

## Estados

Workflow Builder implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Workflow Builder opera dentro del siguiente límite de datos: se comunica con el servicio ai relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Workflow Builder se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Workflow Builder delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
