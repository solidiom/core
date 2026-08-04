---
contentSchemaVersion: 1
title: Content Workflow
description: "Bloque Content Workflow para flujos de trabajo de content."
keywords: [content-workflow, content, bloque, content workflow]
locale: es
maturity: draft
product: Content Workflow
productLayer: block
status: draft
category: "CONTENT"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "0a1b1d99d051432e4316c935d4dcdc458f7f3d46c0853acc7f02d4a9dc0468a5"
translationStatus: draft
---

El bloque Content Workflow proporciona un flujo de trabajo content componible para gestionar operaciones de content workflow.

## Uso

Content Workflow compone múltiples componentes de Solidiom en una interfaz content cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de content workflow.

## Dependencias

Content Workflow depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Badge**
- **Toast**
- **Avatar**
- **Data Table**
- **Breadcrumb**
- **Spinner**

## Estados

Content Workflow implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Content Workflow opera dentro del siguiente límite de datos: se comunica con el servicio content relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Content Workflow se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Content Workflow delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
