---
contentSchemaVersion: 1
title: Search Analytics
description: "Bloque Search Analytics para flujos de trabajo de search."
keywords: [search-analytics, search, bloque, search analytics]
locale: es
maturity: draft
product: Search Analytics
productLayer: block
status: published
category: "SEARCH"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "1b51912a9e35c2f310bfe0a5e2d256e2d9a4ddfdea5a19dda9ca79109ce6d17e"
translationStatus: draft
---

El bloque Search Analytics proporciona un flujo de trabajo search componible para gestionar operaciones de search analytics.

## Uso

Search Analytics compone múltiples componentes de Solidiom en una interfaz search cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de search analytics.

## Dependencias

Search Analytics depende de los siguientes componentes:

- **Card**
- **Select**
- **Tabs**
- **Badge**
- **Data Table**
- **Meter**
- **Progress**
- **Spinner**

## Estados

Search Analytics implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Search Analytics opera dentro del siguiente límite de datos: se comunica con el servicio search relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Search Analytics se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Search Analytics delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
