# accordion — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ba53c237
Status: ✅ 0 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.padding | 16px 0px | 16px 0px | ✅ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.reset | focus=- open=Item:false open=Trigger:false open=Content:false | focus=- open=Item:false open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 4.5875% | 🟡 accepted |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.padding | 16px 0px | 16px 0px | ✅ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.open | focus=Item | focus=Item | ✅ |
| pixels.light.open | ≤ 1% diff | delta 10.27% | 🟡 accepted |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.padding | 16px 0px | 16px 0px | ✅ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.reset | focus=Item | focus=Item | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.48166666666667% | 🟡 accepted |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.font-weight | 500 | 500 | ✅ |
| tokens.Trigger.padding | 16px 0px | 16px 0px | ✅ |
| tokens.Trigger.border-radius | 0px | 0px | ✅ |
| tokens.Item.border-width | 0px 0px 1px | 0px 0px 1px | ✅ |
| tokens.Item.border-radius | 0px | 0px | ✅ |
| behavior.open | focus=Item open=Item:false open=Trigger:false open=Content:false | focus=Item open=Item:false open=Trigger:false open=Content:false | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 99.99249999999999% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
