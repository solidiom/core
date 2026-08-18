---
contentSchemaVersion: 1
title: Spinner básico
description: Componente de spinner animado de carga.
keywords: [spinner, loading, progress, feedback]
locale: es
maturity: draft
product: Spinner
productLayer: component
status: draft
package: "@solidiom/recipes-css"
recipe: "spinner"
section: examples
exampleId: spinner-component-basic
source:
  path: apps/site/src/components/SpinnerExample.tsx
  export: SpinnerExample
  language: tsx
runnable: true
translationSourceHash: "994c8001f90af83a54b9ee80ed17564bd48a802699d383c0f890e0f823dae120"
translationStatus: "human-reviewed"
translationReviewedBy: "solidiom-team"
translationReviewedAt: "2026-08-18"
---

El componente Spinner proporciona una indicación visual de operaciones en curso.

```tsx
import { StyledSpinner } from "@solidiom/recipes-css"

;<StyledSpinner label="Cargando" />
```
