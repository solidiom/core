# button — shadcn parity
Reference: shadcn@3.8.5, solidiom @ f6c117f2
Status: ❌ 4 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.fontSize |  |  | ✅ |
| behavior.reset | role= part=Root | role= part=Root button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.toggle.=off | ❌ |
| pixels.light.default | ≤ 1% diff | delta 99.61870659722221% | ❌ |
| tokens.Root.fontSize |  |  | ✅ |
| behavior.reset | role= part=Root | role= part=Root button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.toggle.=off | ❌ |
| pixels.dark.default | ≤ 1% diff | delta 99.99305555555556% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
