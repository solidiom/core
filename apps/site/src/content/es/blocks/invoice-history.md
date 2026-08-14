---
contentSchemaVersion: 1
title: Invoice History
description: "Bloque Invoice History para flujos de trabajo de billing."
keywords: [invoice-history, billing, bloque, invoice history]
locale: es
maturity: draft
product: Invoice History
productLayer: block
status: published
category: "BILLING"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "f83ffeb773d2058b174e3fe62b7634298e510b3d340e83796f8b6eb6f243b1e1"
translationStatus: draft
---

El bloque Invoice History proporciona un flujo de trabajo billing componible para gestionar operaciones de invoice history.

## Uso

Invoice History compone múltiples componentes de Solidiom en una interfaz billing cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de invoice history.

## Dependencias

Invoice History depende de los siguientes componentes:

- **Button**
- **Input**
- **Card**
- **Select**
- **Data Table**
- **Select**
- **Spinner**

## Estados

Invoice History implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Invoice History opera dentro del siguiente límite de datos: se comunica con el servicio billing relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Invoice History se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Invoice History delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
