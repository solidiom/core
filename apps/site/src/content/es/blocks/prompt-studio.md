---
contentSchemaVersion: 1
title: Prompt Studio
description: "Bloque Prompt Studio para flujos de trabajo de ai."
keywords: [prompt-studio, ai, bloque, prompt studio]
locale: es
maturity: draft
product: Prompt Studio
productLayer: block
status: draft
category: "AI"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "493360b73f9b2a9bacf5c2547414eb36c5e95624c561f985e4604e6b2e480d3a"
translationStatus: draft
---

El bloque Prompt Studio proporciona un flujo de trabajo ai componible para gestionar operaciones de prompt studio.

## Uso

Prompt Studio compone múltiples componentes de Solidiom en una interfaz ai cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de prompt studio.

## Dependencias

Prompt Studio depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Select**
- **Tabs**
- **Data Table**
- **Toast**
- **Checkbox**
- **Spinner**

## Estados

Prompt Studio implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Prompt Studio opera dentro del siguiente límite de datos: se comunica con el servicio ai relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Prompt Studio se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Prompt Studio delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
