---
contentSchemaVersion: 1
title: Profile Setup
description: "Bloque Profile Setup para flujos de trabajo de onboard."
keywords: [profile-setup, onboard, bloque, profile setup]
locale: es
maturity: draft
product: Profile Setup
productLayer: block
status: published
category: "ONBOARD"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "15b5d542152cb4594b00aeacd69b527594e6cb5a9c617da51cbb3555ddb4f84f"
translationStatus: draft
---

El bloque Profile Setup proporciona un flujo de trabajo onboard componible para gestionar operaciones de profile setup.

## Uso

Profile Setup compone múltiples componentes de Solidiom en una interfaz onboard cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de profile setup.

## Dependencias

Profile Setup depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Toast**
- **Avatar**
- **Spinner**

## Estados

Profile Setup implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Profile Setup opera dentro del siguiente límite de datos: se comunica con el servicio onboard relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Profile Setup se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Profile Setup delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
