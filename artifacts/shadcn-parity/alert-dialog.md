# alert-dialog — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 14 failures, 11 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 93.845% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 8px | 12px | 🟡 accepted |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 24px | 24px | ✅ |
| tokens.Content.width | 512px | 384px | ❌ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.light.open | ≤ 1% diff | delta 99.76% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | (missing element) | 🟡 accepted |
| tokens.Content.border-radius | 8px | (missing element) | 🟡 accepted |
| tokens.Content.border-width | 1px | (missing element) | ❌ |
| tokens.Content.padding | 24px | (missing element) | ❌ |
| tokens.Content.width | 512px | (missing element) | ❌ |
| behavior.close-overlay-click | focus=Content | focus=- open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.light.close-overlay-click | ≤ 1% diff | delta 80.0825% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.dark.default | ≤ 1% diff | delta 99.96416666666667% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | 8px | 12px | 🟡 accepted |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 24px | 24px | ✅ |
| tokens.Content.width | 512px | 384px | ❌ |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 99.97166666666666% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | (missing element) | 🟡 accepted |
| tokens.Content.border-radius | 8px | (missing element) | 🟡 accepted |
| tokens.Content.border-width | 1px | (missing element) | ❌ |
| tokens.Content.padding | 24px | (missing element) | ❌ |
| tokens.Content.width | 512px | (missing element) | ❌ |
| behavior.close-overlay-click | focus=Content | focus=- open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.dark.close-overlay-click | ≤ 1% diff | delta 99.68666666666667% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
