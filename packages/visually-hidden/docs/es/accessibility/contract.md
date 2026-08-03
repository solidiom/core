---
contentSchemaVersion: 1
accessibilityContractSchemaVersion: 1
title: Visually Hidden - Contrato de accesibilidad
description: Semántica, lectores de pantalla y responsabilidades del consumidor para Visually Hidden.
keywords: [visually-hidden, accesibilidad, lector-de-pantalla, clip, tecnologia-asistiva]
locale: es
maturity: draft
product: Visually Hidden
productLayer: primitive
status: draft
package: "@solidiom/visually-hidden"
primitive: visually-hidden
section: accessibility
keyboard: []
focus: []
semantics:
  - "Se renderiza como un `<span>` con estilos en línea de recorte para ocultar contenido visualmente."
  - "El contenido permanece en el DOM y en el árbol de accesibilidad, accesible para lectores de pantalla."
  - "Lleva los atributos `data-scope=\"visually-hidden\"` y `data-part=\"root\"`."
aria:
  - "No añade roles ni atributos ARIA; se basa en la semántica natural del contenido envuelto."
  - "La técnica de clip/overflow asegura que el contenido sea invisible para usuarios videntes mientras permanece anunciado por lectores de pantalla."
consumerDuties:
  - Usar Visually Hidden solo para contenido que sea significativo para usuarios de lectores de pantalla.
  - "No usar Visually Hidden para ocultar contenido que debería ser visible para todos los usuarios."
  - "Asegurarse de que el contenido oculto proporcione valor a los usuarios de tecnologías de asistencia, como etiquetas descriptivas o encabezados estructurales."
nonApplicableCriteria:
  - criterion: keyboard
    rationale: Visually Hidden es un elemento de presentación no interactivo sin interacciones de teclado.
  - criterion: focus
    rationale: Visually Hidden es un elemento de presentación no interactivo y no recibe enfoque.
reviewStatus: draft
translationSourceHash: "ee5b43bc92f5d2d51b81773fa724d7414683ef346ae3098034a4cfb336a53fdb"
translationStatus: draft
---