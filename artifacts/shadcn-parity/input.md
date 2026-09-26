# input — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 52ca1525
Status: ❌ 12 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.height | 36px | 39px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.91250000000001% | ❌ |
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.height | 36px | 39px | ❌ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.light.focus | ≤ 1% diff | delta 99.97833333333334% | ❌ |
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.height | 36px | 39px | ❌ |
| behavior.reset | focus=Root | focus=Root | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.99083333333333% | ❌ |
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.height | 36px | 39px | ❌ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.dark.focus | ≤ 1% diff | delta 99.99083333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
