---
contentSchemaVersion: 1
title: Project Starter
description: "Bloque Project Starter para flujos de trabajo de onboard."
keywords: [project-starter, onboard, bloque, project starter]
locale: es
maturity: draft
product: Project Starter
productLayer: block
status: published
category: "ONBOARD"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "9a6d5cdb7fcf6d7dcd80bb61f3f8036f73f88cab65485c7bc71e50fac118275e"
translationStatus: draft
---

El bloque Project Starter proporciona un flujo de trabajo onboard componible para gestionar operaciones de project starter.

## Uso

Project Starter compone múltiples componentes de Solidiom en una interfaz onboard cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de project starter.

## Dependencias

Project Starter depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Select**
- **Alert**
- **Spinner**

## Estados

Project Starter implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Project Starter opera dentro del siguiente límite de datos: se comunica con el servicio onboard relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Project Starter se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Project Starter delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
