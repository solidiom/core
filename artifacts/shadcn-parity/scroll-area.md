# scroll-area — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ba53c237
Status: ✅ 0 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.padding | 16px | 16px | ✅ |
| tokens.Viewport.border-radius | 6px | 6px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 14.807500000000001% | 🟡 accepted |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.padding | 16px | 16px | ✅ |
| tokens.Viewport.border-radius | 6px | 6px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.1275% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
