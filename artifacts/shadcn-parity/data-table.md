# data-table — shadcn parity
Reference: shadcn@3.8.5, solidiom @ ef92d5ae
Status: ❌ 4 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.HeaderCell.height | 40px | 40px | ✅ |
| tokens.HeaderCell.padding | 1px 8px | 1px 8px | ✅ |
| tokens.HeaderCell.font-size | 14px | 14px | ✅ |
| tokens.HeaderCell.font-weight | 500 | 500 | ✅ |
| tokens.Cell.padding | 8px | 8px | ✅ |
| tokens.Cell.font-size | 14px | 14px | ✅ |
| tokens.Cell.font-weight | 500 | 400 | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 9.898333333333333% | ❌ |
| tokens.HeaderCell.height | 40px | 40px | ✅ |
| tokens.HeaderCell.padding | 1px 8px | 1px 8px | ✅ |
| tokens.HeaderCell.font-size | 14px | 14px | ✅ |
| tokens.HeaderCell.font-weight | 500 | 500 | ✅ |
| tokens.Cell.padding | 8px | 8px | ✅ |
| tokens.Cell.font-size | 14px | 14px | ✅ |
| tokens.Cell.font-weight | 500 | 400 | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 97.97916666666666% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
