# input-otp — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 4 failures, 2 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Slot.height | 36px | 40px | 🟡 accepted |
| tokens.Slot.border-width | 1px | 1px | ✅ |
| behavior.reset | role= part=- | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed div.slot.=inactive | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Slot.height | 36px | 40px | 🟡 accepted |
| tokens.Slot.border-width | 1px | 1px | ✅ |
| behavior.reset | role= part=- | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed div.slot.=inactive | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
