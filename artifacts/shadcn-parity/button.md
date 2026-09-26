# button — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 5092f901
Status: ❌ 24 failures, 8 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.background-color | rgb(37, 99, 235) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Root.color | rgb(248, 250, 252) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 16px | ❌ |
| tokens.Root.font-weight | 500 | 600 | ❌ |
| tokens.Root.height | 36px | 46px | ❌ |
| tokens.Root.border-width | 0px | 1px | ❌ |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.1% | ❌ |
| tokens.Root.background-color | rgba(37, 99, 235, 0.9) | rgb(255, 255, 255) | 🟡 accepted |
| tokens.Root.color | rgb(248, 250, 252) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 16px | ❌ |
| tokens.Root.font-weight | 500 | 600 | ❌ |
| tokens.Root.height | 36px | 46px | ❌ |
| tokens.Root.border-width | 0px | 1px | ❌ |
| behavior.hover | role= part=- | role= part=- | ✅ |
| pixels.light.hover | ≤ 1% diff | delta 99.875% | ❌ |
| tokens.Root.background-color | rgba(59, 130, 246, 0.9) | rgb(30, 41, 59) | 🟡 accepted |
| tokens.Root.color | rgb(15, 23, 42) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 16px | ❌ |
| tokens.Root.font-weight | 500 | 600 | ❌ |
| tokens.Root.height | 36px | 46px | ❌ |
| tokens.Root.border-width | 0px | 1px | ❌ |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.9625% | ❌ |
| tokens.Root.background-color | rgba(59, 130, 246, 0.9) | rgb(30, 41, 59) | 🟡 accepted |
| tokens.Root.color | rgb(15, 23, 42) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Root.border-radius | 6px | 8px | ❌ |
| tokens.Root.padding | 8px 16px | 8px 16px | ✅ |
| tokens.Root.font-size | 14px | 16px | ❌ |
| tokens.Root.font-weight | 500 | 600 | ❌ |
| tokens.Root.height | 36px | 46px | ❌ |
| tokens.Root.border-width | 0px | 1px | ❌ |
| behavior.hover | role= part=- | role= part=- | ✅ |
| pixels.dark.hover | ≤ 1% diff | delta 99.9625% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
