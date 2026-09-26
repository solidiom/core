# drawer — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ddb8b2cf
Status: ❌ 16 failures, 14 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| tokens.Content.height | (missing element) | (missing element) | ✅ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.72833333333332% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 10px 10px 0px 0px | 0px | 🟡 accepted |
| tokens.Content.width | 1280px | 288px | ❌ |
| tokens.Content.height | 158px | 720px | ❌ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | rgba(0, 0, 0, 0) | 🟡 accepted |
| behavior.open | focus=Trigger | focus=Content | ❌ |
| pixels.light.open | ≤ 1% diff | delta 99.9825% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | (missing element) | 🟡 accepted |
| tokens.Content.border-radius | 10px 10px 0px 0px | (missing element) | 🟡 accepted |
| tokens.Content.width | 1280px | (missing element) | ❌ |
| tokens.Content.height | 158px | (missing element) | ❌ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | (missing element) | 🟡 accepted |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false open=Backdrop:false | focus=Trigger open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.light.close-esc | ≤ 1% diff | delta 99.60416666666667% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| tokens.Content.height | (missing element) | (missing element) | ✅ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.775% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | 10px 10px 0px 0px | 0px | 🟡 accepted |
| tokens.Content.width | 1280px | 288px | ❌ |
| tokens.Content.height | 158px | 720px | ❌ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | rgba(0, 0, 0, 0) | 🟡 accepted |
| behavior.open | focus=Trigger | focus=Content | ❌ |
| pixels.dark.open | ≤ 1% diff | delta 99.995% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | (missing element) | 🟡 accepted |
| tokens.Content.border-radius | 10px 10px 0px 0px | (missing element) | 🟡 accepted |
| tokens.Content.width | 1280px | (missing element) | ❌ |
| tokens.Content.height | 158px | (missing element) | ❌ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | (missing element) | 🟡 accepted |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false open=Backdrop:false | focus=Trigger open=Trigger:false open=Content:false | 🟡 accepted |
| pixels.dark.close-esc | ≤ 1% diff | delta 99.99833333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
