---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Acordeón - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Acordeón.
keywords: [acordeón, accesibilidad, wcag, aria, teclado, enfoque]
locale: es
maturity: draft
product: Accordion
productLayer: primitive
status: draft
package: "@solidiom/accordion"
primitive: accordion
section: accessibility
keyboard:
  - key: ArrowDown
    behavior: Mueve el enfoque al disparador del siguiente elemento.
  - key: ArrowUp
    behavior: Mueve el enfoque al disparador del elemento anterior.
  - key: Home
    behavior: Mueve el enfoque al disparador del primer elemento.
  - key: End
    behavior: Mueve el enfoque al disparador del último elemento.
  - key: Space or Enter
    behavior: Alterna el estado expandido del elemento enfocado.
  - key: Tab
    behavior: Mueve el enfoque fuera del grupo de disparadores del acordeón.
focus:
  - El enfoque se confina a los disparadores dentro del grupo de disparadores del acordeón.
  - Después de abrir o cerrar un elemento, el enfoque permanece en el disparador.
semantics:
  - Root se renderiza como un grupo de elementos de acordeón.
  - Trigger tiene role button y controla el estado expandido de su elemento.
  - Content tiene role region y está oculto para tecnología de asistencia cuando está colapsado.
aria:
  - Trigger tiene aria-expanded reflejando el estado abierto/cerrado de su elemento.
  - Trigger tiene aria-controls apuntando al id de su elemento de contenido.
  - Content tiene aria-labelledby apuntando al id de su elemento disparador.
consumerDuties:
  - Proporcionar una etiqueta única y descriptiva para cada Trigger.
  - Asegurar que Content sea significativo cuando sea anunciado por tecnología de asistencia.
  - Usar collapsible para acordeones donde ningún elemento necesita permanecer permanentemente abierto.
nonApplicableCriteria: []
reviewStatus: draft
translationSourceHash: "61750e4a2508d6f40051318ba0590edf9c03f19218c6f1143d4420686fc4626a"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

## Atributos de datos

Acordeón emite atributos de datos para estilo y decisiones basadas en estado:

| Atributo        | Valores                                      | Descripción                                                     |
| --------------- | -------------------------------------------- | --------------------------------------------------------------- |
| `data-scope`    | `"accordion"`                                | Identifica el elemento como perteneciente al primitivo Acordeón |
| `data-part`     | `"root"`, `"item"`, `"trigger"`, `"content"` | Identifica la parte específica                                  |
| `data-state`    | `"open"`, `"closed"`                         | Presente en Item; refleja estado expandido                      |
| `data-expanded` | `"true"`, `"false"`                          | Presente en Trigger; espejo del estado expandido                |
| `data-disabled` | `""` o ausente                               | Presente cuando el elemento está deshabilitado                  |
