# field — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 4 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Label.font-size | 14px | 14px | ✅ |
| behavior.reset | role= part=- | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Label.font-size | 14px | 14px | ✅ |
| behavior.reset | role= part=- | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
