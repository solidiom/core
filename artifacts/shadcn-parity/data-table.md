# data-table — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 65af4c6b
Status: ❌ 2 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.HeaderCell.height | 40px | 40px | ✅ |
| tokens.HeaderCell.padding | 1px 8px | 1px 8px | ✅ |
| tokens.HeaderCell.font-size | 14px | 14px | ✅ |
| tokens.HeaderCell.font-weight | 500 | 500 | ✅ |
| tokens.Cell.padding | 8px | 8px | ✅ |
| tokens.Cell.font-size | 14px | 14px | ✅ |
| tokens.Cell.font-weight | 500 | 500 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 10.003333333333334% | ❌ |
| tokens.HeaderCell.height | 40px | 40px | ✅ |
| tokens.HeaderCell.padding | 1px 8px | 1px 8px | ✅ |
| tokens.HeaderCell.font-size | 14px | 14px | ✅ |
| tokens.HeaderCell.font-weight | 500 | 500 | ✅ |
| tokens.Cell.padding | 8px | 8px | ✅ |
| tokens.Cell.font-size | 14px | 14px | ✅ |
| tokens.Cell.font-weight | 500 | 500 | ✅ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 97.97% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
