# spinner — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b73c0d8f
Status: ❌ 6 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.width | 16px | 24px | ❌ |
| tokens.Root.height | 16px | 24px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 30.275000000000002% | ❌ |
| tokens.Root.width | 16px | 24px | ❌ |
| tokens.Root.height | 16px | 24px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.94166666666666% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
