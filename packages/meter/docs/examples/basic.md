---
contentSchemaVersion: 1
title: Meter - Basic usage
description: Basic meter example demonstrating core behavior.
keywords: [meter, basic, example]
locale: en
maturity: draft
product: Meter
productLayer: primitive
status: draft
package: "@solidiom/meter"
primitive: meter
section: examples
exampleId: meter-basic
source:
  path: packages/meter/src/index.tsx
  export: Root
  language: tsx
runnable: false
runnableReason: "No keyboard interaction declared in the accessibility contract."
---

```tsx
import * as Meter from "@solidiom/meter"

;<div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
  <Meter.Root value={70} min={0} max={100} optimum={100}>
    70% used
  </Meter.Root>

  <Meter.Root value={30} min={0} max={100} low={30} optimum={100}>
    30% — low
  </Meter.Root>

  <Meter.Root value={90} min={0} max={100} high={80} optimum={0}>
    90% — high (inverted optimum)
  </Meter.Root>
</div>
```

The meter uses the native `<meter>` element for built-in accessibility. It derives a `data-status` of "safe", "caution", or "danger" based on `value`, `low`, `high`, and `optimum`. The `data-value` attribute is the normalized 0–1 ratio.
