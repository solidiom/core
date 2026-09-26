# label — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 2 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.color | rgb(2, 8, 23) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.font-weight | 500 | 600 | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 43.1875% | ❌ |
| tokens.Root.color | rgb(248, 250, 252) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Root.font-size | 14px | 14px | ✅ |
| tokens.Root.font-weight | 500 | 600 | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.335% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
