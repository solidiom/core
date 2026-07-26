# Implementation Plan for Missing Primitives

Based on the `docs/primitives-comparison.md` matrix, `solidiom` is missing a few specific primitives and components compared to `shadcn/ui` and Astryx. Because `solidiom` strictly separates behavior (Primitives) from styling (Recipes), we must divide the missing items into two distinct tracks: **Core Primitives** and **Blocks/Recipes**.

---

## Track 1: Core Primitives (Behavior & Accessibility)

These items require complex runtime logic, state management, or specific W3C ARIA accessibility patterns. They belong in the `packages/` directory as headless SolidJS components.

### 1. Navigation Menu / TopNav (Priority 2)

- **What it is:** A dropdown navigation system with accessible sub-menus (often referred to as a "Mega Menu").
- **Behavior required:**
  - Roving tabindex for keyboard navigation between top-level triggers.
  - Delayed hover interactions (so sub-menus don't close instantly when moving the mouse diagonally).
  - Focus trapping inside the active sub-menu.
  - `aria-expanded` and `aria-controls` management.
- **Implementation Steps:**
  1.  Create `@solidiom/navigation-menu`.
  2.  Implement `Root`, `List`, `Item`, `Trigger`, `Content`, and `Link` sub-components.
  3.  Integrate with your positioning adapter (Floating UI) for the dropdown content.

### 2. Toggle Button (Priority 2)

- **What it is:** A two-state button (on/off). _Note: `solidiom` has `toggle-group`, but explicitly missing a standalone `toggle-button`._
- **Behavior required:**
  - Managing `aria-pressed="true | false"`.
  - Handling `onChange` and `checked` state (controlled/uncontrolled).
- **Implementation Steps:**
  1.  Create `@solidiom/toggle`.
  2.  Implement `Root` component using SolidJS `createSignal` and merging button props.

### 3. Input OTP (Priority 3)

- **What it is:** A One-Time Password input field (e.g., entering a 6-digit 2FA code).
- **Behavior required:**
  - Managing focus between multiple hidden input fields or a single hidden input mapped to multiple visual slots.
  - Handling paste events (pasting a 6-digit code should fill all slots automatically).
  - Arrow key navigation between slots.
- **Implementation Steps:**
  1.  Create `@solidiom/input-otp`.
  2.  Provide a single hidden input context that tracks the value, mapped to visual `Slot` and `Group` components.

### 4. Scroll Area (Priority 3)

- **What it is:** A custom-styled scrollbar implementation that works across all browsers while retaining native scrolling performance.
- **Behavior required:**
  - Calculating thumb size based on scroll viewport ratio.
  - Dragging the scroll thumb.
  - Keyboard scrolling (Page Up/Down).
  - Hiding the thumb when idle (optional behavior).
- **Implementation Steps:**
  1.  Create `@solidiom/scroll-area`.
  2.  Implement `Root`, `Viewport`, `Scrollbar`, and `Thumb` components. Requires `ResizeObserver` to recalculate thumb sizes dynamically.

---

## Track 2: Blocks & Recipes (Styling & Layout)

These items do not require new low-level accessible primitives. They are composed of standard HTML elements or existing `solidiom` primitives and belong in the `apps/docs` (as copy-paste templates) or your Recipe packages.

### 5. App Shell / Layout (Priority 3)

- **Implementation:** Do not build an `@solidiom/app-shell` primitive.
- **Plan:** Create a generic layout recipe (using CSS Grid/Flexbox for sidebar, header, and main content areas). Distribute this as a "Block" in your documentation that users can copy.

### 6. Chat / Composer (Priority 3)

- **Implementation:** Do not build a monolithic chat primitive.
- **Plan:** This is a classic "Block." It should be built in the documentation by composing existing primitives:
  - `@solidiom/scroll-area` (for the message list).
  - `@solidiom/avatar` (for user profiles).
  - `@solidiom/button` (for the send action).
  - `@solidiom/input` or a dynamic textarea (for the composer).

### 7. Code / Syntax (Priority 3)

- **Implementation:** Purely a styling recipe combined with a third-party tokenizer.
- **Plan:** Provide a Tailwind/UnoCSS recipe (e.g., `recipe-code-block`) in the documentation. Recommend users integrate it with `shiki` or `prismjs` for syntax highlighting, rather than building a custom parser.

### 8. Aspect Ratio (Priority 3)

- **Implementation:** The web now supports the native CSS `aspect-ratio` property across all modern browsers. A JavaScript primitive is essentially obsolete.
- **Plan:** Create a utility class or recipe (e.g., `aspect-video`, `aspect-square`) in your Tailwind/UnoCSS plugins.

---

## Suggested Execution Roadmap

1.  **Phase 1 (Quick Wins):** Implement **Toggle Button**. It's simple, requires very little code, and completes the button suite.
2.  **Phase 2 (High Value):** Implement **Navigation Menu**. This is the biggest gap in most UI libraries because delayed-hover intent and roving focus are difficult to get right. Getting this into `solidiom` will be a massive selling point.
3.  **Phase 3 (Docs Enrichment):** Build out the **App Shell** and **Aspect Ratio** recipes/blocks in the documentation site to prove the system's extensibility.
4.  **Phase 4 (Niche Primitives):** Tackle **Input OTP** and **Scroll Area** as requested by the community.
