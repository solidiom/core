# dropdown-menu — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ddb8b2cf
Status: ❌ 10 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.min-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Item.background-color | (missing element) | (missing element) | ✅ |
| tokens.Item.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Item.height | (missing element) | (missing element) | ✅ |
| tokens.Item.font-size | (missing element) | (missing element) | ✅ |
| tokens.Item.padding | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.68% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.min-width | 128px | 160px | 🟡 accepted |
| tokens.Content.padding | 4px | 4px | ✅ |
| tokens.Item.background-color | rgba(0, 0, 0, 0) | rgb(255, 255, 255) | ❌ |
| tokens.Item.border-radius | 4px | 4px | ✅ |
| tokens.Item.height | 32px | 40.5px | 🟡 accepted |
| tokens.Item.font-size | 14px | 14px | ✅ |
| tokens.Item.padding | 6px 8px | 8px 12px | ❌ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.light.open | ≤ 1% diff | delta 79.51916666666666% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.min-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Item.background-color | (missing element) | (missing element) | ✅ |
| tokens.Item.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Item.height | (missing element) | (missing element) | ✅ |
| tokens.Item.font-size | (missing element) | (missing element) | ✅ |
| tokens.Item.padding | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.light.close-esc | ≤ 1% diff | delta 99.93666666666667% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.min-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Item.background-color | (missing element) | (missing element) | ✅ |
| tokens.Item.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Item.height | (missing element) | (missing element) | ✅ |
| tokens.Item.font-size | (missing element) | (missing element) | ✅ |
| tokens.Item.padding | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.89% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.min-width | 128px | 160px | 🟡 accepted |
| tokens.Content.padding | 4px | 4px | ✅ |
| tokens.Item.background-color | rgba(0, 0, 0, 0) | rgb(30, 41, 59) | ❌ |
| tokens.Item.border-radius | 4px | 4px | ✅ |
| tokens.Item.height | 32px | 40.5px | 🟡 accepted |
| tokens.Item.font-size | 14px | 14px | ✅ |
| tokens.Item.padding | 6px 8px | 8px 12px | ❌ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 99.42416666666666% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.min-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Item.background-color | (missing element) | (missing element) | ✅ |
| tokens.Item.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Item.height | (missing element) | (missing element) | ✅ |
| tokens.Item.font-size | (missing element) | (missing element) | ✅ |
| tokens.Item.padding | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.close-esc | ≤ 1% diff | delta 99.89% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
