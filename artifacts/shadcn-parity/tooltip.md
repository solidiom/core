# tooltip — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ba53c237
Status: ❌ 10 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.height | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.56583333333333% | ❌ |
| tokens.Content.background-color | rgb(37, 99, 235) | (missing element) | 🟡 accepted |
| tokens.Content.border-radius | 6px | (missing element) | ❌ |
| tokens.Content.height | 28px | (missing element) | ❌ |
| behavior.hover | focus=- | focus=- open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.light.hover | ≤ 1% diff | delta 95.8125% | ❌ |
| tokens.Content.background-color | (missing element) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 6px | ❌ |
| tokens.Content.height | (missing element) | 33px | ❌ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- | 🟡 accepted |
| pixels.dark.default | ≤ 1% diff | delta 84.73166666666667% | ❌ |
| tokens.Content.background-color | (missing element) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 6px | ❌ |
| tokens.Content.height | (missing element) | 33px | ❌ |
| behavior.hover | focus=- open=Trigger:false open=Content:false | focus=- | 🟡 accepted |
| pixels.dark.hover | ≤ 1% diff | delta 84.73166666666667% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
