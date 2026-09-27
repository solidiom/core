# resizable-panels — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 4 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Handle.background-color | rgb(226, 232, 240) | rgb(203, 213, 225) | 🟡 accepted |
| tokens.Handle.width | 1px | 0px | ❌ |
| tokens.Group.border-width | 0px | 1px | ❌ |
| tokens.Group.border-radius | 0px | 8px | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 44.0775% | 🟡 accepted |
| tokens.Handle.background-color | rgb(30, 41, 59) | rgb(51, 65, 85) | 🟡 accepted |
| tokens.Handle.width | 1px | 0px | ❌ |
| tokens.Group.border-width | 0px | 1px | ❌ |
| tokens.Group.border-radius | 0px | 8px | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.89% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
