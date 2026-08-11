---
contentSchemaVersion: 1
title: Subscription Plans
description: "Bloque Subscription Plans para flujos de trabajo de billing."
keywords: [subscription-plans, billing, bloque, subscription plans]
locale: es
maturity: draft
product: Subscription Plans
productLayer: block
status: published
category: "BILLING"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "b23917ece7b092bdf1b896884942662a761ac6b8e4fbf0cb1b91a6517175f726"
translationStatus: draft
---

El bloque Subscription Plans proporciona un flujo de trabajo billing componible para gestionar operaciones de subscription plans.

## Uso

Subscription Plans compone múltiples componentes de Solidiom en una interfaz billing cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de subscription plans.

## Dependencias

Subscription Plans depende de los siguientes componentes:

- **Button**
- **Card**
- **Alert**
- **Dialog**
- **Tabs**
- **Toast**
- **Checkbox**
- **Spinner**

## Estados

Subscription Plans implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Subscription Plans opera dentro del siguiente límite de datos: se comunica con el servicio billing relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Subscription Plans se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Subscription Plans delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
