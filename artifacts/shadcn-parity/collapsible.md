# collapsible — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b4adaad9
Status: ✅ 0 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 12px | 12px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.height | 32px | 32px | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.62583333333333% | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 12px | 12px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.height | 32px | 32px | ✅ |
| behavior.open | focus=Trigger | focus=Trigger | ✅ |
| pixels.light.open | ≤ 1% diff | delta 59.25333333333334% | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 12px | 12px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.height | 32px | 32px | ✅ |
| behavior.reset | focus=Trigger | focus=Trigger | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 95.48916666666668% | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 12px | 12px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.height | 32px | 32px | ✅ |
| behavior.open | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 26.173333333333332% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
