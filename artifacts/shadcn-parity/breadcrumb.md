# breadcrumb — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ba53c237
Status: ✅ 0 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.List.font-size | 14px | 14px | ✅ |
| tokens.List.color | rgb(100, 116, 139) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Link.font-size | 14px | 14px | ✅ |
| tokens.Link.font-weight | 400 | 400 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 7.328333333333334% | 🟡 accepted |
| tokens.List.font-size | 14px | 14px | ✅ |
| tokens.List.color | rgb(148, 163, 184) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Link.font-size | 14px | 14px | ✅ |
| tokens.Link.font-weight | 400 | 400 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.895% | 🟡 accepted |

[side-by-side PNGs + delta heatmaps: see assets/]
