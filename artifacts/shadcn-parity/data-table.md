# data-table — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b73c0d8f
Status: ❌ 12 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.HeaderCell.height | 40px | 49.5px | ❌ |
| tokens.HeaderCell.padding | 1px 8px | 12px 16px | ❌ |
| tokens.HeaderCell.font-size | 14px | 14px | ✅ |
| tokens.HeaderCell.font-weight | 500 | 700 | ❌ |
| tokens.Cell.padding | 8px | 10px 16px | ❌ |
| tokens.Cell.font-size | 14px | 14px | ✅ |
| tokens.Cell.font-weight | 500 | 400 | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 8.260000000000002% | ❌ |
| tokens.HeaderCell.height | 40px | 49.5px | ❌ |
| tokens.HeaderCell.padding | 1px 8px | 12px 16px | ❌ |
| tokens.HeaderCell.font-size | 14px | 14px | ✅ |
| tokens.HeaderCell.font-weight | 500 | 700 | ❌ |
| tokens.Cell.padding | 8px | 10px 16px | ❌ |
| tokens.Cell.font-size | 14px | 14px | ✅ |
| tokens.Cell.font-weight | 500 | 400 | ❌ |
| behavior.reset | focus=- | focus=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.46416666666667% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
