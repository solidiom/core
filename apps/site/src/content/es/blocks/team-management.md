---
contentSchemaVersion: 1
title: Team Management
description: "Bloque Team Management para flujos de trabajo de admin."
keywords: [team-management, admin, bloque, team management]
locale: es
maturity: draft
product: Team Management
productLayer: block
status: published
category: "ADMIN"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "21c7a83fb7f65c37b2d1b7a577f79c5fdaa4effdafef51d0e3dfa5b8762ae06e"
translationStatus: draft
---

El bloque Team Management proporciona un flujo de trabajo admin componible para gestionar operaciones de team management.

## Uso

Team Management compone múltiples componentes de Solidiom en una interfaz admin cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de team management.

## Dependencias

Team Management depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Select**
- **Data Table**
- **Select**
- **Spinner**

## Estados

Team Management implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Team Management opera dentro del siguiente límite de datos: se comunica con el servicio admin relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Team Management se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Team Management delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
