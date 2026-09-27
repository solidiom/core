# date-picker — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b73c0d8f
Status: ❌ 26 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 42px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 8px | ❌ |
| tokens.Trigger.font-size | 14px | 16px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Calendar.padding | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.84666666666666% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 42px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 8px | ❌ |
| tokens.Trigger.font-size | 14px | 16px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | 6px | 12px | ❌ |
| tokens.Content.padding | 0px | 12px | ❌ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Calendar.padding | 12px | 0px | ❌ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.light.open | ≤ 1% diff | delta 98.895% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 42px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 8px | ❌ |
| tokens.Trigger.font-size | 14px | 16px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Calendar.padding | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.91499999999999% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 42px | ❌ |
| tokens.Trigger.padding | 8px 16px | 6px 8px | ❌ |
| tokens.Trigger.font-size | 14px | 16px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| tokens.Content.border-radius | 6px | 12px | ❌ |
| tokens.Content.padding | 0px | 12px | ❌ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Calendar.padding | 12px | 0px | ❌ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 96.80333333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
