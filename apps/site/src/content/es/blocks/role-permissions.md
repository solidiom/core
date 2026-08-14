---
contentSchemaVersion: 1
title: Role Permissions
description: "Bloque Role Permissions para flujos de trabajo de admin."
keywords: [role-permissions, admin, bloque, role permissions]
locale: es
maturity: draft
product: Role Permissions
productLayer: block
status: published
category: "ADMIN"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "f99ebfd0f57c2b29e7e0fba9c42b1f7c1ae2dbd6a892cb1fc4520597a3a18f24"
translationStatus: draft
---

El bloque Role Permissions proporciona un flujo de trabajo admin componible para gestionar operaciones de role permissions.

## Uso

Role Permissions compone múltiples componentes de Solidiom en una interfaz admin cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de role permissions.

## Dependencias

Role Permissions depende de los siguientes componentes:

- **Button**
- **Field**
- **Card**
- **Alert**
- **Dialog**
- **Tabs**
- **Checkbox**
- **Radio Group**
- **Switch**
- **Select**
- **Data Table**
- **Spinner**

## Estados

Role Permissions implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Role Permissions opera dentro del siguiente límite de datos: se comunica con el servicio admin relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Role Permissions se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Role Permissions delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
