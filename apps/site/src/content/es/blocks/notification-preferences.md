---
contentSchemaVersion: 1
title: Notification Preferences
description: "Bloque Notification Preferences para flujos de trabajo de settings."
keywords: [notification-preferences, settings, bloque, notification preferences]
locale: es
maturity: draft
product: Notification Preferences
productLayer: block
status: published
category: "SETTINGS"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "bdd5143e4428ac73e483cf9d72225396b5419d2638d16628c1e68a969dee8283"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Notification Preferences proporciona un flujo de trabajo settings componible para gestionar operaciones de notification preferences.

## Uso

Notification Preferences compone múltiples componentes de Solidiom en una interfaz settings cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de notification preferences.

## Dependencias

Notification Preferences depende de los siguientes componentes:

- **Button**
- **Field**
- **Card**
- **Tabs**
- **Checkbox**
- **Radio Group**
- **Switch**
- **Select**
- **Spinner**

## Estados

Notification Preferences implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Notification Preferences opera dentro del siguiente límite de datos: se comunica con el servicio settings relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Notification Preferences se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Notification Preferences delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
