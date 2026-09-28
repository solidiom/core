# avatar — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ba53c237
Status: ✅ 0 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 9999px | 50% | 🟡 accepted |
| tokens.Root.height | 40px | 40px | ✅ |
| tokens.Root.width | 40px | 40px | ✅ |
| tokens.Fallback.background-color | rgb(241, 245, 249) | rgba(0, 0, 0, 0) | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 91.975% | 🟡 accepted |
| tokens.Root.border-radius | 9999px | 50% | 🟡 accepted |
| tokens.Root.height | 40px | 40px | ✅ |
| tokens.Root.width | 40px | 40px | ✅ |
| tokens.Fallback.background-color | rgb(30, 41, 59) | rgba(0, 0, 0, 0) | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 95.72083333333333% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
