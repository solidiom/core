---
contentSchemaVersion: 1
title: Content Library
description: "Bloque Content Library para flujos de trabajo de content."
keywords: [content-library, content, bloque, content library]
locale: es
maturity: draft
product: Content Library
productLayer: block
status: published
category: "CONTENT"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "a1c65ca6ec83c007ce5f79f426796a08214a8a9124167a2782260d65e912537a"
translationStatus: draft
---

El bloque Content Library proporciona un flujo de trabajo content componible para gestionar operaciones de content library.

## Uso

Content Library compone múltiples componentes de Solidiom en una interfaz content cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de content library.

## Dependencias

Content Library depende de los siguientes componentes:

- **Button**
- **Input**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Badge**
- **Select**
- **Checkbox**
- **Data Table**
- **Select**
- **Progress**
- **Spinner**

## Estados

Content Library implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Content Library opera dentro del siguiente límite de datos: se comunica con el servicio content relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Content Library se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Content Library delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
