# button — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 4 failures, 8 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.background-color | rgb(37, 99, 235) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Root.color | rgb(248, 250, 252) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.font-weight | 500 | 500 | ✅ |
| tokens.Root.height | 36px | 36px | ✅ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.20666666666666% | ❌ |
| tokens.Root.background-color | rgba(37, 99, 235, 0.9) | rgb(255, 255, 255) | 🟡 accepted |
| tokens.Root.color | rgb(248, 250, 252) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.font-weight | 500 | 500 | ✅ |
| tokens.Root.height | 36px | 36px | ✅ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.hover | focus=- | focus=- | ✅ |
| pixels.light.hover | ≤ 1% diff | delta 99.80166666666666% | ❌ |
| tokens.Root.background-color | rgba(59, 130, 246, 0.9) | rgb(30, 41, 59) | 🟡 accepted |
| tokens.Root.color | rgb(15, 23, 42) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.font-weight | 500 | 500 | ✅ |
| tokens.Root.height | 36px | 36px | ✅ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.9075% | ❌ |
| tokens.Root.background-color | rgba(59, 130, 246, 0.9) | rgb(30, 41, 59) | 🟡 accepted |
| tokens.Root.color | rgb(15, 23, 42) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.font-weight | 500 | 500 | ✅ |
| tokens.Root.height | 36px | 36px | ✅ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.hover | focus=- | focus=- | ✅ |
| pixels.dark.hover | ≤ 1% diff | delta 99.9075% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
