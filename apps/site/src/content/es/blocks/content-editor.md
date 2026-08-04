---
contentSchemaVersion: 1
title: Content Editor
description: "Bloque Content Editor para flujos de trabajo de content."
keywords: [content-editor, content, bloque, content editor]
locale: es
maturity: draft
product: Content Editor
productLayer: block
status: draft
category: "CONTENT"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "8d341eaa8177f53a28811368dec4e4dc6490001daf0af8d174c1abd73bf57f41"
translationStatus: draft
---

El bloque Content Editor proporciona un flujo de trabajo content componible para gestionar operaciones de content editor.

## Uso

Content Editor compone múltiples componentes de Solidiom en una interfaz content cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de content editor.

## Dependencias

Content Editor depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Select**
- **Tabs**
- **Toolbar**
- **Toast**
- **Data Table**
- **Spinner**

## Estados

Content Editor implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Content Editor opera dentro del siguiente límite de datos: se comunica con el servicio content relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Content Editor se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Content Editor delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
