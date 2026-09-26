# dialog — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ddb8b2cf
Status: ❌ 6 failures, 5 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- open=Trigger:false open=Content:false | focus=- open=Trigger:false open=Content:false | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.83833333333332% | ❌ |
| tokens.Content.background-color | rgb(255, 255, 255) | rgb(255, 255, 255) | ✅ |
| tokens.Content.border-radius | 8px | 12px | 🟡 accepted |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 24px | 24px | ✅ |
| tokens.Content.width | 512px | 512px | ✅ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | color(srgb 0.0666667 0.0941176 0.152941 / 0.55) | 🟡 accepted |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.light.open | ≤ 1% diff | delta 94.13583333333332% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.light.close-esc | ≤ 1% diff | delta 99.92416666666666% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.875% | ❌ |
| tokens.Content.background-color | rgb(2, 8, 23) | rgb(30, 41, 59) | 🟡 accepted |
| tokens.Content.border-radius | 8px | 12px | 🟡 accepted |
| tokens.Content.border-width | 1px | 1px | ✅ |
| tokens.Content.padding | 24px | 24px | ✅ |
| tokens.Content.width | 512px | 512px | ✅ |
| tokens.Backdrop.background-color | rgba(0, 0, 0, 0.8) | color(srgb 0.945098 0.960784 0.976471 / 0.55) | 🟡 accepted |
| behavior.open | focus=Content | focus=Content | ✅ |
| pixels.dark.open | ≤ 1% diff | delta 99.995% | ❌ |
| tokens.Content.background-color | (missing element) | (missing element) | ✅ |
| tokens.Content.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Content.border-width | (missing element) | (missing element) | ✅ |
| tokens.Content.padding | (missing element) | (missing element) | ✅ |
| tokens.Content.width | (missing element) | (missing element) | ✅ |
| tokens.Backdrop.background-color | (missing element) | (missing element) | ✅ |
| behavior.close-esc | focus=Trigger open=Trigger:false open=Content:false | focus=Trigger open=Trigger:false open=Content:false | ✅ |
| pixels.dark.close-esc | ≤ 1% diff | delta 99.875% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
