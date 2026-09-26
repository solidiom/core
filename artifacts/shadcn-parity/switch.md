# switch — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 5092f901
Status: ❌ 16 failures, 6 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Thumb.background-color | rgb(37, 99, 235) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.Thumb.height | 20px | 26.25px | ❌ |
| tokens.Thumb.width | 36px | 192.578px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 0px | ❌ |
| behavior.reset | role= part=- button:switch=checked span:bg-backgroundblockdata-statecheckedtranslate-x-4data-state=checked | role= part=- button:root=off span:thumb=off | ❌ |
| pixels.light.default | ≤ 1% diff | delta 83.91999999999999% | ❌ |
| tokens.Thumb.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Thumb.height | 20px | 26.25px | ❌ |
| tokens.Thumb.width | 36px | 192.578px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 0px | ❌ |
| behavior.focus | role=switch part=Root button:switch=unchecked span:bg-backgroundblockdata-statecheckedtranslate-x-4data-state=unchecked | role=switch part=Root button:root=on span:thumb=on | ❌ |
| pixels.light.focus | ≤ 1% diff | delta 53.75% | ❌ |
| tokens.Thumb.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Thumb.height | 20px | 26.25px | ❌ |
| tokens.Thumb.width | 36px | 192.578px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 0px | ❌ |
| behavior.reset | role=switch part=Root button:switch=unchecked span:bg-backgroundblockdata-statecheckedtranslate-x-4data-state=unchecked | role=switch part=Root button:root=on span:thumb=on | ❌ |
| pixels.dark.default | ≤ 1% diff | delta 99.62416666666667% | ❌ |
| tokens.Thumb.background-color | rgba(59, 130, 246, 0.992) | rgba(0, 0, 0, 0) | 🟡 accepted |
| tokens.Thumb.height | 20px | 26.25px | ❌ |
| tokens.Thumb.width | 36px | 192.578px | 🟡 accepted |
| tokens.Thumb.border-radius | 9999px | 0px | ❌ |
| behavior.focus | role=switch part=Root button:switch=checked span:bg-backgroundblockdata-statecheckedtranslate-x-4data-state=checked | role=switch part=Root button:root=off span:thumb=off | ❌ |
| pixels.dark.focus | ≤ 1% diff | delta 99.435% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
