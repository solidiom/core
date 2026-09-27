# accordion — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 14 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.font-size | 14px | 15px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.padding | 16px 0px | 16px 8px | ❌ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.reset | focus=- open=Item:false open=Trigger:false open=Content:false | focus=- | ❌ |
| pixels.light.default | ≤ 1% diff | delta 9.295% | ❌ |
| tokens.Trigger.font-size | 14px | 15px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.padding | 16px 0px | 16px 8px | ❌ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.open | focus=Item | focus=Item open=Item:false open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.light.open | ≤ 1% diff | delta 9.0525% | ❌ |
| tokens.Trigger.font-size | 14px | 15px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.padding | 16px 0px | 16px 8px | ❌ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.reset | focus=Item | focus=Item open=Item:false open=Trigger:false open=Content:false | ❌ |
| pixels.dark.default | ≤ 1% diff | delta 99.98916666666666% | ❌ |
| tokens.Trigger.font-size | 14px | 15px | ❌ |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.padding | 16px 0px | 16px 8px | ❌ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.open | focus=Item open=Item:false open=Trigger:false open=Content:false | focus=Item | 🟡 accepted |
| pixels.dark.open | ≤ 1% diff | delta 99.99416666666666% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
