# Documentation Improvement Plan

Based on the strengths of **shadcn/ui** and Meta's **Astryx**, here is a strategic plan to elevate the `@solidiom/docs` site into a world-class documentation experience.

Since `solidiom` is a behavior-first, SolidJS primitive library, the docs need to effectively bridge the gap between "low-level APIs" and "beautiful, ready-to-use UI."

---

## 1. The "Astryx" Grouping Strategy (Information Architecture)

A flat, alphabetical list of 50+ components is overwhelming. Astryx excels at grouping related concepts. We should structure the sidebar and routing logically:

### Group by Category (High-level)

- **Forms & Inputs:** Checkbox, Field, Input, RadioGroup, Select, Slider, Switch
- **Buttons:** Button, ToggleGroup
- **Overlays:** Dialog, AlertDialog, Drawer, Popover, Tooltip, HoverCard
- **Data Display:** Avatar, Badge, Card, Carousel, DataTable, Tree
- **Navigation:** Breadcrumb, Menu, ContextMenu, Pagination, Tabs
- **Feedback:** Alert, Meter, Progress, Skeleton, Toast

### Group by Family (Page-level)

Just like Astryx, don't create separate top-level pages for every single button type. Create a single `Button` section that includes tabs or sub-sections for:

- Standard Button
- Button Group
- Icon Button
- Toggle Button

---

## 2. The "Anatomy & Best Practices" Page Template

Every component page in `solidiom` should strictly follow this layout:

1.  **Hero Demo:** A large, interactive example of the component fully styled (using your Tailwind recipes) with a "View Code" toggle.
2.  **Usage Guidelines (The Astryx "Do's and Don'ts"):**
    - ✅ _Use a Button to trigger an action._
    - ❌ _Don't use a Button for navigation; use a Link instead._
3.  **Anatomy:** Since `solidiom` is headless, showing the structural composition is critical (similar to Radix UI).
    ```tsx
    <Select.Root>
      <Select.Trigger>
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content>
          <Select.Item />
        </Select.Content>
      </Select.Portal>
    </Select.Root>
    ```
4.  **Examples (Variants & States):** A gallery showing permutations (Sizes, Colors, Disabled states, Loading states).
5.  **Accessibility (A11y):** A table explicitly listing the keyboard interactions (e.g., `Space` opens the menu, `ArrowDown` navigates items). This proves your "behavior-first" philosophy.
6.  **API Reference:** A clear table of props, types, and default values for each primitive part.

---

## 3. Highlighting the "solidiom" Philosophy (Primitives vs. Recipes)

Shadcn intertwines structure and styling via Tailwind. Because `solidiom` strictly separates them (`primitives own behavior` · `recipes provide styling`), the docs need a unique feature: **The Styling Toggle.**

On code examples, include a toggle or tabs that lets the user see how the component is constructed:

- **Tab 1: Primitive (Unstyled):** Shows just the raw `@solidiom/button` logic.
- **Tab 2: Tailwind Recipe:** Shows how the `@solidiom/recipes-tailwind` classes are applied to the primitive.
- **Tab 3: UnoCSS Recipe:** Shows the `@solidiom/recipes-unocss` implementation.

---

## 4. Interactive "Playground" or "Blocks" Section

Shadcn became wildly popular because of its "Blocks" (Dashboard examples, Auth forms).

- Create a dedicated `/blocks` or `/examples` route in the docs.
- Provide 3-5 full-page layouts (e.g., a Settings Page, a Dashboard, a Login Screen) built entirely out of `solidiom` primitives and recipes.
- This proves to developers that they can build real, complex applications with your system, not just isolated buttons.

---

## 5. Technical Implementation in `apps/docs`

Currently, `apps/docs` uses a custom Vite + Solid Router setup with `shiki` for syntax highlighting.

- **MDX Integration:** Consider utilizing MDX (`vite-plugin-solid-mdx`) for documentation pages. It allows you to write Markdown for the "Best Practices" and "API" sections while directly importing live SolidJS components for the interactive demos.
- **Component Registry:** To mimic shadcn's CLI experience, build a `.json` registry in the docs that maps components to their raw source code. This allows users to copy-paste the recipes directly into their codebases if they prefer not to install the NPM packages.
