---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Label - Contrato de Accesibilidad
description: Responsabilidades de teclado, foco, semántica y del consumidor para Label.
keywords: [label, accesibilidad, wcag, lector-de-pantalla, formulario]
locale: es
maturity: draft
product: Label
productLayer: primitive
status: draft
package: "@solidiom/label"
primitive: label
section: accessibility
keyboard: []
focus: []
semantics:
  - Renderiza como un elemento nativo `<label>`.
  - Proporciona el nombre accesible para el control de formulario asociado mediante el par htmlFor/id.
aria:
  - No se requieren atributos ARIA adicionales; el elemento nativo `<label>` proporciona semántica suficiente.
consumerDuties:
  - Establecer htmlFor para que coincida con el id del control de formulario asociado.
  - Proporcionar un texto de etiqueta claro y conciso que describa el propósito del control de formulario.
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Label es un elemento de visualización no interactivo sin interacciones de teclado más allá del comportamiento nativo de hacer clic en la etiqueta para enfocar.
  - criterion: focus
    rationale: La etiqueta no recibe foco de teclado; es un elemento de asociación estática.
  - criterion: portalling
    rationale: Label no tiene requisitos de reubicación en el DOM.
reviewStatus: draft
translationSourceHash: "51c8d4279f3c2055df0de2bda8c6b7effc30630a06ad540419faac6929d15811"
translationStatus: draft
---
