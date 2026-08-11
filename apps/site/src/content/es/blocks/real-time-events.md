---
contentSchemaVersion: 1
title: Real-time Events
description: "Bloque Real-time Events para flujos de trabajo de obs."
keywords: [real-time-events, obs, bloque, real-time events]
locale: es
maturity: draft
product: Real-time Events
productLayer: block
status: published
category: "OBS"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "1ed49b76181a4e2d45cd6991dda7824ffe79ad9d6f9e4ef24fcae909e3a55743"
translationStatus: draft
---

El bloque Real-time Events proporciona un flujo de trabajo obs componible para gestionar operaciones de real time events.

## Uso

Real-time Events compone múltiples componentes de Solidiom en una interfaz obs cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de real time events.

## Dependencias

Real-time Events depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Avatar**
- **Checkbox**
- **Radio Group**
- **Switch**
- **Data Table**
- **Spinner**

## Estados

Real-time Events implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Real-time Events opera dentro del siguiente límite de datos: se comunica con el servicio obs relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Real-time Events se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Real-time Events delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
