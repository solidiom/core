# breadcrumb — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f771f2dd
Status: ❌ 4 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.List.font-size | 14px | 16px | ❌ |
| tokens.List.color | rgb(100, 116, 139) | rgb(17, 24, 39) | 🟡 accepted |
| tokens.Link.font-size | 14px | 14px | ✅ |
| tokens.Link.font-weight | 400 | 400 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 6.880833333333333% | ❌ |
| tokens.List.font-size | 14px | 16px | ❌ |
| tokens.List.color | rgb(148, 163, 184) | rgb(241, 245, 249) | 🟡 accepted |
| tokens.Link.font-size | 14px | 14px | ✅ |
| tokens.Link.font-weight | 400 | 400 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.9025% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
