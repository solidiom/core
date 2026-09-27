# kbd — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b4adaad9
Status: ✅ 0 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.font-size | 12px | 12px | ✅ |
| tokens.Root.height | 20px | 20px | ✅ |
| tokens.Root.padding | 0px 4px | 0px 4px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.01666666666667% | 🟡 accepted |
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.font-size | 12px | 12px | ✅ |
| tokens.Root.height | 20px | 20px | ✅ |
| tokens.Root.padding | 0px 4px | 0px 4px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.95666666666668% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
