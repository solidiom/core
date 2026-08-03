---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Alert - Contrato de accesibilidad
description: Teclado, enfoque, semántica y responsabilidades del consumidor para Alert.
keywords:
  [alert, accesibilidad, región-en-vivo, lector-de-pantalla, aria-label, role-alert, role-status]
locale: es
maturity: draft
product: Alert
productLayer: primitive
status: draft
package: "@solidiom/alert"
primitive: alert
section: accessibility
keyboard: []
focus: []
semantics:
  - 'Renders Root como un `<div>` con `role="alert"` (assertive) o `role="status"` (polite).'
  - "Title se renderiza como un `<h5>` y se conecta a `aria-labelledby` en el Root."
  - "Description se renderiza como un `<div>` y se conecta a `aria-describedby` en el Root."
  - "Los IDs se generan con `createStableId` para consistencia compatible con SSR."
  - 'Lleva los atributos `data-scope="alert"`, `data-part` y `data-state` en todas las partes.'
aria:
  - '`role="alert"` indica una región en vivo asertiva que interrumpe al usuario para anunciar el mensaje inmediatamente.'
  - '`role="status"` indica una región en vivo cortés que anuncia el mensaje en la siguiente oportunidad sin interrupción.'
  - "`aria-labelledby` en Root referencia el ID estable de Title para proporcionar un nombre para el alert."
  - "`aria-describedby` en Root referencia el ID estable de Description para proporcionar una descripción para el alert."
consumerDuties:
  - Siempre incluir un Title para que los lectores de pantalla puedan anunciar un nombre significativo para el alert.
  - 'Usar `assertiveness="polite"` para actualizaciones no urgentes como cambios de estado o notificaciones.'
  - 'Usar `assertiveness="assertive"` (default) para información crítica que requiere atención inmediata.'
  - "No eliminar y recrear programáticamente el alert para volver a anunciar; usar un role polite o gestionar cambios de `aria-live` en su lugar."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Alert es un elemento de presentación no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Alert es un elemento de presentación no interactivo y no recibe enfoque. Anuncia contenido a las tecnologías de asistencia sin robar el enfoque.
reviewStatus: draft
translationSourceHash: "cc1300313105dfc71b69aed921d661136cd07954e39746c76401d6d857e83b7e"
translationStatus: draft
---
