# checkbox — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 16 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.height | 16px | 20px | ❌ |
| tokens.Root.border-width | 1px | 2px | ❌ |
| behavior.reset | role= part=- button..grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground=checked span..grid place-content-center text-current=checked | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=unchecked | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.height | 16px | 20px | ❌ |
| tokens.Root.border-width | 1px | 2px | ❌ |
| behavior.reset | role= part=- button..grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground=checked span..grid place-content-center text-current=checked | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=unchecked | ❌ |
| pixels.light.checked | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.height | 16px | 20px | ❌ |
| tokens.Root.border-width | 1px | 2px | ❌ |
| behavior.reset | role= part=- button..grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground=checked span..grid place-content-center text-current=checked | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=unchecked | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Root.border-radius | 4px | 4px | ✅ |
| tokens.Root.height | 16px | 20px | ❌ |
| tokens.Root.border-width | 1px | 2px | ❌ |
| behavior.reset | role= part=- button..grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground=checked span..grid place-content-center text-current=checked | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed button.root.=unchecked | ❌ |
| pixels.dark.checked | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
