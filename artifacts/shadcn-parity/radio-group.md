# radio-group — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 570d3a83
Status: ❌ 4 failures, 12 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.reset | focus=- checked=Item:true checked=Indicator:true | focus=- checked=Item:true checked=Indicator:true | ✅ |
| pixels.light.default | ≤ 1% diff | delta 97.62333333333333% | ❌ |
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.focus | focus=Item checked=Item:true checked=Indicator:true | focus=Item checked=Item:true checked=Indicator:true | ✅ |
| pixels.light.focus | ≤ 1% diff | delta 97.62333333333333% | ❌ |
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.reset | focus=Item checked=Item:true checked=Indicator:true | focus=Item checked=Item:true checked=Indicator:true | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.50750000000001% | ❌ |
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.focus | focus=Item checked=Item:true checked=Indicator:true | focus=Item checked=Item:true checked=Indicator:true | ✅ |
| pixels.dark.focus | ≤ 1% diff | delta 99.50750000000001% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
