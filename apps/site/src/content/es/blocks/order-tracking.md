---
contentSchemaVersion: 1
title: Order Tracking
description: "Bloque Order Tracking para flujos de trabajo de commerce."
keywords: [order-tracking, commerce, bloque, order tracking]
locale: es
maturity: draft
product: Order Tracking
productLayer: block
status: published
category: "COMMERCE"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "14cc59850c86dace8b853fee2c51833ace4e12b83dcde19662d66588983af59b"
translationStatus: draft
---

El bloque Order Tracking proporciona un flujo de trabajo commerce componible para gestionar operaciones de order tracking.

## Uso

Order Tracking compone múltiples componentes de Solidiom en una interfaz commerce cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de order tracking.

## Dependencias

Order Tracking depende de los siguientes componentes:

- **Button**
- **Input**
- **Card**
- **Alert**
- **Tabs**
- **Badge**
- **Breadcrumb**
- **Select**
- **Data Table**
- **Progress**
- **Spinner**

## Estados

Order Tracking implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Order Tracking opera dentro del siguiente límite de datos: se comunica con el servicio commerce relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Order Tracking se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Order Tracking delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
