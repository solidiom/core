---
contentSchemaVersion: 1
title: Audit Log
description: "Bloque Audit Log para flujos de trabajo de admin."
keywords: [audit-log, admin, bloque, audit log]
locale: es
maturity: draft
product: Audit Log
productLayer: block
status: published
category: "ADMIN"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "e563d167441780077ac965a27a9ec2eac2cc16653e5ea4fb4e91a777005b2b81"
translationStatus: draft
---

El bloque Audit Log proporciona un flujo de trabajo admin componible para gestionar operaciones de audit log.

## Uso

Audit Log compone múltiples componentes de Solidiom en una interfaz admin cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de audit log.

## Dependencias

Audit Log depende de los siguientes componentes:

- **Input**
- **Card**
- **Select**
- **Checkbox**
- **Data Table**
- **Progress**
- **Select**
- **Spinner**

## Estados

Audit Log implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Audit Log opera dentro del siguiente límite de datos: se comunica con el servicio admin relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Audit Log se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Audit Log delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
