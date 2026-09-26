# field — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 5092f901
Status: ❌ 4 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Label.color | rgb(2, 8, 23) | rgb(17, 24, 39) | ❌ |
| tokens.Label.font-size | 14px | 14px | ✅ |
| tokens.Label.font-weight | 500 | 600 | 🟡 accepted |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 48.475% | ❌ |
| tokens.Label.color | rgb(248, 250, 252) | rgb(241, 245, 249) | ❌ |
| tokens.Label.font-size | 14px | 14px | ✅ |
| tokens.Label.font-weight | 500 | 600 | 🟡 accepted |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 98.53333333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
