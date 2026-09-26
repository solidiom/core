# select — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 4 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.87666666666667% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.light.open | ≤ 1% diff | delta 99.9425% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 100% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 99.98583333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
