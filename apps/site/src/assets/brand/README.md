# Solidiom Brand Source Assets

Vector source assets for the Solidiom identity. Usage of these assets is
governed by the published Trademark & Brand-Use Policy
(`apps/site/src/content/en/pages/trademark.md`, live at `/trademark/`;
Spanish counterpart at `/es/trademark/`).

## Concept

"Quadrant" — four tiles on a two-column grid: two squares and two
half-rounds, each half-round facing away from the centre. The composition is
an exact 180-degree rotation about its own centre, so every tile maps onto
its diagonal opposite. Fill-based construction (no strokes), so the mark
reduces cleanly to a single flat colour and stays exact at any size.

The mark replaced the earlier stroke-based "Bracket S" identity. It reuses
the existing `--sol-` token palette rather than introducing new brand
colours, so no UI token, `theme_color`, or contrast audit changed with the
rebrand.

## Palette

Every fill resolves to a token in `apps/site/src/assets/tokens.css`:

| Tile             | Token             | Hex       |
| ---------------- | ----------------- | --------- |
| Top-left round   | `surface-inverse` | `#0F172A` |
| Top-right square | `primary`         | `#5750D6` |
| Bottom-left sq.  | `border`          | `#CBD5E1` |
| Bottom-right rd. | `accent`          | `#06B6D4` |

Monochrome inks: `#0F172A` (dark, on light backgrounds) and `#F8FAFC`
(canvas, on dark backgrounds).

## Geometry

`129 x 168` viewBox on a two-column grid — columns 60 wide at `x 0..60` and
`x 69..129`, separated by a 9-unit gutter:

| Tile             | Form                                                      | Size    |
| ---------------- | --------------------------------------------------------- | ------- |
| Top-left round   | rect `x 46..60, y 0..92` + semicircle r=46 facing left    | 60 x 92 |
| Top-right square | square at `(69, 0)`                                       | 60 x 60 |
| Bottom-left sq.  | square at `(0, 108)`                                      | 60 x 60 |
| Bottom-right rd. | rect `x 69..83, y 76..168` + semicircle r=46 facing right | 60 x 92 |

Each half-round is a rectangle whose outer edge is a true semicircle with
radius equal to half the shape's height, written as a single SVG `A` arc.
Curves are therefore exact at every size — **do not re-trace the mark from a
raster export.** The version this replaced was an auto-traced raster whose
curves were hundreds of 2px stair-steps.

Two invariants worth protecting:

- **The 9-unit gutter is load-bearing.** It is the only thing separating the
  four tiles once colour is removed, so the monochrome variants depend on it.
  Do not close or narrow it.
- **The composition is exactly rotationally symmetric.** Rotating the mark
  180 degrees reproduces it. Any edit must preserve that.

## Choosing a variant

The full-colour mark is for **light** surfaces. On a dark canvas its
`#0F172A` tile falls to 1.08:1 and disappears — use `symbol-mono-light.svg`
there instead. Only three tokens in the palette clear 3:1 against both
canvases, so a single four-colour mark cannot serve both; the mono variants
are the intended answer, not a fallback.

(WCAG exempts logos from contrast minimums, so this is a legibility
concern, not a compliance one. The deliberately quiet `border` tile sits at
1.42:1 on the light canvas by design.)

## Files

| File                       | Purpose                                           |
| -------------------------- | ------------------------------------------------- |
| `symbol.svg`               | Primary symbol-only mark, full colour             |
| `symbol-mono-dark.svg`     | Symbol in one ink, for light backgrounds          |
| `symbol-mono-light.svg`    | Symbol in one ink, for dark/brand backgrounds     |
| `symbol-small.svg`         | `<=32px` use — gutter widened 9 -> 12 units       |
| `favicon.svg`              | Favicon source — mark centred on a square canvas  |
| `wordmark.svg`             | Horizontal lockup (symbol + "solidiom")           |
| `wordmark-mono-dark.svg`   | Horizontal lockup, one ink, light backgrounds     |
| `wordmark-mono-light.svg`  | Horizontal lockup, one ink, dark backgrounds      |
| `lockup-stacked.svg`       | Symbol above wordmark, square/vertical placements |
| `social-card-template.svg` | 1200x630 Open Graph/Twitter card template         |
| `_reference/`              | Original supplied artwork — see below             |

Deployed derivatives generated from `symbol.svg`:

- `apps/site/public/icons/icon-192.svg`, `icon-512.svg` — maskable PWA
  icons, referenced by `public/manifest.webmanifest` and `<link rel="icon">`
  in `src/layouts/BaseLayout.astro` and `ErrorLayout.astro`.
- `apps/site/public/img/solidiom.svg`, `solidiom.png` — URL-addressable
  copies for use outside the build pipeline.

`_reference/` holds the original supplied mockup (`quadrant-reference.png`)
and a faithful vector tracing of it in its original warm palette
(navy/amber/cream/teal). Kept only as a design record of where the mark came
from; it is not a shippable asset and nothing should import it. It lives
under `src/` precisely so it is never served.

### Portrait aspect

The mark is portrait (`129 x 168`, ratio 0.768) where the previous one was
square. Square outputs therefore centre the mark with padding rather than
scaling it to fill — see the fit arithmetic commented in `favicon.svg` and
`public/icons/icon-192.svg`. Do not stretch the mark to fill a square.

## Generating raster derivatives

These SVGs are the canonical source. Raster artifacts must be generated from
them, never hand-drawn or edited independently, so every derivative stays
traceable to one geometry:

```sh
cd apps/site/src/assets/brand

# URL-addressable raster (4x native)
rsvg-convert -w 516 -h 672 symbol.svg -o ../../../public/img/solidiom.png

# Favicon raster set (square canvas, from favicon.svg)
rsvg-convert -w 16  -h 16  favicon.svg -o favicon-16.png
rsvg-convert -w 32  -h 32  favicon.svg -o favicon-32.png
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png

# Social card (swap the descriptor text per page, not the layout)
rsvg-convert -w 1200 -h 630 social-card-template.svg -o social-default.png
```

`favicon.ico` (multi-resolution) should be assembled from the 16/32/48 PNGs
using standard tooling at production-asset time; it is not checked in as a
hand-authored source file.

The wordmark and lockup files set "solidiom" with an SVG `<text>` element
referencing Inter Tight. Convert the text to outlined paths before exporting
any print or non-web raster artifact so rendering does not depend on font
availability. Web use, where the font is present, does not need this.

## Rules that apply to every variant

- No 3D effects, gloss, bevels, drop shadows, or gradients applied to the
  mark itself. The one gradient in `social-card-template.svg` is a
  structural background band, not an effect on the symbol.
- No recolouring outside the token values in the palette table above.
- Do not stretch, skew, or crop the mark disproportionately.
- Do not close or narrow the 9-unit gutter.
- Do not break the 180-degree rotational symmetry.
- No version numbers, "UI" suffix, or taglines embedded in the mark.

## Note on enforcement

Nothing in the `audit:*` scripts inspects SVG fills, so palette drift in
brand art is currently caught only by review. A small
`tools/audit-brand-palette.ts` asserting every fill in this directory
resolves to a `tokens.css` value would close that gap.
