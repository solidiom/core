# badge — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b4adaad9
Status: ✅ 0 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.font-size | 12px | 12px | ✅ |
| tokens.Root.font-weight | 600 | 600 | ✅ |
| tokens.Root.padding | 2px 10px | 2px 8px | 🟡 accepted |
| tokens.Root.height | 22px | 22px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.55583333333334% | 🟡 accepted |
| tokens.Root.font-size | 12px | 12px | ✅ |
| tokens.Root.font-weight | 600 | 600 | ✅ |
| tokens.Root.padding | 2px 10px | 2px 8px | 🟡 accepted |
| tokens.Root.height | 22px | 22px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.87666666666667% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
