---
contentSchemaVersion: 1
title: Navigation Layout
description: "Bloque Navigation Layout para flujos de trabajo de shell."
keywords: [navigation-layout, shell, bloque, navigation layout]
locale: es
maturity: draft
product: Navigation Layout
productLayer: block
status: published
category: "SHELL"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "4cac3052f0aa31e48cf57b3ca408a7bf91324d0bfb8f93956ccf990530b6caf3"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Navigation Layout proporciona un flujo de trabajo shell componible para gestionar operaciones de navigation layout.

## Uso

Navigation Layout compone múltiples componentes de Solidiom en una interfaz shell cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de navigation layout.

## Dependencias

Navigation Layout depende de los siguientes componentes:

- **Button**
- **Alert**
- **Avatar**
- **Badge**
- **Breadcrumbs**
- **Checkbox**
- **Data Table**
- **Navigation Menu**
- **Breadcrumb**
- **Accordion**
- **Spinner**

## Estados

Navigation Layout implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Navigation Layout opera dentro del siguiente límite de datos: se comunica con el servicio shell relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Navigation Layout se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Navigation Layout delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
