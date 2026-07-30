# Solidiom Brand Source Assets (BRAND-004)

Vector source assets for the Solidiom identity, implementing the logo
system defined in `docs/assets/brand-README.md` §6 and the canonical palette
in §8.2. Usage of these assets is governed by the published Trademark &
Brand-Use Policy (`apps/site/src/content/en/pages/trademark.md`, live at
`/trademark/`; Spanish counterpart at `/es/trademark/`).

## Concept

"Bracket S" — two opposing, offset bracket-like curves whose facing open
ends form the negative-space suggestion of an "S," without drawing a
literal S glyph or a literal bracket pair. Stroke-based construction
(round caps, no fills) so the mark stays legible from favicon size up to
large-format use, and reduces cleanly to a single flat color.

## Files

| File                       | Purpose                                                        | Variant                               |
| -------------------------- | -------------------------------------------------------------- | ------------------------------------- |
| `symbol.svg`               | Primary symbol-only mark                                       | Full color (`#6D66F1` Indigo)         |
| `symbol-mono-dark.svg`     | Symbol for light backgrounds without brand color               | Monochrome dark (`#0F172A` Slate 950) |
| `symbol-mono-light.svg`    | Symbol for dark/brand-colored backgrounds                      | Monochrome light (`#F8FAFC` Canvas)   |
| `symbol-small.svg`         | Simplified geometry for ≤32px use (favicon, tab, small badges) | Full color                            |
| `favicon.svg`              | Favicon source, derived from `symbol-small.svg`                | Full color                            |
| `wordmark.svg`             | Primary horizontal lockup (symbol + "solidiom")                | Full color                            |
| `wordmark-mono-dark.svg`   | Horizontal lockup, monochrome dark                             | Monochrome dark                       |
| `wordmark-mono-light.svg`  | Horizontal lockup, monochrome light                            | Monochrome light                      |
| `lockup-stacked.svg`       | Symbol above wordmark, for square/vertical placements          | Full color                            |
| `social-card-template.svg` | 1200×630 Open Graph/Twitter card template                      | Full color, dark background           |

This covers the required variant set from `docs/plans/website-tasks.md` §5.1
(BRAND-004): vector icon, wordmark, monochrome light/dark variants,
favicon set, and social-card source assets.

## Generating raster derivatives

These SVGs are the canonical source. Raster artifacts (`.png`, `.ico`,
`apple-touch-icon.png`, per-page social cards) must be generated from
them, not hand-drawn or edited independently, so every derivative stays
traceable to one geometry:

```sh
# Favicon raster set (from favicon.svg / symbol-small.svg)
rsvg-convert -w 16  -h 16  favicon.svg -o favicon-16.png
rsvg-convert -w 32  -h 32  favicon.svg -o favicon-32.png
rsvg-convert -w 180 -h 180 favicon.svg -o apple-touch-icon.png

# App icons (from symbol.svg, matches manifest.webmanifest sizes)
rsvg-convert -w 192 -h 192 symbol.svg -o icon-192.png
rsvg-convert -w 512 -h 512 symbol.svg -o icon-512.png

# Social card (from social-card-template.svg, swap the descriptor text
# per page rather than the layout)
rsvg-convert -w 1200 -h 630 social-card-template.svg -o social-default.png
```

`favicon.ico` (multi-resolution) should be assembled from the 16/32/48
PNGs using standard tooling (e.g., ImageMagick `convert` or an online
favicon packer) at production-asset time; it is not checked in as a
hand-authored source file.

## Rules that apply to every variant (see GOV-006 §5)

- No 3D effects, gloss, bevels, drop shadows, or gradients applied to
  the mark itself. The one gradient in `social-card-template.svg` is a
  structural background/accent band, not an effect on the symbol.
- No literal bracket pair, cube, or gem — the curve must stay abstracted.
- No version numbers, "UI" suffix, or taglines embedded in the mark.
- No recoloring outside the palette values listed in the table above.
- Do not stretch, skew, or crop the mark disproportionately.

## Known follow-ups (not blocking BRAND-004 / G0)

- Wordmark text uses an SVG `<text>` element referencing "Inter Tight."
  Before shipping any print or non-web raster artifact, convert the
  text to outlined paths so rendering does not depend on font
  availability on the consuming system. Web use (favicons, the site's
  own header/footer, OG images rendered server-side with the font
  available) does not require this conversion.
- `favicon.ico` packaging and `apple-touch-icon.png` generation are
  mechanical follow-ups using the commands above; they are not
  additional design decisions.
