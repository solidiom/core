# slider — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 4 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Thumb.background-color | rgb(255, 255, 255) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 40.90416666666667% | ❌ |
| tokens.Thumb.background-color | rgb(255, 255, 255) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.light.focus | ≤ 1% diff | delta 42.24583333333333% | ❌ |
| tokens.Thumb.background-color | rgb(2, 8, 23) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.reset | focus=Root | focus=Root | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.91916666666667% | ❌ |
| tokens.Thumb.background-color | rgb(2, 8, 23) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.dark.focus | ≤ 1% diff | delta 99.91916666666667% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
