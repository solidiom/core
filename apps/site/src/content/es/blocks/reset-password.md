---
contentSchemaVersion: 1
title: Reset Password
description: "Bloque Reset Password para flujos de trabajo de auth."
keywords: [reset-password, auth, bloque, reset password]
locale: es
maturity: draft
product: Reset Password
productLayer: block
status: published
category: "AUTH"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "07f69561ac015f7ce2102e5e3b8cf1dc25352ec16ce7ff510854e149242a46a4"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El bloque Reset Password proporciona un flujo de trabajo auth componible para gestionar operaciones de reset password.

## Uso

Reset Password compone múltiples componentes de Solidiom en una interfaz auth cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de reset password.

## Dependencias

Reset Password depende de los siguientes componentes:

- **Button**
- **Input**
- **Field**
- **Card**
- **Alert**
- **Toast**
- **Spinner**

## Estados

Reset Password implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Reset Password opera dentro del siguiente límite de datos: se comunica con el servicio auth relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Reset Password se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Reset Password delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
