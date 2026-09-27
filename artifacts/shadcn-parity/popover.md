# popover — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 65af4c6b
Status: ❌ 8 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.81083333333333% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 16px | 16px | ✅ |
| tokens.Content.width | 320px | 320px | ✅ |
| behavior.open | focus=Content | focus=Trigger | ❌ |
| pixels.light.open | ≤ 1% diff | delta 90.32333333333334% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.light.close-esc | ≤ 1% diff | delta 99.89583333333333% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.73083333333334% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Content.border-radius | 6px | 6px | ✅ |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 16px | 16px | ✅ |
| tokens.Content.width | 320px | 320px | ✅ |
| behavior.open | focus=Content | focus=Trigger | ❌ |
| pixels.dark.open | ≤ 1% diff | delta 97.53500000000001% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.close-esc | ≤ 1% diff | delta 99.73083333333334% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
