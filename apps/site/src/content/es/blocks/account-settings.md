---
contentSchemaVersion: 1
title: Account Settings
description: "Bloque Account Settings para flujos de trabajo de settings."
keywords: [account-settings, settings, bloque, account settings]
locale: es
maturity: draft
product: Account Settings
productLayer: block
status: draft
category: "SETTINGS"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "9e9d885c0801deb7f7e08a9f1a381efc907cfa395983cccd307ef609aedb3850"
translationStatus: draft
---

El bloque Account Settings proporciona un flujo de trabajo settings componible para gestionar operaciones de account settings.

## Uso

Account Settings compone múltiples componentes de Solidiom en una interfaz settings cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de account settings.

## Dependencias

Account Settings depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Tabs**
- **Alert**
- **Toast**
- **Avatar**
- **Spinner**

## Estados

Account Settings implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Account Settings opera dentro del siguiente límite de datos: se comunica con el servicio settings relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Account Settings se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Account Settings delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
