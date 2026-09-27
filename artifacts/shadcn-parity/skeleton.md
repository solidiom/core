# skeleton — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b73c0d8f
Status: ❌ 4 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 6px | 4px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.44916666666667% | ❌ |
| tokens.Root.border-radius | 6px | 4px | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 100% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
