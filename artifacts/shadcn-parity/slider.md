# slider — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 52ca1525
Status: ❌ 4 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Thumb.background-color | rgb(255, 255, 255) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 40.62833333333333% | ❌ |
| tokens.Thumb.background-color | rgb(255, 255, 255) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.light.focus | ≤ 1% diff | delta 41.69916666666666% | ❌ |
| tokens.Thumb.background-color | rgb(2, 8, 23) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.reset | focus=Root | focus=Root | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.91083333333334% | ❌ |
| tokens.Thumb.background-color | rgb(2, 8, 23) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.dark.focus | ≤ 1% diff | delta 99.91083333333334% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
