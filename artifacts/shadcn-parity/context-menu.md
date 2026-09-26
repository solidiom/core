# context-menu — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 20 failures, 6 accepted divergences

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
| pixels.light.default | ≤ 1% diff | delta 7.421666666666667% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 8px | ❌ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.min-width | 128px | 192px | 🟡 accepted |
| tokens.Content.padding | 4px | 6px | ❌ |
| tokens.Item.background-color | rgba(0, 0, 0, 0) | color(srgb 0.341176 0.313726 0.839216 / 0.12) | ❌ |
| tokens.Item.border-radius | 4px | 6px | ❌ |
| tokens.Item.height | 32px | 34.75px | ❌ |
| tokens.Item.font-size | 14px | 13px | ❌ |
| tokens.Item.padding | 6px 8px | 6px 10px | ❌ |
| behavior.right-click | focus=Trigger | focus=- | 🟡 accepted |
| pixels.light.right-click | ≤ 1% diff | delta 99.69166666666666% | ❌ |
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
| behavior.close-esc | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.close-esc | ≤ 1% diff | delta 7.421666666666667% | ❌ |
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
| pixels.dark.default | ≤ 1% diff | delta 99.60333333333334% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 8px | ❌ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.min-width | 128px | 192px | 🟡 accepted |
| tokens.Content.padding | 4px | 6px | ❌ |
| tokens.Item.background-color | rgba(0, 0, 0, 0) | color(srgb 0.545098 0.513726 0.972549 / 0.12) | ❌ |
| tokens.Item.border-radius | 4px | 6px | ❌ |
| tokens.Item.height | 32px | 34.75px | ❌ |
| tokens.Item.font-size | 14px | 13px | ❌ |
| tokens.Item.padding | 6px 8px | 6px 10px | ❌ |
| behavior.right-click | focus=Trigger | focus=- | 🟡 accepted |
| pixels.dark.right-click | ≤ 1% diff | delta 99.98666666666666% | ❌ |
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
| behavior.close-esc | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.dark.close-esc | ≤ 1% diff | delta 99.60333333333334% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
