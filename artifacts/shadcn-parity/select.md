# select — shadcn parity
Reference: shadcn@3.8.5, solidiom @ b7b01971
Status: ❌ 16 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | role= part=- button..flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1=closed | role= part=- button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.light.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | role=option part=Content button..flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1=open div..relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1=open div..relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50=unchecked | role=combobox part=Trigger button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed div.content.=open div.item.=unchecked | ❌ |
| pixels.light.open | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | role=combobox part=Trigger button..flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1=closed | role=combobox part=Trigger button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed | ❌ |
| pixels.dark.default | ≤ 1% diff | delta Infinity% | ❌ |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | role=option part=Content button..flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1=open div..relative z-50 max-h-[--radix-select-content-available-height] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-select-content-transform-origin] data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1=open div..relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50=unchecked | role=combobox part=Trigger button.trigger.=closed button.trigger.site-header__hamburger-button=closed button.trigger.docs-mobile-nav__trigger=closed div.content.=open div.item.=unchecked | ❌ |
| pixels.dark.open | ≤ 1% diff | delta Infinity% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
