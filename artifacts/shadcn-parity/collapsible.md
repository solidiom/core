# collapsible — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 16 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.font-size | 12px | 14px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 32px | 42.5px | ❌ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.69749999999999% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.font-size | 12px | 14px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 32px | 42.5px | ❌ |
| behavior.open | focus=Trigger | focus=Trigger | ✅ |
| pixels.light.open | ≤ 1% diff | delta 55.185833333333335% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.font-size | 12px | 14px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 32px | 42.5px | ❌ |
| behavior.reset | focus=Trigger | focus=Trigger | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 95.48833333333333% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.font-size | 12px | 14px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 32px | 42.5px | ❌ |
| behavior.open | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 22.634999999999998% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
