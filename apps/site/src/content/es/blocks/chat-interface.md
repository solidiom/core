---
contentSchemaVersion: 1
title: Chat Interface
description: "Bloque Chat Interface para flujos de trabajo de ai."
keywords: [chat-interface, ai, bloque, chat interface]
locale: es
maturity: draft
product: Chat Interface
productLayer: block
status: published
category: "AI"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "07e313e6a8b154ce0bf782756e9a46fae8a78034e3951ac4d8dd48c299788d58"
translationStatus: draft
---

El bloque Chat Interface proporciona un flujo de trabajo ai componible para gestionar operaciones de chat interface.

## Uso

Chat Interface compone múltiples componentes de Solidiom en una interfaz ai cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de chat interface.

## Dependencias

Chat Interface depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Avatar**
- **Toast**
- **Data Table**
- **Toolbar**
- **Spinner**

## Estados

Chat Interface implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Chat Interface opera dentro del siguiente límite de datos: se comunica con el servicio ai relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Chat Interface se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Chat Interface delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
