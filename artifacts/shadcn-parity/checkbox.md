# checkbox — shadcn parity
Reference: shadcn@3.8.5, solidiom @ 5092f901
Status: ❌ 8 failures, 0 accepted divergences

| Signal | Expected (shadcn) | Actual (solidiom) | Verdict |
|---|---|---|---|
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Root.border-radius | 0px | 0px | ✅ |
| tokens.Root.height | 20px | 24.5px | ❌ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.light.default | ≤ 1% diff | delta 36.8925% | ❌ |
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Root.border-radius | 0px | 0px | ✅ |
| tokens.Root.height | 20px | 24.5px | ❌ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.light.checked | ≤ 1% diff | delta 36.8925% | ❌ |
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Root.border-radius | 0px | 0px | ✅ |
| tokens.Root.height | 20px | 24.5px | ❌ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.dark.default | ≤ 1% diff | delta 99.84416666666667% | ❌ |
| tokens.Root.background-color | rgba(0, 0, 0, 0) | rgba(0, 0, 0, 0) | ✅ |
| tokens.Root.border-radius | 0px | 0px | ✅ |
| tokens.Root.height | 20px | 24.5px | ❌ |
| tokens.Root.border-width | 0px | 0px | ✅ |
| behavior.reset | role= part=- | role= part=- | ✅ |
| pixels.dark.checked | ≤ 1% diff | delta 99.84416666666667% | ❌ |

[side-by-side PNGs + delta heatmaps: see assets/]
