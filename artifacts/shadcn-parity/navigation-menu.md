# navigation-menu — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 13 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 36px | 36.5px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 12px | ❌ |
| tokens.List.font-size | 16px | 16px | ✅ |
| behavior.reset | focus=- open=Trigger:false | focus=- open=Trigger:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 11.6875% | ❌ |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 36px | 36.5px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 12px | ❌ |
| tokens.List.font-size | 16px | 16px | ✅ |
| behavior.open | focus=Trigger | focus=Trigger open=Trigger:false | 🟡 accepted |
| pixels.light.open | ≤ 1% diff | delta 33.934999999999995% | ❌ |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 36px | 36.5px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 12px | ❌ |
| tokens.List.font-size | 16px | 16px | ✅ |
| behavior.reset | focus=Trigger | focus=Trigger open=Trigger:false | ❌ |
| pixels.dark.default | ≤ 1% diff | delta 87.74333333333333% | ❌ |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 36px | 36.5px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 12px | ❌ |
| tokens.List.font-size | 16px | 16px | ✅ |
| behavior.open | focus=Trigger open=Trigger:false | focus=Trigger | 🟡 accepted |
| pixels.dark.open | ≤ 1% diff | delta 89.53833333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
