---
contentSchemaVersion: 1
title: Command Palette
description: "Bloque Command Palette para flujos de trabajo de shell."
keywords: [command-palette-shell, shell, bloque, command palette]
locale: es
maturity: draft
product: Command Palette
productLayer: block
status: published
category: "SHELL"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "26f2889ff8bbbde355e6d0ec6015ba30af24270b16dc515794f25d4e81bb48e7"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Command Palette proporciona un flujo de trabajo shell componible para gestionar operaciones de command palette shell.

## Uso

Command Palette compone múltiples componentes de Solidiom en una interfaz shell cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de command palette shell.

## Dependencias

Command Palette depende de los siguientes componentes:

- **Input**
- **Card**
- **Alert**
- **Avatar**
- **Command Palette**
- **Data Table**
- **Kbd**
- **Spinner**

## Estados

Command Palette implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Command Palette opera dentro del siguiente límite de datos: se comunica con el servicio shell relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Command Palette se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Command Palette delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
