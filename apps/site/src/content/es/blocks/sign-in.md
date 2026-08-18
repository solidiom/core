---
contentSchemaVersion: 1
title: Sign In
description: "Bloque Sign In para flujos de trabajo de auth."
keywords: [sign-in, auth, bloque, sign in]
locale: es
maturity: draft
product: Sign In
productLayer: block
status: published
category: "AUTH"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "154cdf17563c8ed3a4768ceccec5ff8f54161c0866df6af13c37cefe814e8587"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Sign In proporciona un flujo de trabajo auth componible para gestionar operaciones de sign in.

## Uso

Sign In compone múltiples componentes de Solidiom en una interfaz auth cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de sign in.

## Dependencias

Sign In depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Label**
- **Spinner**

## Estados

Sign In implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Sign In opera dentro del siguiente límite de datos: se comunica con el servicio auth relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Sign In se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Sign In delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
