---
contentSchemaVersion: 1
title: Dashboard Overview
description: "Bloque Dashboard Overview para flujos de trabajo de obs."
keywords: [dashboard-overview, obs, bloque, dashboard overview]
locale: es
maturity: draft
product: Dashboard Overview
productLayer: block
status: published
category: "OBS"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "f619d371ac0d0a300902540ec55741da320c7c0ba03d557f5d56d64c7a67f5cb"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Dashboard Overview proporciona un flujo de trabajo obs componible para gestionar operaciones de dashboard overview.

## Uso

Dashboard Overview compone múltiples componentes de Solidiom en una interfaz obs cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de dashboard overview.

## Dependencias

Dashboard Overview depende de los siguientes componentes:

- **Card**
- **Tabs**
- **Alert**
- **Badge**
- **Data Table**
- **Meter**
- **Progress**
- **Spinner**

## Estados

Dashboard Overview implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Dashboard Overview opera dentro del siguiente límite de datos: se comunica con el servicio obs relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Dashboard Overview se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Dashboard Overview delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
