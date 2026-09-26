# radio-group — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 52ca1525
Status: ❌ 8 failures, 12 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.reset | focus=- checked=Item:true checked=Indicator:true | focus=- | ❌ |
| pixels.light.default | ≤ 1% diff | delta 96.90333333333334% | ❌ |
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.focus | focus=Item checked=Item:true checked=Indicator:true | focus=- | ❌ |
| pixels.light.focus | ≤ 1% diff | delta 97.23333333333333% | ❌ |
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.reset | focus=Item checked=Item:true checked=Indicator:true | focus=- | ❌ |
| pixels.dark.default | ≤ 1% diff | delta 99.58416666666666% | ❌ |
| tokens.Indicator.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.focus | focus=Item checked=Item:true checked=Indicator:true | focus=- | ❌ |
| pixels.dark.focus | ≤ 1% diff | delta 99.58416666666666% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
