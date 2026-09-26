# select — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 52ca1525
Status: ❌ 14 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.84583333333333% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | focus=Content | focus=Trigger | ❌ |
| pixels.light.open | ≤ 1% diff | delta 99.78083333333333% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.97916666666666% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | focus=Content | focus=Trigger | ❌ |
| pixels.dark.open | ≤ 1% diff | delta 99.99083333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
