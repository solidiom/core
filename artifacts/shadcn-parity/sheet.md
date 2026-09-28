# sheet — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ba53c237
Status: ❌ 22 failures, 10 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 0px | ❌ |
| tokens.Content.width | (missing element) | 384px | ❌ |
| tokens.Content.height | (missing element) | 720px | ❌ |
| tokens.Content.padding | (missing element) | 24px | ❌ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 95.64833333333334% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 0px | 0px | ✅ |
| tokens.Content.width | 384px | 384px | ✅ |
| tokens.Content.height | 720px | 720px | ✅ |
| tokens.Content.padding | 24px | 24px | ✅ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | (missing element) | 🟡 accepted |
| behavior.open | focus=Content | focus=Content | 🟡 accepted |
| pixels.light.open | ≤ 1% diff | delta 99.99% | ❌ |
| tokens.Content.background-color | (missing element) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 0px | ❌ |
| tokens.Content.width | (missing element) | 384px | ❌ |
| tokens.Content.height | (missing element) | 720px | ❌ |
| tokens.Content.padding | (missing element) | 24px | ❌ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.light.close-esc | ≤ 1% diff | delta 99.77666666666667% | ❌ |
| tokens.Content.background-color | (missing element) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 0px | ❌ |
| tokens.Content.width | (missing element) | 384px | ❌ |
| tokens.Content.height | (missing element) | 720px | ❌ |
| tokens.Content.padding | (missing element) | 24px | ❌ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 95.51583333333333% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | 0px | 0px | ✅ |
| tokens.Content.width | 384px | 384px | ✅ |
| tokens.Content.height | 720px | 720px | ✅ |
| tokens.Content.padding | 24px | 24px | ✅ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | (missing element) | 🟡 accepted |
| behavior.open | focus=Content | focus=Content | 🟡 accepted |
| pixels.dark.open | ≤ 1% diff | delta 99.99833333333333% | ❌ |
| tokens.Content.background-color | (missing element) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 0px | ❌ |
| tokens.Content.width | (missing element) | 384px | ❌ |
| tokens.Content.height | (missing element) | 720px | ❌ |
| tokens.Content.padding | (missing element) | 24px | ❌ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.close-esc | ≤ 1% diff | delta 95.51583333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
