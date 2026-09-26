# radio-group — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 8 failures, 8 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.reset | role= part=- button..aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50=checked span..flex items-center justify-center=checked | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.item.=unchecked | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.focus | role=radio part=Item button..aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50=checked span..flex items-center justify-center=checked | role=radio part=Item button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.item.=checked | ❌ |
| pixels.light.focus | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.reset | role=radio part=Item button..aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50=checked span..flex items-center justify-center=checked | role=radio part=Item button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.item.=checked | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Indicator.height | 16px | 20px | 🟡 accepted |
| tokens.Indicator.border-radius | 9999px | 50% | 🟡 accepted |
| behavior.focus | role=radio part=Item button..aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50=checked span..flex items-center justify-center=checked | role=radio part=Item button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.item.=checked | ❌ |
| pixels.dark.focus | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
