---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Kbd - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Kbd.
keywords: [kbd, accesibilidad, teclado, lector-de-pantalla]
locale: es
maturity: draft
product: Kbd
productLayer: primitive
status: draft
package: "@solidiom/kbd"
primitive: kbd
section: accessibility
keyboard: []
focus: []
semantics:
  - Se renderiza como un elemento nativo `<kbd>` que indica entrada de teclado.
  - No tiene comportamiento interactivo y no recibe enfoque de teclado.
aria:
  - No se requieren atributos ARIA; el elemento nativo `<kbd>` proporciona semántica suficiente.
consumerDuties:
  - Usar Kbd para representar teclas de teclado reales o atajos.
  - Asegurar que el texto circundante proporcione contexto sobre lo que hace la combinación de teclas.
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Kbd es un elemento de presentación no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Kbd es un elemento de presentación no interactivo y no recibe enfoque.
reviewStatus: draft
translationSourceHash: "506bf5e38f7c0b68c6f1cc58d64d8f353c87b84308158b897f3ac504ecd96819"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---
