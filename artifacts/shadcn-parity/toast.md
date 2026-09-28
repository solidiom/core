# toast — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 2b33596b
Status: ❌ 4 failures, 8 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | (missing element) | (missing element) | ✅ |
| tokens.Root.border-width | (missing element) | (missing element) | ✅ |
| tokens.Root.font-size | (missing element) | (missing element) | ✅ |
| tokens.Title.font-size | (missing element) | (missing element) | ✅ |
| tokens.Title.font-weight | (missing element) | (missing element) | ✅ |
| tokens.Description.font-size | (missing element) | (missing element) | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 99.66000000000001% | ❌ |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.font-size | 16px | 16px | ✅ |
| tokens.Title.font-size | 14px | 14px | ✅ |
| tokens.Title.font-weight | 600 | 600 | ✅ |
| tokens.Description.font-size | 12px | 12px | ✅ |
| behavior.show-toast | focus=- | focus=- | 🟡 accepted |
| pixels.light.show-toast | ≤ 1% diff | delta 99.97083333333333% | ❌ |
| tokens.Root.border-radius | (missing element) | 6px | 🟡 accepted |
| tokens.Root.border-width | (missing element) | 1px | 🟡 accepted |
| tokens.Root.font-size | (missing element) | 16px | 🟡 accepted |
| tokens.Title.font-size | (missing element) | 14px | 🟡 accepted |
| tokens.Title.font-weight | (missing element) | 600 | 🟡 accepted |
| tokens.Description.font-size | (missing element) | 12px | 🟡 accepted |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.99916666666667% | ❌ |
| tokens.Root.border-radius | 6px | 6px | ✅ |
| tokens.Root.border-width | 1px | 1px | ✅ |
| tokens.Root.font-size | 16px | 16px | ✅ |
| tokens.Title.font-size | 14px | 14px | ✅ |
| tokens.Title.font-weight | 600 | 600 | ✅ |
| tokens.Description.font-size | 12px | 12px | ✅ |
| behavior.show-toast | focus=- | focus=- | 🟡 accepted |
| pixels.dark.show-toast | ≤ 1% diff | delta 99.98% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
