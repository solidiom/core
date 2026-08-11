---
contentSchemaVersion: 1
title: Resource Detail
description: "Bloque Resource Detail para flujos de trabajo de resource."
keywords: [resource-detail, resource, bloque, resource detail]
locale: es
maturity: draft
product: Resource Detail
productLayer: block
status: published
category: "RESOURCE"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "90c522f68bccba21375df4db2527a7fb6791a40214596ebcf2f2917d7d169726"
translationStatus: draft
---

El bloque Resource Detail proporciona un flujo de trabajo resource componible para gestionar operaciones de resource detail.

## Uso

Resource Detail compone múltiples componentes de Solidiom en una interfaz resource cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de resource detail.

## Dependencias

Resource Detail depende de los siguientes componentes:

- **Button**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Tabs**
- **Toast**
- **Breadcrumb**
- **Data Table**
- **Spinner**

## Estados

Resource Detail implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Resource Detail opera dentro del siguiente límite de datos: se comunica con el servicio resource relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Resource Detail se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Resource Detail delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
