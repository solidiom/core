---
contentSchemaVersion: 1
title: Product Catalog
description: "Bloque Product Catalog para flujos de trabajo de commerce."
keywords: [product-catalog, commerce, bloque, product catalog]
locale: es
maturity: draft
product: Product Catalog
productLayer: block
status: draft
category: "COMMERCE"
requiredStates: ["loading", "empty", "error", "restricted"]
translationSourceHash: "871bac7e1b5189ffff045f14d4187c27a2a91a3556b238d219596dcd3d1245d8"
translationStatus: draft
---

El bloque Product Catalog proporciona un flujo de trabajo commerce componible para gestionar operaciones de product catalog.

## Uso

Product Catalog compone múltiples componentes de Solidiom en una interfaz commerce cohesiva. Gestiona transiciones de estado, obtención de datos e interacciones del usuario específicas para flujos de product catalog.

## Dependencias

Product Catalog depende de los siguientes componentes:

- **Button**
- **Input**
- **Card**
- **Alert**
- **Select**
- **Avatar**
- **Checkbox**
- **Data Table**
- **Select**
- **Spinner**

## Estados

Product Catalog implementa los siguientes estados:

- **Loading**
- **Empty**
- **Error**
- **Restricted**

Cada estado se renderiza con indicadores visuales y retroalimentación del usuario apropiados.

## Límite de datos

Product Catalog opera dentro del siguiente límite de datos: se comunica con el servicio commerce relevante a través de APIs bien definidas. El bloque no persiste datos más allá de su alcance de sesión; todo el estado se deriva de la capa de servicio o la interacción del usuario.

## Instalación

```sh
pnpm add @solidiom/recipes-css
```

Instala los paquetes de receta requeridos y las dependencias de componentes listadas arriba.

## Diseño

Product Catalog se renderiza como un contenedor responsivo con un encabezado, área de contenido y pie de acciones. Soporta diseños de página completa e insertados, adaptándose al espacio disponible del viewport.

## Accesibilidad

Product Catalog delega la accesibilidad a sus componentes subyacentes. La navegación por teclado sigue los contratos a nivel de componente, y el bloque proporciona landmarks, encabezados y atributos ARIA apropiados para su estructura compuesta.
