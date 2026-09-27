# tabs — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 20 failures, 13 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.List.background-color | rgb(241, 245, 249) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.List.border-radius | 8px | 0px | ❌ |
| tokens.List.padding | 4px | 0px | ❌ |
| tokens.Trigger.background-color | rgb(255, 255, 255) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 0px | 🟡 accepted |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 28px | 46.5px | ❌ |
| tokens.Trigger.padding | 4px 12px | 10px 16px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 54.290000000000006% | ❌ |
| tokens.List.background-color | rgb(241, 245, 249) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.List.border-radius | 8px | 0px | ❌ |
| tokens.List.padding | 4px | 0px | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Trigger.border-radius | 6px | 0px | 🟡 accepted |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 28px | 46.5px | ❌ |
| tokens.Trigger.padding | 4px 12px | 10px 16px | ❌ |
| behavior.click-tab-2 | focus=List | focus=List | ✅ |
| pixels.light.click-tab-2 | ≤ 1% diff | delta 51.57833333333334% | ❌ |
| tokens.List.background-color | rgb(30, 41, 59) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.List.border-radius | 8px | 0px | ❌ |
| tokens.List.padding | 4px | 0px | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Trigger.border-radius | 6px | 0px | 🟡 accepted |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 28px | 46.5px | ❌ |
| tokens.Trigger.padding | 4px 12px | 10px 16px | ❌ |
| behavior.reset | focus=List | focus=List | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 63.17333333333334% | ❌ |
| tokens.List.background-color | rgb(30, 41, 59) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.List.border-radius | 8px | 0px | ❌ |
| tokens.List.padding | 4px | 0px | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Trigger.border-radius | 6px | 0px | 🟡 accepted |
| tokens.Trigger.font-weight | 500 | 600 | 🟡 accepted |
| tokens.Trigger.height | 28px | 46.5px | ❌ |
| tokens.Trigger.padding | 4px 12px | 10px 16px | ❌ |
| behavior.click-tab-2 | focus=List | focus=List | ✅ |
| pixels.dark.click-tab-2 | ≤ 1% diff | delta 63.17333333333334% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
