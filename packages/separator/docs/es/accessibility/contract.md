---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Separator - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Separator.
keywords: [separator, accesibilidad, divisor, lector-de-pantalla, aria-orientation]
locale: es
maturity: draft
product: Separator
productLayer: primitive
status: draft
package: "@solidiom/separator"
primitive: separator
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Se renderiza como un `<div>` con `role="separator"` y `aria-orientation` por defecto.'
  - 'Cuando `decorative` es true, se renderiza con `role="none"` y sin `aria-orientation`, eliminándolo del árbol de accesibilidad.'
  - 'Lleva los atributos `data-scope="separator"`, `data-part="root"` y `data-orientation`.'
aria:
  - '`role="separator"` indica un divisor visual entre regiones de contenido.'
  - '`aria-orientation="horizontal"` o `aria-orientation="vertical"` especifica la orientación del divisor. Por defecto es horizontal.'
  - 'Cuando `decorative` es true, se usa `role="none"` en su lugar para ocultar el elemento de las tecnologías de asistencia.'
consumerDuties:
  - Usar Separator para dividir regiones de contenido lógicamente distintas.
  - "Establecer `decorative` cuando el divisor es puramente visual y no separa secciones de contenido significativas."
  - 'Usar `orientation="vertical"` solo cuando el separador divide visualmente el contenido lado a lado.'
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Separator es un elemento de presentación no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Separator es un elemento de presentación no interactivo y no recibe enfoque.
reviewStatus: draft
translationSourceHash: "a253649248ff85c4feeff3ac985829b838edc63b398c94c49ac3dbbc4d712c83"
translationStatus: draft
---
