---
contentSchemaVersion: 1
title: Resource List
description: "Bloque Resource List para flujos de trabajo de resource."
keywords: [resource-list, resource, bloque, resource list]
locale: es
maturity: draft
product: Resource List
productLayer: block
status: draft
category: "RESOURCE"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "23b41fda6b52203ab603c6ea6fd1a30e62a4094a6a5bb5940c6241d555291536"
translationStatus: draft
---

El bloque Resource List proporciona un flujo de trabajo resource componible para gestionar operaciones de resource list.

## Uso

Resource List compone múltiples componentes de Solidiom en una interfaz resource cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de resource list.

## Dependencias

Resource List depende de los siguientes componentes:

- **Input**
- **Card**
- **Alert**
- **Avatar**
- **Badge**
- **Select**
- **Checkbox**
- **Data Table**
- **Select**
- **Spinner**

## Estados

Resource List implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Resource List opera dentro del siguiente límite de datos: se comunica con el servicio resource relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Resource List se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Resource List delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
