# slider — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 8 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.reset | role= part=- | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.focus | role=slider part=Root | role=slider part=Root button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.light.focus | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.reset | role=slider part=Root | role=slider part=Root button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Thumb.height | 16px | 16px | ✅ |
| tokens.Thumb.width | 16px | 16px | ✅ |
| behavior.focus | role=slider part=Root | role=slider part=Root button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.dark.focus | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
