# switch — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 570d3a83
Status: ❌ 4 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Thumb.background-color | rgb(37, 99, 235) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Thumb.height | 20px | 20px | ✅ |
| tokens.Thumb.width | 36px | 36px | ✅ |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.reset | focus=- checked=Root:true checked=Thumb:true | focus=- checked=Root:true checked=Thumb:true | ✅ |
| pixels.light.default | ≤ 1% diff | delta 93.6925% | ❌ |
| tokens.Thumb.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Thumb.height | 20px | 20px | ✅ |
| tokens.Thumb.width | 36px | 36px | ✅ |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.focus | focus=Root | focus=Root | ✅ |
| pixels.light.focus | ≤ 1% diff | delta 71.15% | ❌ |
| tokens.Thumb.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Thumb.height | 20px | 20px | ✅ |
| tokens.Thumb.width | 36px | 36px | ✅ |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.reset | focus=Root | focus=Root | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 100% | ❌ |
| tokens.Thumb.background-color | rgb(59, 130, 246) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Thumb.height | 20px | 20px | ✅ |
| tokens.Thumb.width | 36px | 36px | ✅ |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.focus | focus=Root checked=Root:true checked=Thumb:true | focus=Root checked=Root:true checked=Thumb:true | ✅ |
| pixels.dark.focus | ≤ 1% diff | delta 99.77083333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
