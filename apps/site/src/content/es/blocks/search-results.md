---
contentSchemaVersion: 1
title: Search Results
description: "Bloque Search Results para flujos de trabajo de search."
keywords: [search-results, search, bloque, search results]
locale: es
maturity: draft
product: Search Results
productLayer: block
status: published
category: "SEARCH"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "edb53692d395f8399e78409bcf4b3e3a1fc60035c41504d807a06afd7701b7df"
translationStatus: draft
---

El bloque Search Results proporciona un flujo de trabajo search componible para gestionar operaciones de search results.

## Uso

Search Results compone múltiples componentes de Solidiom en una interfaz search cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de search results.

## Dependencias

Search Results depende de los siguientes componentes:

- **Input**
- **Card**
- **Alert**
- **Select**
- **Checkbox**
- **Breadcrumb**
- **Select**
- **Data Table**
- **Spinner**

## Estados

Search Results implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Search Results opera dentro del siguiente límite de datos: se comunica con el servicio search relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Search Results se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Search Results delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
