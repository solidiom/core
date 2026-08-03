---
contentSchemaVersion: 1
title: Alert
description: Alerta en línea, no modal, para mensajes de estado con semántica de región en vivo.
keywords:
  [alert, notificación, estado, región-en-vivo, accesibilidad, info, éxito, advertencia, error]
locale: es
maturity: draft
product: Alert
productLayer: primitive
status: draft
package: "@solidiom/alert"
primitive: alert
section: overview
translationSourceHash: "670555b2a7b5b783a4c63bcf445fbfab6086a709ff0227529d002183874fa58e"
translationStatus: draft
notApplicable:
  - section: composition
    reason: Primitivo autónomo sin sub-primitivos compuestos.
  - section: relationships
    reason: Sin primitivos hermanos; se usa dentro de otras composiciones pero no posee un contrato inter-primitivo.
  - section: migration
    reason: Sin API previa; esta es la primera versión publicada.
  - section: testing
    reason: La guía estándar de pruebas cubre este primitivo. No existe comportamiento no obvio específico.
---

Alert renderiza un área de notificación en línea, no modal, con semántica de región en vivo de ARIA. Soporta cuatro variantes visuales (info, success, warning, error) y dos niveles de asertividad (assertive, polite) para controlar cómo los lector de pantalla anuncian el mensaje. Las partes Title y Description se conectan automáticamente mediante `aria-labelledby` y `aria-describedby` usando IDs estables compatibles con SSR.

## Uso

Alert se compone de tres partes compusables: `Root`, `Title` y `Description`. Configura la variante y la asertividad a través de props en `Root`.

```tsx
import * as Alert from "@solidiom/alert"

;<Alert.Root type="info">
  <Alert.Title>Información</Alert.Title>
  <Alert.Description>Este es un mensaje informativo.</Alert.Description>
</Alert.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/alert`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Props

### Root

| Prop            | Tipo                                          | Default       | Descripción                                                                                                                                               |
| --------------- | --------------------------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type`          | `"info" \| "success" \| "warning" \| "error"` | `"info"`      | Variante del alert que controla la apariencia visual.                                                                                                     |
| `assertiveness` | `"assertive" \| "polite"`                     | `"assertive"` | Asertividad de la región en vivo. Assertive usa `role="alert"` e interrumpe al usuario. Polite usa `role="status"` y anuncia en la siguiente oportunidad. |

### Title

| Prop       | Tipo          | Default | Descripción                                     |
| ---------- | ------------- | ------- | ----------------------------------------------- |
| `children` | `JSX.Element` | —       | Texto del título. Requerido para accesibilidad. |

### Description

| Prop       | Tipo          | Default | Descripción                                 |
| ---------- | ------------- | ------- | ------------------------------------------- |
| `children` | `JSX.Element` | —       | Texto del cuerpo para el mensaje del alert. |

## Estilos

Alert lleva los atributos `data-scope="alert"`, `data-part` y `data-state` para hooks de estilizado.

| Parte       | `data-part`   | `data-state`                                     |
| ----------- | ------------- | ------------------------------------------------ |
| Root        | `root`        | Variante (`info`, `success`, `warning`, `error`) |
| Title       | `title`       | —                                                |
| Description | `description` | —                                                |

Aplica tu receta visual usando los atributos data para seleccionar. Root se renderiza como un `<div>`, Title como un `<h5>`, y Description como un `<div>`.

## Interacción con teclado

Este primitivo no tiene interacción con teclado. Renderiza contenido estático que no recibe foco ni responde a eventos de teclado.

## Renderizado SSR e hidratación

Alert usa `createStableId` para generación de IDs compatibles con SSR, asegurando que las referencias de `aria-labelledby` y `aria-describedby` sean consistentes entre los renders del servidor y del cliente.
