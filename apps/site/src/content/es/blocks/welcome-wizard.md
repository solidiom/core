---
contentSchemaVersion: 1
title: Welcome Wizard
description: "Bloque Welcome Wizard para flujos de trabajo de onboard."
keywords: [welcome-wizard, onboard, bloque, welcome wizard]
locale: es
maturity: draft
product: Welcome Wizard
productLayer: block
status: published
category: "ONBOARD"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "fb6e49413eebcdfe208c61cf20a1dd887a6e79632c0a316e6475cc57ca4b5e39"
translationStatus: draft
---

El bloque Welcome Wizard proporciona un flujo de trabajo onboard componible para gestionar operaciones de welcome wizard.

## Uso

Welcome Wizard compone múltiples componentes de Solidiom en una interfaz onboard cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de welcome wizard.

## Dependencias

Welcome Wizard depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Tabs**
- **Progress**
- **Alert**
- **Navigation Menu**
- **Spinner**

## Estados

Welcome Wizard implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Welcome Wizard opera dentro del siguiente límite de datos: se comunica con el servicio onboard relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Welcome Wizard se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Welcome Wizard delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
