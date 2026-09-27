# date-picker — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 2b33596b
Status: ❌ 4 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Calendar.padding | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.89083333333333% | ❌ |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.padding | 0px | 0px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Calendar.padding | 12px | 0px | 🟡 accepted |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.light.open | ≤ 1% diff | delta 99.03999999999999% | ❌ |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Calendar.padding | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.97% | ❌ |
| tokens.Trigger.border-radius | 6px | 6px | ✅ |
| tokens.Trigger.height | 36px | 36px | ✅ |
| tokens.Trigger.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Trigger.font-size | 14px | 14px | ✅ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.padding | 0px | 0px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Calendar.padding | 12px | 0px | 🟡 accepted |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 97.33083333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
