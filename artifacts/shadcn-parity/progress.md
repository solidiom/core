# progress — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b73c0d8f
Status: ❌ 4 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.height | 8px | 8px | ✅ |
| tokens.Root.border-radius | 9999px | 9999px | ✅ |
| tokens.Indicator.height | 8px | 8px | ✅ |
| tokens.Indicator.border-radius | 0px | 9999px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.70833333333333% | ❌ |
| tokens.Root.height | 8px | 8px | ✅ |
| tokens.Root.border-radius | 9999px | 9999px | ✅ |
| tokens.Indicator.height | 8px | 8px | ✅ |
| tokens.Indicator.border-radius | 0px | 9999px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 100% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
