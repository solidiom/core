# input-otp — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 570d3a83
Status: ❌ 2 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Slot.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Slot.height | 36px | 40px | 🟡 accepted |
| tokens.Slot.border-width | 1px | 1px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.22833333333332% | ❌ |
| tokens.Slot.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Slot.height | 36px | 40px | 🟡 accepted |
| tokens.Slot.border-width | 1px | 1px | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.4675% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
