---
contentSchemaVersion: 1
title: Shopping Cart
description: "Bloque Shopping Cart para flujos de trabajo de commerce."
keywords: [shopping-cart, commerce, bloque, shopping cart]
locale: es
maturity: draft
product: Shopping Cart
productLayer: block
status: published
category: "COMMERCE"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "b033b64025737cf3ee0be5270c854be3a3a5acd68becb800f103c69497dbecc1"
translationStatus: draft
---

El bloque Shopping Cart proporciona un flujo de trabajo commerce componible para gestionar operaciones de shopping cart.

## Uso

Shopping Cart compone múltiples componentes de Solidiom en una interfaz commerce cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de shopping cart.

## Dependencias

Shopping Cart depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Avatar**
- **Select**
- **Toast**
- **Switch**
- **Data Table**
- **Spinner**

## Estados

Shopping Cart implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Shopping Cart opera dentro del siguiente límite de datos: se comunica con el servicio commerce relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Shopping Cart se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Shopping Cart delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
