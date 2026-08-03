---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Contrato de accesibilidad de Dialog
description: Responsabilidades de teclado, foco, semántica y consumidores para Dialog.
locale: es
maturity: beta
product: Dialog
productLayer: primitive
status: published
package: "@solidiom/dialog"
primitive: dialog
section: accessibility
keyboard:
  - key: Enter o Espacio
    behavior: Activa el disparador o una acción de cierre enfocada.
  - key: Escape
    behavior: Cierra el diálogo abierto y devuelve el foco a su disparador.
  - key: Tab y Shift+Tab
    behavior: Mantiene el foco dentro de un diálogo modal mientras está abierto.
focus:
  - Un Dialog modal mueve el foco a su contenido tras abrirse.
  - Un Dialog modal devuelve el foco al disparador después de cerrarse.
  - Los controles de fondo se aíslan mientras un Dialog modal está abierto.
semantics:
  - Content tiene role dialog y aria-modal=true para diálogos modales.
  - Title y Description se conectan a Content con aria-labelledby y aria-describedby.
aria:
  - Trigger expone aria-haspopup=dialog.
  - Trigger expone aria-expanded y aria-controls mientras el diálogo está abierto.
  - Backdrop se oculta de la tecnología de asistencia.
consumerDuties:
  - Proporciona Title y Description concisos para cada Dialog modal.
  - Mantén una acción de cierre visible y operable por teclado, salvo que el flujo tenga una excepción documentada.
  - Usa un alert dialog para confirmaciones que requieren una decisión explícita sobre una acción destructiva.
nonApplicableCriteria:
  - criterion: portalling
    rationale: El portalling nativo queda aplazado mientras las API Portal de Solid 2 sean inestables; el contrato de API no depende de la reubicación del DOM.
reviewStatus: reviewed
reviewedBy: Revisión de accesibilidad de Solidiom
reviewedAt: 2026-07-27T00:00:00.000Z
translationSourceHash: "b758c7d0d172415f0a3eabcf03bd0955ac6ba88c4c7afb68befdd77653506041"
translationStatus: draft
---

## Evidencia automatizada

El resumen de evidencias siguiente se genera a partir del análisis axe ejecutable del repositorio para `@solidiom/dialog`. Solo registra comprobaciones automatizadas; no afirma conformidad completa.

## Verificación manual

Revisa el cierre por teclado, la restauración del foco, el zoom/reflujo, los objetivos táctiles, el movimiento reducido, el contraste y los anuncios de lector de pantalla en el producto que lo consume. El diseño, las etiquetas y el flujo de un consumidor pueden cambiar el resultado de accesibilidad.
