---
contentSchemaVersion: 1
title: Chart
description: Envoltorio de visualización de datos con tabla alternativa accesible.
keywords: [chart, visualization, canvas, accessible, table, legend, data]
locale: es
maturity: ga
product: Chart
productLayer: primitive
status: draft
package: "@solidiom/chart"
primitive: chart
section: overview
notApplicable:
  - section: migration
    reason: No existe una API anterior; esta es la primera versión publicada.
  - section: testing
    reason: La guía de pruebas estándar cubre este primitivo.
translationSourceHash: "5af067d3ac34702f211a21bea20d32e1b341e64b0077ad8cb8e30d6efd5b0c81"
translationStatus: "draft"
---

Chart es una capa de integración para visualizar datos; las bibliotecas de adaptadores externas realizan el trazado. Canvas expone una ref para que las bibliotecas externas rendericen, y FallbackTable proporciona una alternativa accesible en forma de tabla de datos.

## Uso

Compón `Root`, `Canvas`, `FallbackTable`, `Legend`, `Title` y `Description`.

```tsx
import * as Chart from "@solidiom/chart"

function RevenueChart() {
  return (
    <Chart.Root>
      <Chart.Title>Ingresos mensuales</Chart.Title>
      <Chart.Description>Ingresos por mes del año actual.</Chart.Description>
      <Chart.Canvas />
      <Chart.Legend>
        <span>Ingresos</span>
      </Chart.Legend>
      <Chart.FallbackTable>
        <table>
          <tbody>
            <tr>
              <td>Enero</td>
              <td>$12,000</td>
            </tr>
          </tbody>
        </table>
      </Chart.FallbackTable>
    </Chart.Root>
  )
}
```

## Instalación

Instala el paquete con `pnpm add @solidiom/chart`. El paquete requiere dependencias pares compatibles de `solid-js` y `@solidjs/web`.

## Partes

chart expone 6 partes:

- **Root** — `data-part="root"`. Contenedor de integración de la visualización.
- **Canvas** — `data-part="canvas"`. Expone una ref para que rendericen las bibliotecas de adaptadores externas.
- **FallbackTable** — `data-part="fallbacktable"`. Proporciona una alternativa accesible en forma de tabla de datos.
- **Legend** — `data-part="legend"`. Muestra la leyenda del gráfico.
- **Title** — `data-part="title"`. Muestra el título del gráfico.
- **Description** — `data-part="description"`. Muestra la descripción del gráfico.

## Estilos

chart incluye los atributos `data-scope="chart"` y `data-part` en cada parte para seleccionar estilos CSS o recetas.

## Teclado y comportamiento

Este primitivo no tiene interacción de teclado propia.

## Composición

Chart es una capa de integración que se compone con bibliotecas externas de gráficos mediante la ref de Canvas y con FallbackTable para la accesibilidad.

## SSR e hidratación

Chart renderiza la estructura estática y FallbackTable en el servidor; la ref de Canvas queda disponible para que las bibliotecas externas rendericen después de la hidratación.
