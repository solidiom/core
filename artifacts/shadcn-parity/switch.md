# switch — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 12 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Thumb.height | 16px | 24px | ❌ |
| tokens.Thumb.width | 16px | 44px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.reset | role= part=- button..peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input=checked span..pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0=checked | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=off span.thumb.=off | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Thumb.height | 16px | 24px | ❌ |
| tokens.Thumb.width | 16px | 44px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.focus | role=switch part=- button..peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input=unchecked span..pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0=unchecked | role=switch part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=on span.thumb.=on | ❌ |
| pixels.light.focus | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Thumb.height | 16px | 24px | ❌ |
| tokens.Thumb.width | 16px | 44px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.reset | role=switch part=- button..peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input=unchecked span..pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0=unchecked | role=switch part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=on span.thumb.=on | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Thumb.height | 16px | 24px | ❌ |
| tokens.Thumb.width | 16px | 44px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 9999px | ✅ |
| behavior.focus | role=switch part=- button..peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input=checked span..pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0=checked | role=switch part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=off span.thumb.=off | ❌ |
| pixels.dark.focus | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
