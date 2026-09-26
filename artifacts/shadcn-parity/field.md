# field — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ac63cebb
Status: ❌ 2 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Label.color | rgb(2, 8, 23) | rgb(2, 8, 23) | ✅ |
| tokens.Label.font-size | 14px | 14px | ✅ |
| tokens.Label.font-weight | 500 | 500 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 48.376666666666665% | ❌ |
| tokens.Label.color | rgb(248, 250, 252) | rgb(248, 250, 252) | ✅ |
| tokens.Label.font-size | 14px | 14px | ✅ |
| tokens.Label.font-weight | 500 | 500 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 98.52666666666666% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
