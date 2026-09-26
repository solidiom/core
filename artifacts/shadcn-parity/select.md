# select — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 5092f901
Status: ❌ 16 failures, 4 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | role= part=- button:combobox=closed | role= part=- button:trigger=closed | ❌ |
| pixels.light.default | ≤ 1% diff | delta 99.84583333333333% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(248, 250, 252) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | role=option part=Content button:combobox=open div:listbox=open div:option=unchecked | role=combobox part=Trigger button:trigger=open div:content=open div:item=unchecked | ❌ |
| pixels.light.open | ≤ 1% diff | delta 99.78083333333333% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.reset | role=combobox part=Trigger button:combobox=closed | role=combobox part=Trigger button:trigger=closed | ❌ |
| pixels.dark.default | ≤ 1% diff | delta 99.97916666666666% | ❌ |
| tokens.Trigger.background-color | rgba(0, 0, 0, 0) | rgb(15, 23, 42) | 🟡 accepted |
| tokens.Trigger.border-radius | 6px | 8px | ❌ |
| tokens.Trigger.height | 36px | 46px | ❌ |
| tokens.Trigger.border-width | 1px | 1px | ✅ |
| behavior.open | role=option part=Content button:combobox=open div:listbox=open div:option=unchecked | role=combobox part=Trigger button:trigger=open div:content=open div:item=unchecked | ❌ |
| pixels.dark.open | ≤ 1% diff | delta 99.99083333333333% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
