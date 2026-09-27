# scroll-area — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 4 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 6px | 8px | 🟡 accepted |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.padding | 16px | 0px | ❌ |
| tokens.Viewport.border-radius | 6px | 0px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 59.34666666666667% | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | 🟡 accepted |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.padding | 16px | 0px | ❌ |
| tokens.Viewport.border-radius | 6px | 0px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.23166666666667% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
