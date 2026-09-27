# kbd — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 4 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.font-size | 12px | 12px | ✅ |
| tokens.Root.height | 20px | 23.7969px | ❌ |
| tokens.Root.padding | 0px 4px | 2px 6px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.21583333333334% | 🟡 accepted |
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.font-size | 12px | 12px | ✅ |
| tokens.Root.height | 20px | 23.7969px | ❌ |
| tokens.Root.padding | 0px 4px | 2px 6px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 100% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
