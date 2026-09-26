# hover-card — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ddb8b2cf
Status: ❌ 12 failures, 3 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 41.55333333333333% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.hover | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.hover | ≤ 1% diff | delta 41.55333333333333% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 16px | 12px | ❌ |
| tokens.Content.width | 320px | 256px | ❌ |
| behavior.close-esc | focus=- | focus=- | ✅ |
| pixels.light.close-esc | ≤ 1% diff | delta 99.98833333333333% | ❌ |
| tokens.Content.background-color | (missing element) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | (missing element) | 6px | ❌ |
| tokens.Content.border-width | (missing element) | 1px | ❌ |
| tokens.Content.padding | (missing element) | 12px | ❌ |
| tokens.Content.width | (missing element) | 256px | ❌ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- | 🟡 accepted |
| pixels.dark.default | ≤ 1% diff | delta 99.905% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.hover | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.dark.hover | ≤ 1% diff | delta 99.9075% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.dark.close-esc | ≤ 1% diff | delta 99.9075% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
