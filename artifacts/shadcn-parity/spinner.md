# spinner — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 65af4c6b
Status: ❌ 2 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.width | 16px | 16px | ✅ |
| tokens.Root.height | 16px | 16px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 49.80583333333333% | ❌ |
| tokens.Root.width | 16px | 16px | ✅ |
| tokens.Root.height | 16px | 16px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.97333333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
