---
contentSchemaVersion: 1
title: Questionnaire
description: Flujo de formulario y encuesta de varios pasos con seguimiento del progreso.
keywords: [questionnaire, survey, multi-step, form, wizard, progress, steps]
locale: es
maturity: ga
product: Questionnaire
productLayer: primitive
status: draft
package: "@solidiom/questionnaire"
primitive: questionnaire
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "c1dd66140b3174d22fc5b0492248a23f9b9f4987cd5a90f0126836d36c9f4ea6"
translationStatus: "draft"
---

Questionnaire es un flujo de formulario y encuesta de varios pasos con seguimiento del progreso. Usa `createControllableValue` para gestionar el paso actual, con controles de navegación para moverse entre pasos y un control de envío para finalizar.

## Uso

Compón `Root`, `Step`, `StepTitle`, `StepContent`, `Navigation`, `NextButton`, `PrevButton`, `Progress` y `Submit`. NextButton y PrevButton cambian de paso, Progress muestra el avance y Submit finaliza.

```tsx
import * as Questionnaire from "@solidiom/questionnaire"

;<Questionnaire.Root>
  <Questionnaire.Progress />
  <Questionnaire.Step>
    <Questionnaire.StepTitle>Primer paso</Questionnaire.StepTitle>
    <Questionnaire.StepContent>{/* campos */}</Questionnaire.StepContent>
  </Questionnaire.Step>
  <Questionnaire.Navigation>
    <Questionnaire.PrevButton>Volver</Questionnaire.PrevButton>
    <Questionnaire.NextButton>Siguiente</Questionnaire.NextButton>
    <Questionnaire.Submit>Enviar</Questionnaire.Submit>
  </Questionnaire.Navigation>
</Questionnaire.Root>
```

## Instalación

Instala el paquete con `pnpm add @solidiom/questionnaire`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

questionnaire expone 9 partes:

- **Root** — contenedor que gestiona el estado del paso mediante `createControllableValue`.
- **Step** — un paso individual del flujo.
- **StepTitle** — título de un paso.
- **StepContent** — región de contenido de un paso.
- **Navigation** — contenedor de los controles de navegación.
- **NextButton** — avanza al paso siguiente.
- **PrevButton** — vuelve al paso anterior.
- **Progress** — muestra el avance entre los pasos.
- **Submit** — finaliza el cuestionario.

## Estilos

questionnaire incluye los atributos `data-scope="questionnaire"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

La navegación se controla con NextButton y PrevButton, que cambian de paso; Progress refleja el avance y Submit finaliza el flujo. El primitivo no define atajos de teclado adicionales.

## Composición

Compón primitivos de campos, entradas y botones dentro de cada `StepContent` para crear la encuesta; las partes de navegación coordinan el movimiento entre pasos.

## SSR e hidratación

El paso actual se renderiza como HTML estático en el servidor; la gestión del paso y los manejadores de navegación se activan durante la hidratación.
