---
contentSchemaVersion: 1
title: Notifications Center
description: "Bloque Notifications Center para flujos de trabajo de shell."
keywords: [notifications-center, shell, bloque, notifications center]
locale: es
maturity: draft
product: Notifications Center
productLayer: block
status: published
category: "SHELL"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "d9e68fb4c7fba49a0d079b5154e31610854b44d0a7bffd423556434dc94d9229"
translationStatus: draft
---

El bloque Notifications Center proporciona un flujo de trabajo shell componible para gestionar operaciones de notifications center.

## Uso

Notifications Center compone múltiples componentes de Solidiom en una interfaz shell cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de notifications center.

## Dependencias

Notifications Center depende de los siguientes componentes:

- **Button**
- **Card**
- **Alert**
- **Avatar**
- **Badge**
- **Toast**
- **Checkbox**
- **Data Table**
- **Select**
- **Spinner**

## Estados

Notifications Center implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Notifications Center opera dentro del siguiente límite de datos: se comunica con el servicio shell relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Notifications Center se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Notifications Center delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
