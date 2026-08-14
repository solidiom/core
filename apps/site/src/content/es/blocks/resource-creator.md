---
contentSchemaVersion: 1
title: Resource Creator
description: "Bloque Resource Creator para flujos de trabajo de resource."
keywords: [resource-creator, resource, bloque, resource creator]
locale: es
maturity: draft
product: Resource Creator
productLayer: block
status: published
category: "RESOURCE"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "8daeb61c7e3a9a0ea0e08342cc4146ae4d0bd91be26f99beaf6d0621d7f8ad8a"
translationStatus: draft
---

El bloque Resource Creator proporciona un flujo de trabajo resource componible para gestionar operaciones de resource creator.

## Uso

Resource Creator compone múltiples componentes de Solidiom en una interfaz resource cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de resource creator.

## Dependencias

Resource Creator depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Toast**
- **Checkbox**
- **Switch**
- **Breadcrumb**
- **Progress**
- **Spinner**

## Estados

Resource Creator implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Resource Creator opera dentro del siguiente límite de datos: se comunica con el servicio resource relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Resource Creator se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Resource Creator delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
