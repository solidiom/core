# UI Primitives Comparison Matrix

This matrix compares the availability of UI primitives across **solidiom**, **shadcn/ui**, and Meta's **Astryx**.
The "Priority" column designates the implementation priority for `solidiom`:

- `1` = **Must Implement:** Core primitives required for almost any application.
- `2` = **Should Implement:** Important for complex applications or forms, but not strictly essential for an MVP.
- `3` = **Nice to Have:** Highly specialized, composite components, or elements better suited for the "Recipe" layer.

| Primitive / Component        | `solidiom` | `shadcn/ui` | `Astryx` | Priority | Notes                                                  |
| :--------------------------- | :----: | :---------: | :------: | :------: | :----------------------------------------------------- |
| **Accordion**                |   ✅   |     ✅      |    ❌    |    1     |                                                        |
| **Alert / Banner**           |   ✅   |     ✅      |    ✅    |    2     | Usually just styling, but might need ARIA live regions |
| **Alert Dialog**             |   ✅   |     ✅      |    ✅    |    1     | Crucial for accessible destructive actions             |
| **App Shell / Layout**       |   ❌   |     ❌      |    ✅    |    3     | Typically an application-level concern                 |
| **Aspect Ratio**             |   ❌   |     ✅      |    ✅    |    3     | Often handled via CSS `aspect-ratio` nowadays          |
| **Avatar**                   |   ✅   |     ✅      |    ✅    |    1     | Includes fallback and image loading states             |
| **Badge / Tag**              |   ✅   |     ✅      |    ✅    |    2     | Purely visual, suitable as a Recipe                    |
| **Breadcrumb**               |   ✅   |     ✅      |    ✅    |    2     |                                                        |
| **Button**                   |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Calendar**                 |   ✅   |     ✅      |    ✅    |    1     | Complex logic, good use-case for adapters              |
| **Card**                     |   ✅   |     ✅      |    ✅    |    2     | Purely visual (Recipe), unless it's a `ClickableCard`  |
| **Carousel**                 |   ✅   |     ✅      |    ✅    |    2     | Embla adapter provided                                 |
| **Chat / Composer**          |   ❌   |     ❌      |    ✅    |    3     | Highly specialized composite block                     |
| **Checkbox**                 |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Code / Syntax**            |   ❌   |     ❌      |    ✅    |    3     | Usually visual (Recipe) + Prism/Shiki                  |
| **Collapsible**              |   ✅   |     ✅      |    ✅    |    1     | Core building block for other primitives               |
| **Combobox / Typeahead**     |   ✅   |     ✅      |    ✅    |    1     | Crucial for complex forms                              |
| **Command Palette**          |   ✅   |     ✅      |    ✅    |    2     | Often built on top of Combobox                         |
| **Context Menu**             |   ✅   |     ✅      |    ✅    |    2     | Requires complex positioning (floating-ui adapter)     |
| **Data Table**               |   ✅   |     ✅      |    ✅    |    1     | Tanstack adapter provided                              |
| **Date Picker**              |   ✅   |     ✅      |    ✅    |    1     | Combines Calendar + Popover + Input                    |
| **Dialog / Modal**           |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Drawer**                   |   ✅   |     ✅      |    ❌    |    2     | Mobile-friendly alternative to Dialog                  |
| **Empty State**              |   ✅   |     ❌      |    ✅    |    3     | Usually a composite/Recipe                             |
| **Field / Form**             |   ✅   |     ✅      |    ✅    |    1     | Handles accessible IDs linking label/input/error       |
| **Hover Card**               |   ✅   |     ✅      |    ✅    |    2     |                                                        |
| **Input / TextInput**        |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Input OTP**                |   ❌   |     ✅      |    ❌    |    3     | Nice to have, specific use case                        |
| **Kbd (Keyboard Key)**       |   ✅   |     ❌      |    ✅    |    3     | Mostly styling (Recipe)                                |
| **Label**                    |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Listbox**                  |   ✅   |     ❌      |    ❌    |    1     | Core primitive under Select/Combobox                   |
| **Menu / DropdownMenu**      |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Meter**                    |   ✅   |     ❌      |    ❌    |    3     | Semantic HTML wrapper                                  |
| **Navigation Menu / TopNav** |   ❌   |     ✅      |    ✅    |    2     | Complex accessibility requirements                     |
| **Pagination**               |   ✅   |     ✅      |    ✅    |    2     |                                                        |
| **Popover**                  |   ✅   |     ✅      |    ✅    |    1     | Floating layer primitive                               |
| **Progress / ProgressBar**   |   ✅   |     ✅      |    ✅    |    2     |                                                        |
| **Radio Group**              |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Resizable Panels**         |   ✅   |     ✅      |    ✅    |    2     |                                                        |
| **Scroll Area**              |   ❌   |     ✅      |    ❌    |    3     | Custom scrollbars                                      |
| **Select / Selector**        |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Separator / Divider**      |   ✅   |     ✅      |    ✅    |    1     | `role="separator"`                                     |
| **Sheet / Offcanvas**        |   ✅   |     ✅      |    ❌    |    2     | Very similar to Drawer                                 |
| **Skeleton**                 |   ✅   |     ✅      |    ✅    |    2     | Visual Recipe                                          |
| **Slider**                   |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Spinner**                  |   ✅   |     ❌      |    ✅    |    3     | Visual Recipe                                          |
| **Switch / Toggle**          |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Tabs**                     |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Toast / Snackbar**         |   ✅   |     ✅      |    ✅    |    1     | Requires imperative API and portal                     |
| **Toggle Button**            |   ❌   |     ✅      |    ✅    |    2     |                                                        |
| **Toggle Group**             |   ✅   |     ✅      |    ❌    |    2     |                                                        |
| **Toolbar**                  |   ✅   |     ❌      |    ✅    |    2     | Roving tabindex manager                                |
| **Tooltip**                  |   ✅   |     ✅      |    ✅    |    1     |                                                        |
| **Tree / TreeList**          |   ✅   |     ❌      |    ✅    |    2     | Complex hierarchical focus management                  |
| **Virtual List**             |   ✅   |     ❌      |    ❌    |    2     | Tanstack virtual adapter                               |
| **Visually Hidden**          |   ✅   |     ❌      |    ✅    |    1     | Crucial for screen reader accessibility                |

## Key Takeaways

1. **solidiom is highly complete**: As a primitive library, `solidiom` already covers almost all Priority 1 and Priority 2 components found in shadcn/ui and Astryx.
2. **Astryx focuses heavily on layout/composite blocks**: Astryx includes many high-level composites (e.g., `AppShell`, `Chat`, `TopNavMegaMenu`) that should remain outside `solidiom` core primitives and be built as Blocks/Recipes instead.
3. **Missing Priorities**: `solidiom` lacks a few components that shadcn/ui provides, such as `NavigationMenu` (complex nested menus) and `InputOTP` (nice-to-have). Implementing a `NavigationMenu` primitive would be a valuable Priority 2 addition.
