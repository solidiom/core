---
contentSchemaVersion: 1
title: Saved Searches
description: "Bloque Saved Searches para flujos de trabajo de search."
keywords: [saved-searches, search, bloque, saved searches]
locale: es
maturity: draft
product: Saved Searches
productLayer: block
status: draft
category: "SEARCH"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "cd4a21063db87a0cc47618b6e4f01d44dc01519b5baa256feca551bbb73a776d"
translationStatus: draft
---

El bloque Saved Searches proporciona un flujo de trabajo search componible para gestionar operaciones de saved searches.

## Uso

Saved Searches compone múltiples componentes de Solidiom en una interfaz search cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de saved searches.

## Dependencias

Saved Searches depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Checkbox**
- **Switch**
- **Data Table**
- **Spinner**

## Estados

Saved Searches implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Saved Searches opera dentro del siguiente límite de datos: se comunica con el servicio search relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Saved Searches se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Saved Searches delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
