---
contentSchemaVersion: 1
title: Sign Up
description: "Bloque Sign Up para flujos de trabajo de auth."
keywords: [sign-up, auth, bloque, sign up]
locale: es
maturity: draft
product: Sign Up
productLayer: block
status: published
category: "AUTH"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "3b971f1116c70f89b01d9a5e7abc409f0564cb2f7990e2634f03cc09b9d772f9"
translationStatus: draft
---

El bloque Sign Up proporciona un flujo de trabajo auth componible para gestionar operaciones de sign up.

## Uso

Sign Up compone múltiples componentes de Solidiom en una interfaz auth cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de sign up.

## Dependencias

Sign Up depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Toast**
- **Spinner**

## Estados

Sign Up implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Sign Up opera dentro del siguiente límite de datos: se comunica con el servicio auth relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Sign Up se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Sign Up delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
