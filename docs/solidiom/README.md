# Solidiom Complete Brand and Website Strategy

**Brand:** Solidiom
**Primary domain:** `solidiomui.com`
**Category:** Solid-native interface infrastructure
**Primary audience:** Solid application teams, design-system engineers, product engineers, open-source maintainers, and enterprise platform teams

---

# 1. Executive direction

Solidiom should be positioned as more than a headless component library.

The complete product is a layered interface system:

```text
Behavioral foundation
        ↓
Headless primitives
        ↓
Source-owned components
        ↓
Application blocks
        ↓
Themes and design-system integration
        ↓
Registry, CLI, and agent tooling
```

The main competitive idea is:

> **Solidiom provides behavior teams can trust, source they can own, and design they can control.**

The brand should occupy the space between:

* Low-level accessibility libraries
* Headless primitive systems
* Source-distributed component registries
* Internal design-system infrastructure
* Application-building tools

The shadcn model proves the value of emphasizing open code, customization, components, and blocks rather than positioning the product as a conventional installed component dependency.  Astryx extends that model across components, templates, themes, a playground, and agent-ready design-system positioning.

Solidiom should adopt those useful product patterns while establishing a distinct point of view:

> **Native Solid behavior is the foundation. Source ownership is the delivery model. Accessibility is an explicit contract.**

---

# 2. Brand platform

## Brand purpose

Enable teams to build accessible Solid interfaces without surrendering design ownership or depending on framework patterns imported from another ecosystem.

## Brand mission

Create the most coherent Solid-native interface foundation for accessible primitives, source-owned components, production application patterns, and design-system tooling.

## Brand vision

A Solid team should be able to move from a behavioral primitive to a complete production interface without changing architectural models, replacing accessibility foundations, or adopting an unwanted visual system.

## Brand promise

> **Behavior you trust. Code you own. Design you control.**

## Primary tagline

> **Accessible behavior. Idiomatic Solid.**

## Product descriptor

> **Solid-native primitives and source-owned components.**

## Long-form positioning statement

Solidiom is a Solid-native interface system for building accessible, production-ready applications. Its behavior-first primitive layer provides explicit interaction and accessibility contracts. Its open-code UI layer distributes components, blocks, themes, and application patterns that become part of the consuming application.

## Market category

Use:

> **Solid-native interface infrastructure**

Avoid reducing the brand to:

* Component library
* Headless UI kit
* CSS framework
* Design system
* Solid port of a React project

Those may describe parts of the system, but not its strategic scope.

---

# 3. Brand principles

## 3.1 Native before compatible

Solidiom should be designed around Solid’s execution, reactivity, ownership, lifecycle, rendering, and composition model.

Compatibility must not require reproducing another framework’s mental model.

## 3.2 Behavior before appearance

Interaction logic, keyboard behavior, focus management, selection, dismissal, positioning, and accessibility semantics are designed before visual treatments.

## 3.3 Runtime before abstraction

Behavior should remain explicit, inspectable, predictable, testable, and debuggable.

## 3.4 Unstyled by default

The primitive layer must not require a CSS framework, styling runtime, token system, theme provider, or predefined visual language.

## 3.5 Source ownership over package opacity

Higher-level UI should be distributed as source that teams can inspect, alter, test, and govern.

## 3.6 Accessibility as a contract

Accessibility should be documented per primitive and composition, not presented as a generic badge.

## 3.7 Progressive adoption

A team should be able to adopt:

* One utility
* One primitive
* One composed component
* One application block
* One theme
* A complete product foundation

## 3.8 Design-system neutrality

Solidiom should integrate with:

* Plain CSS
* CSS modules
* Tailwind
* UnoCSS
* Panda CSS
* Vanilla Extract
* StyleX
* Custom token systems
* Enterprise design-system infrastructure

No single styling approach should define the architecture.

---

# 4. Brand architecture

## Masterbrand

# Solidiom

The public name remains **Solidiom**, even though the canonical domain is `solidiomui.com`.

Do not use “Solidiom UI” as the masterbrand. Use it for the source-owned component product.

## Product family

| Product                 | Role                                                | Delivery model     |
| ----------------------- | --------------------------------------------------- | ------------------ |
| **Solidiom Primitives** | Accessible behavior and interaction foundations     | Installed packages |
| **Solidiom UI**         | Composed, source-owned interface components         | Registry and CLI   |
| **Solidiom Blocks**     | Complete application sections and workflows         | Registry and CLI   |
| **Solidiom Templates**  | Full application starting points                    | Source templates   |
| **Solidiom Themes**     | Visual systems, tokens, and recipes                 | Registry packages  |
| **Solidiom Registry**   | Public and private source distribution              | Registry API       |
| **Solidiom CLI**        | Installation, update, inspection, and migration     | Command-line tool  |
| **Solidiom MCP**        | Agent-readable documentation and registry discovery | MCP server         |
| **Solidiom Labs**       | Experimental primitives and future capabilities     | Preview releases   |

## Recommended language

```text
Built with Solidiom Primitives
Added from Solidiom UI
Distributed through Solidiom Registry
Installed with Solidiom CLI
Customized with Solidiom Themes
```

---

# 5. Naming system

## Product names

Use direct, descriptive names.

```text
Solidiom Primitives
Solidiom UI
Solidiom Blocks
Solidiom Templates
Solidiom Themes
Solidiom Registry
Solidiom CLI
Solidiom MCP
```

## Component naming

Use familiar interface terminology.

```text
Dialog
Alert Dialog
Popover
Tooltip
Select
Combobox
Listbox
Menu
Context Menu
Tabs
Accordion
Disclosure
Toast
Command Menu
Tree View
Data Grid
Date Picker
Navigation Menu
```

Avoid creative component names that force users to learn Solidiom terminology before understanding the control.

## Package naming

Recommended:

```text
@solidiom/core
@solidiom/primitives
@solidiom/positioning
@solidiom/collection
@solidiom/testing
@solidiom/registry
@solidiom/themes
```

Use a single primitives package only when tree shaking, dependency boundaries, and release coordination remain acceptable. Otherwise, publish primitive-level packages under the shared scope.

## CLI naming

```bash
npx solidiom init
npx solidiom add dialog
npx solidiom add command-menu
npx solidiom add dashboard-shell
npx solidiom theme add graphite
npx solidiom diff dialog
npx solidiom update dialog
npx solidiom doctor
```

---

# 6. Verbal identity

## Voice

Solidiom should sound:

* Precise
* Direct
* Technical
* Transparent
* Calm
* Builder-oriented
* Independent

It should not sound:

* Trend-driven
* Mystical
* Aggressively promotional
* React-centric
* Visually prescriptive
* Overconfident about accessibility

## Core vocabulary

Prefer:

* Solid-native
* Behavior-first
* Runtime-first
* Source-owned
* Accessible interaction contract
* Unstyled by default
* Composable
* Inspectable
* Adaptable
* Production-oriented
* Design-system compatible
* Open code
* Explicit ownership

Avoid:

* Magic
* Effortless
* Pixel-perfect
* Beautiful by default
* Drop-in replacement
* Zero work
* Fully accessible
* Framework agnostic, when the product is intentionally Solid-native

## Headline patterns

Use short, declarative structures:

```text
Build interfaces the Solid way.
Start with behavior.
Own the component.
Bring your design system.
Accessibility is an interaction contract.
Source code is the integration surface.
```

## Primary homepage copy

### Eyebrow

**Solid-native interface infrastructure**

### Headline

# Build interfaces the Solid way.

### Supporting copy

Accessible runtime primitives and source-owned components for Solid. Start unstyled, compose with your design system, and own everything you ship.

### Primary CTA

**Explore components**

### Secondary CTA

**Read the architecture**

### Technical proof line

```text
Solid-native · Accessible · Runtime-first · Unstyled by default · Open code
```

## Alternative campaign line

# Start with behavior. Finish with your design.

## GitHub description

Solid-native accessible UI primitives and source-owned components. Behavior-first, runtime-first, and unstyled by default.

## Package description

Accessible, unstyled runtime primitives designed around Solid’s native execution and composition model.

---

# 7. Logo system

## Recommended logo direction

Use the **Bracket S** as the primary symbol.

### Concept

Two opposing bracket forms create an abstract `S` through negative space.

The brackets represent:

* Component boundaries
* Behavioral contracts
* Composable primitives
* Source ownership
* Interface structure

The central negative space represents the design freedom left to the consumer.

## Wordmark

Use a lowercase custom wordmark:

```text
solidiom
```

Characteristics:

* Geometric grotesk foundation
* Open counters
* Slightly customized `s`
* Distinctive `di` or `io` relationship
* Moderate width
* No excessive futurism
* High legibility at documentation-navigation sizes

## Logo versions

1. Primary horizontal lockup
2. Symbol-only
3. Stacked lockup
4. Monochrome light
5. Monochrome dark
6. Small-size simplified mark
7. Product lockups

```text
solidiom primitives
solidiom ui
solidiom registry
solidiom labs
```

## Logo behavior

The symbol should remain flat and geometric.

Avoid:

* 3D extrusion
* Gloss
* Permanent gradients
* Cubes
* Gemstones
* Literal code brackets with no distinguishing structure
* A permanent version number
* Embedding “UI” in the core mark

---

# 8. Visual identity

## 8.1 Brand concept

The visual system should express:

> **Structured behavior with open visual outcomes.**

Use structured grids, reactive paths, state diagrams, source annotations, and component boundaries.

The brand should look technical and refined, not decorative.

## 8.2 Color system

### Core neutrals

| Token         |     Value | Use                 |
| ------------- | --------: | ------------------- |
| **Ink 950**   | `#090D18` | Dark backgrounds    |
| **Ink 900**   | `#111827` | Primary text        |
| **Slate 700** | `#334155` | Secondary dark text |
| **Slate 500** | `#64748B` | Supporting text     |
| **Slate 300** | `#CBD5E1` | Borders             |
| **Slate 100** | `#F1F5F9` | Secondary surfaces  |
| **Canvas**    | `#F8FAFC` | Page background     |
| **White**     | `#FFFFFF` | Elevated surfaces   |

### Brand colors

| Token              |     Value | Use                                    |
| ------------------ | --------: | -------------------------------------- |
| **Runtime Violet** | `#625BF6` | Primary action and identity            |
| **Reactive Cyan**  | `#22B8F0` | Active states and diagrams             |
| **Signal Mint**    | `#2DD4A8` | Success and composition                |
| **Focus Lime**     | `#B7F34D` | Limited focus accents on dark surfaces |
| **Warning Amber**  | `#F59E0B` | Warnings                               |
| **Critical Red**   | `#E5484D` | Destructive states                     |

### Gradient

Use gradients only in large brand fields or diagrams:

```css
linear-gradient(
  135deg,
  #625BF6 0%,
  #22B8F0 52%,
  #2DD4A8 100%
)
```

Do not use gradients inside ordinary controls.

## 8.3 Theme strategy

The website should support light and dark modes.

### Light

* Canvas-based
* White elevated panels
* Dark ink text
* Violet actions
* Cyan and mint data accents

### Dark

* Ink 950 background
* Ink 900 surfaces
* Soft slate borders
* White primary text
* Cyan and mint diagrams
* Violet interactive states

Dark mode should not simply invert the light palette. It should have its own surface hierarchy.

## 8.4 Typography

### Primary interface typeface

**Inter Variable**

Use for:

* Navigation
* Headings
* Body copy
* Controls
* Documentation

### Technical typeface

**IBM Plex Mono**

Use for:

* Code
* Commands
* API names
* Attributes
* Package names
* Version labels
* Diagrams

### Display style

Large headings should use tight tracking and moderate line height.

```text
Display XL  72/76
Display L   60/64
H1          48/54
H2          38/44
H3          30/38
H4          24/32
Body L      18/30
Body        16/26
Small       14/22
Label       13/18
Code        14/22
```

## 8.5 Spacing

Use a 4-pixel base system.

```text
4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128
```

## 8.6 Radius

```text
Controls        8 px
Cards          12 px
Large panels   16 px
Hero demos     20 px
Pills          999 px
```

Avoid excessive 24–32 pixel rounding. Solidiom should feel precise rather than soft and lifestyle-oriented.

## 8.7 Borders

Use borders more frequently than shadows.

```text
Default border: 1px solid Slate 200
Dark border: 1px solid rgba(255,255,255,.10)
Active border: Runtime Violet
Focus ring: 2px external ring with offset
```

## 8.8 Shadows

Use only for layering and overlays.

```text
Card: subtle ambient shadow
Popover: medium directional shadow
Dialog: strong layered shadow
Code preview: no shadow or minimal shadow
```

## 8.9 Iconography

Use a consistent 1.75-pixel or 2-pixel stroke family.

Icons should be:

* Geometric
* Neutral
* Recognizable
* Consistent with interface semantics

Do not create a custom icon for every concept at launch. Prioritize product clarity.

## 8.10 Diagram language

Architecture diagrams should use:

* Rectangular boundaries
* State nodes
* Directed reactive paths
* Explicit ownership labels
* Package/source distinctions
* Accessible color and shape redundancy

---

# 9. Website ecosystem

## Recommended architecture

Keep the main public experience under one canonical origin:

```text
solidiomui.com
```

Use path-based sections for the human-facing site:

```text
solidiomui.com/
solidiomui.com/primitives
solidiomui.com/components
solidiomui.com/blocks
solidiomui.com/templates
solidiomui.com/themes
solidiomui.com/docs
solidiomui.com/accessibility
solidiomui.com/registry
solidiomui.com/enterprise
solidiomui.com/community
solidiomui.com/changelog
```

Use subdomains only for distinct applications or machine endpoints:

```text
registry.solidiomui.com
play.solidiomui.com
status.solidiomui.com
```

## Why one public origin

A unified origin provides:

* One search experience
* One design system
* Shared navigation
* Stronger conceptual continuity
* Easier cross-linking
* Reduced product fragmentation
* Simpler search-engine authority
* Clearer migration from primitives to components

The primitives documentation may be deployed as an independent application, but it should appear to users under the same domain and navigation system.

---

# 10. Global information architecture

## Primary navigation

```text
Primitives
Components
Blocks
Themes
Docs
Registry
```

## Secondary utility navigation

```text
Search
Playground
GitHub
Theme toggle
Version selector
```

## Expanded product menu

### Build

* Primitives
* Components
* Blocks
* Templates
* Themes

### Develop

* Documentation
* CLI
* Registry
* MCP
* Playground

### Learn

* Architecture
* Accessibility
* Guides
* Examples
* Changelog

### Community

* GitHub
* Discussions
* Roadmap
* Contributing
* Code of conduct

---

# 11. Main-site UX

## 11.1 Homepage

### Goal

Explain the product in under 20 seconds and move users into the right adoption layer.

### Section order

#### 1. Hero

* Category label
* Strong headline
* Concise proposition
* Primary CTA
* Secondary CTA
* Installation command
* Interactive UI preview

#### 2. Layer selector

A three-column model:

| Primitives         | Components           | Blocks                   |
| ------------------ | -------------------- | ------------------------ |
| Install behavior   | Own component source | Adapt complete workflows |
| Bring every style  | Change every line    | Ship product patterns    |
| Runtime dependency | Registry source      | Registry source          |

The cards should be clickable and preserve the user’s selected layer in subsequent browsing.

#### 3. Interactive behavior proof

Show one primitive, such as a combobox or dialog, rendered in three visual systems.

Users can switch:

```text
Unstyled
Product theme
Enterprise tokens
```

The interaction and keyboard behavior remain constant.

#### 4. Architecture section

Visualize:

```text
Solid application
  ├── Owned component source
  ├── Solidiom primitives
  ├── Consumer styling system
  └── Consumer application state
```

This section should explicitly distinguish installed behavior from copied source.

#### 5. Accessibility contract

Show a real primitive contract:

* Keyboard behavior
* Focus behavior
* Semantics
* Screen-reader expectations
* Automated tests
* Manual validation status

#### 6. Open-code workflow

Show:

```bash
npx solidiom add command-menu
```

Then display:

* Files added
* Dependencies introduced
* Primitive foundations used
* Diff/update options
* Ownership status

#### 7. Component gallery

Display a curated set of high-value components, not an exhaustive directory.

#### 8. Blocks preview

Show product-oriented patterns:

* Settings
* Resource list
* Dashboard
* Authentication
* Command center
* Administration

#### 9. Design-system integration

Show examples using:

* Plain CSS
* Tailwind
* CSS modules
* Enterprise tokens

#### 10. Agent and registry section

Explain:

* Machine-readable component metadata
* Registry discovery
* MCP access
* Private registries
* Organizational components

#### 11. Community and roadmap

Include:

* GitHub activity
* Current release
* Roadmap link
* Contribution entry points
* Accessibility review process

#### 12. Final CTA

> **Start with behavior. Build the interface your product requires.**

Buttons:

* Install primitives
* Browse components

---

# 12. Primitives-site UX

## 12.1 Primitives landing page

### Goal

Prove technical credibility and help users identify the correct primitive.

### Header

# Accessible behavior for Solid interfaces.

Explicit runtime primitives for focus, selection, disclosure, overlays, navigation, and complex interaction.

### Primary actions

* Install primitives
* Browse primitive index
* Review accessibility model

### Content sections

1. Primitive categories
2. Architecture overview
3. Controlled and uncontrolled state model
4. Composition model
5. Styling integration
6. Accessibility contracts
7. SSR and hydration
8. Testing guidance
9. Release and stability policy

## 12.2 Primitive directory

### Filters

```text
Category
Status
Release stage
Package
Interaction complexity
Accessibility review
```

### Categories

```text
Disclosure
Overlay
Navigation
Selection
Form controls
Collections
Feedback
Utilities
Positioning
Focus management
```

### Primitive cards

Each card should show:

* Name
* One-sentence purpose
* Release stage
* Package
* Accessibility review status
* Relevant interaction type
* Link to preview and API

Do not show visual thumbnails for every primitive. The behavior matters more than decorative variation.

## 12.3 Primitive detail page

Every primitive detail page should follow the same structure.

### Header

```text
Primitive name
Status badge
Version introduced
Package
GitHub source
```

### Tabs

```text
Overview
Examples
Accessibility
API
Styling
Testing
Releases
```

### Overview content

1. Purpose
2. When to use
3. When not to use
4. Interactive preview
5. Installation
6. Minimal implementation
7. Anatomy
8. State model
9. Composition examples

### Accessibility contract

Include a persistent, first-class section.

#### Semantics

* Roles
* States
* Properties
* Relationships

#### Keyboard interaction

Use a table:

| Key        | Behavior       | Conditions          |
| ---------- | -------------- | ------------------- |
| Enter      | Activates item | Focused item        |
| Escape     | Closes layer   | Dismissible state   |
| Arrow Down | Moves focus    | Vertical collection |

#### Focus model

Document:

* Initial focus
* Focus containment
* Focus restoration
* Disabled items
* Roving focus
* Virtual focus, when applicable

#### Screen-reader behavior

Explain expected announcements and known platform differences.

#### Testing status

```text
Automated unit tests
Browser interaction tests
Keyboard test suite
Screen-reader review
High-contrast review
Reduced-motion review
```

#### Consumer responsibility

Clearly identify what remains the application team’s responsibility.

### Styling page

Document:

* Data attributes
* CSS variables
* State selectors
* Parts
* Portals
* Positioning variables
* Animation lifecycle
* Reduced-motion behavior

Example:

```css
[data-state="open"] {}
[data-disabled] {}
[data-highlighted] {}
[data-orientation="vertical"] {}
```

### API reference

Use a split layout:

* Left: API navigation
* Center: detailed definitions
* Right: current section and related APIs

Each API item should include:

* Type
* Default
* Controlled behavior
* SSR notes
* Accessibility implications
* Usage example

### Testing page

Provide ready-to-use patterns for:

* Vitest
* Testing Library
* Playwright
* Keyboard interaction tests
* Focus assertions
* Portal testing
* Hydration tests

---

# 13. Components-site UX

## 13.1 Components directory

The components directory should feel visual and practical.

### Search

Support search by:

* Component name
* Use case
* Primitive
* Interaction
* Visual category
* Registry tag

### Filters

```text
Application
Navigation
Forms
Data display
Feedback
Overlay
Commerce
AI
Administration
Layout
```

### View options

* Gallery
* Compact list
* Dependency map

### Card content

* Live preview
* Component name
* Short use case
* Primitive dependencies
* Files added
* Theme compatibility
* CLI command
* Source preview

## 13.2 Component detail page

### Header

* Live preview
* Component name
* Description
* Add command
* Copy command
* Open in playground

### Tabs

```text
Preview
Code
Anatomy
Dependencies
Accessibility
Variants
Registry
```

### Required metadata

```text
Files added
Packages required
Primitive dependencies
Theme tokens
Accessibility notes
Supported styling approaches
Last reviewed version
Update status
```

### Source ownership panel

Clearly communicate:

> This component is added to your source tree. Your application owns the resulting code.

Include:

* File path preview
* License
* Update model
* Diff behavior
* Registry origin
* Integrity metadata

---

# 14. Blocks and templates UX

## Blocks directory

Organize around product outcomes, not UI atoms.

### Categories

```text
Authentication
Onboarding
Settings
Billing
Administration
Observability
Resource management
AI interfaces
Search
Commerce
Content
Application shells
```

### Block detail

Show:

* Full-page preview
* Responsive states
* Loading state
* Empty state
* Error state
* Permission-restricted state
* Mobile behavior
* Primitive dependency map
* Component dependency map
* Files and routes added
* Data boundary assumptions

## Templates

Templates should be explicitly opinionated.

Each template must state:

* Router assumptions
* Data-fetching assumptions
* Authentication model
* Styling system
* Theme
* Package manager
* Deployment target
* Included blocks
* Replaceable boundaries

Do not present templates as universal application architecture.

---

# 15. Themes UX

## Theme philosophy

Themes should be optional source-owned starting points, not runtime requirements.

## Themes directory

Each theme includes:

* Full component preview
* Light and dark modes
* Color tokens
* Typography
* Radius
* Density
* Motion
* Code export
* Compatibility matrix

## Theme builder

The playground should support:

```text
Hue
Contrast
Density
Radius
Typography
Surface depth
Border strength
Motion
```

Export options:

* CSS custom properties
* Tailwind tokens
* JSON token file
* Theme registry item

---

# 16. Search strategy

## Global search

Search must cover:

* Primitives
* Components
* Blocks
* Templates
* Documentation
* API symbols
* Guides
* Changelog
* Registry items

## Search result design

Each result should show its content type:

```text
Primitive
Component
API
Guide
Block
Theme
Release
```

## Command interface

Use `⌘K` or `Ctrl+K`.

Commands should include:

* Navigate
* Copy install command
* Open playground
* Change version
* Change theme
* Search API
* View source

---

# 17. Versioning UX

The primitives package and registry source will not always share the same release cadence.

Display:

```text
Primitives version
Registry schema version
Component revision
Theme revision
Documentation version
```

## Version selector

The version selector should:

* Persist across documentation
* Warn when viewing outdated versions
* Link migration guides
* Distinguish stable, preview, and canary releases
* Show API availability by version

## Status terminology

Use:

```text
Stable
Preview
Experimental
Deprecated
Removed
```

Each status must have a documented compatibility promise.

---

# 18. Accessibility UX for the website

The website itself must demonstrate the product’s standards.

## Required behaviors

* Fully keyboard-operable navigation
* Visible focus
* Skip links
* Reduced-motion support
* High-contrast compatibility
* Semantic heading structure
* Accessible live previews
* Preview reset controls
* Screen-reader labels for code actions
* No hover-only information
* No color-only status indication
* User-controlled animation
* Responsive text without clipping

## Preview isolation

Interactive examples should be isolated without making them inaccessible.

Provide:

* Preview title
* Instructions when interaction is complex
* Reset button
* Open in separate playground
* Keyboard instructions
* Source link

---

# 19. Responsive strategy

## Desktop

Use a 12-column layout with persistent documentation navigation.

## Tablet

Collapse right-side table of contents before collapsing primary documentation navigation.

## Mobile

Use:

* Compact top navigation
* Drawer-based documentation tree
* Sticky page title and version
* Full-width previews
* Horizontally scrollable code only when unavoidable
* Bottom action bar for install/copy/playground actions on component pages

Do not hide important API information on mobile.

---

# 20. Design-system implementation

## Website component layers

### Foundations

```text
Color
Typography
Spacing
Radius
Elevation
Motion
Breakpoints
Z-index
```

### Primitives

Use Solidiom Primitives wherever possible.

### Website components

```text
Button
Link
Badge
Card
Tabs
Code block
Preview frame
Search
Command palette
Navigation tree
Table of contents
API table
Status label
Install command
Dependency graph
Version selector
```

### Patterns

```text
Hero
Feature grid
Component gallery
Documentation layout
Primitive detail
Component detail
Block preview
Theme configurator
Migration notice
Release notes
```

## Dogfooding rule

The website should use Solidiom’s primitives and public component source.

Any website-only exception should be documented so it does not become an invisible parallel component system.

---

# 21. Technical website architecture

## Recommended stack

Use a Solid-based meta-framework compatible with the project’s Solid 2 direction.

The architecture should support:

* Static generation
* Server rendering
* Search indexing
* MDX or structured content
* Executable examples
* Versioned documentation
* Registry-backed previews
* Code extraction
* API generation
* Visual regression testing

## Content sources

```text
/docs
/primitives
/components
/blocks
/templates
/themes
/registry
/changelog
```

Use structured front matter for:

* Status
* Version
* Package
* Primitive dependencies
* Accessibility review
* Last updated
* Registry identifier
* Search keywords

## Registry integration

The website should consume the same registry metadata exposed to the CLI.

Do not maintain separate handwritten metadata for:

* Component dependencies
* Files added
* Versions
* Registry commands
* Theme compatibility

## Search indexing

Create separate indexes for:

* Documentation prose
* API symbols
* Registry metadata
* Component use cases
* Changelog and migrations

## Performance objectives

Prioritize:

* Static content delivery
* Minimal hydration
* Lazy preview execution
* Deferred code editors
* Optimized search payloads
* No unnecessary animation libraries
* Route-level code splitting

---

# 22. Content strategy

## Core content tracks

### Learn

* Why Solidiom
* Architecture
* Solid-native model
* Behavior-first design
* Accessibility contract model
* Source ownership model

### Build

* Installation
* Primitive guides
* Components
* Blocks
* Themes
* Testing

### Operate

* Versioning
* Migrations
* Registry governance
* Private registries
* Security
* Release policy

### Contribute

* Development environment
* Primitive proposal process
* Accessibility review
* Component submissions
* Theme submissions
* Governance

## Editorial cadence

Recommended recurring content:

* Monthly release notes
* Primitive architecture deep dives
* Accessibility review reports
* Migration guides
* Design-system integration examples
* Community component spotlights
* Roadmap updates

## Documentation quality bar

Every public API should include:

* Purpose
* Example
* Types
* Default behavior
* Accessibility impact
* SSR impact
* Testing guidance
* Migration history

---

# 23. SEO and discoverability

## Core search themes

```text
Solid UI primitives
Solid accessible components
Solid headless UI
Solid component library
Solid design system
Solid dialog
Solid select
Solid combobox
Solid 2 components
Open-code Solid components
Solid component registry
```

## Page-title formula

```text
Dialog primitive for Solid — Solidiom
Command menu component — Solidiom UI
Dashboard shell block — Solidiom Blocks
Accessibility architecture — Solidiom Docs
```

## Structured data

Use structured data for:

* Software application
* Documentation
* Breadcrumbs
* Articles
* Releases
* Source code repositories

## Landing pages

Create intent-specific pages:

```text
/solid-headless-ui
/solid-accessible-components
/solid-design-system
/solid-component-registry
/solid-2-ui-primitives
```

These should be substantive architectural pages, not thin SEO pages.

---

# 24. Community strategy

## Community entry points

* GitHub discussions
* Public roadmap
* Contribution guide
* Primitive proposal process
* Accessibility reviews
* Community registries
* Office hours or review sessions
* Showcase directory

## Contributor pathways

```text
Documentation
Examples
Testing
Accessibility
Primitive implementation
Components
Blocks
Themes
Tooling
Translations
```

## Trust signals

Display:

* Release cadence
* Maintainers
* Governance
* Security policy
* Browser support
* Accessibility review status
* API stability
* Support policy

---

# 25. Commercial and enterprise strategy

The open-source site should remain useful without forcing commercial conversion.

Potential enterprise capabilities:

* Private registries
* Signed registry artifacts
* Organization policies
* Approved component catalogs
* Internal themes
* Component provenance
* Support agreements
* Migration assistance
* Accessibility review services
* Long-term support channels
* Governance dashboards

## Enterprise page message

> **Standardize interface behavior without centralizing every product decision.**

Explain how platform and design-system teams can govern:

* Approved primitives
* Component origins
* Version ranges
* Themes
* Accessibility review
* Source provenance
* Update policies

---

# 26. Conversion strategy

## Primary conversions

1. Install a primitive
2. Add a component
3. Star or follow the repository
4. Join discussions
5. Create a private registry
6. Request enterprise information

## CTA hierarchy

### Developer pages

Primary:

```text
Copy install command
Add component
Open playground
```

Secondary:

```text
View source
Read accessibility contract
```

### Marketing pages

Primary:

```text
Explore components
Get started
```

Secondary:

```text
Read the architecture
View GitHub
```

### Enterprise pages

Primary:

```text
Discuss private registries
```

Secondary:

```text
Review governance architecture
```

---

# 27. Analytics and success metrics

## Acquisition

* Organic search traffic
* Documentation entry pages
* GitHub referrals
* Community referrals
* Direct branded traffic

## Activation

* Install-command copies
* CLI initialization
* Component additions
* Playground sessions
* Primitive example interactions

## Adoption

* Package downloads
* Registry requests
* Active installations
* Number of components added per project
* Repeat documentation usage

## Quality

* Documentation search success
* Search abandonment
* Accessibility issue rate
* API support questions
* Migration failure rate
* Broken-example rate

## Community

* Contributors
* Issue response time
* Pull-request review time
* Registry submissions
* Discussions resolved
* Showcase projects

## Enterprise

* Private registry inquiries
* Proof-of-concept starts
* Governance documentation engagement
* Support conversion

Avoid optimizing primarily for page views. The meaningful outcome is successful adoption.

---

# 28. Release roadmap

## Phase 1: Brand and primitive foundation

Deliver:

* Final identity
* Main site
* Primitive documentation
* Architecture pages
* Accessibility contract format
* Solidiom-to-Solidiom migration
* GitHub and package namespace transition

## Phase 2: Solidiom UI

Deliver:

* Registry schema
* CLI
* Initial component catalog
* Component detail pages
* Source ownership documentation
* Diff and update model

## Phase 3: Blocks, themes, and playground

Deliver:

* Block catalog
* Theme system
* Theme builder
* Interactive playground
* Responsive preview system
* Registry authoring tools

## Phase 4: Agent and enterprise capabilities

Deliver:

* MCP server
* Agent-readable registry metadata
* Private registries
* Signing and provenance
* Governance controls
* Enterprise support model

---

# 29. Minimum launch sitemap

```text
/
├── primitives
│   ├── overview
│   ├── installation
│   ├── architecture
│   ├── accessibility
│   ├── testing
│   └── [primitive]
├── components
│   └── [component]
├── blocks
│   └── [block]
├── themes
│   └── [theme]
├── docs
│   ├── getting-started
│   ├── styling
│   ├── composition
│   ├── ssr
│   ├── migrations
│   └── releases
├── registry
├── playground
├── accessibility
├── enterprise
├── community
├── changelog
└── roadmap
```

---

# 30. Homepage wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Logo  Primitives Components Blocks Themes Docs Registry  ⌘K │
├──────────────────────────────────────────────────────────────┤
│ Solid-native interface infrastructure                       │
│                                                              │
│ Build interfaces the Solid way.                             │
│ Accessible runtime primitives and source-owned components.  │
│                                                              │
│ [Explore components] [Read architecture]                    │
│ npx solidiom add command-menu                               │
│                                      [Interactive UI demo]   │
├──────────────────────────────────────────────────────────────┤
│ Primitives          Components          Blocks               │
│ Install behavior    Own source          Adapt workflows      │
├──────────────────────────────────────────────────────────────┤
│ Same behavior. Any design system.                            │
│ [Unstyled] [Product] [Enterprise]                            │
│ [Interactive dialog/combobox preview]                        │
├──────────────────────────────────────────────────────────────┤
│ Accessibility is an interaction contract.                    │
│ Keyboard | Focus | Semantics | Tests | Consumer duties       │
├──────────────────────────────────────────────────────────────┤
│ Add source, not an opaque dependency.                        │
│ CLI → Files → Dependencies → Diff → Ownership                │
├──────────────────────────────────────────────────────────────┤
│ Components gallery                                           │
├──────────────────────────────────────────────────────────────┤
│ Production blocks                                            │
├──────────────────────────────────────────────────────────────┤
│ Registry + CLI + MCP                                         │
├──────────────────────────────────────────────────────────────┤
│ Community / Releases / Roadmap                               │
└──────────────────────────────────────────────────────────────┘
```

---

# 31. Primitive-detail wireframe

```text
┌──────────────────────────────────────────────────────────────┐
│ Global nav                                              ⌘K  │
├───────────────┬───────────────────────────────┬──────────────┤
│ Primitive nav │ Dialog                        │ On this page │
│               │ Stable · @solidiom/primitives │              │
│ Overview      │                               │ Purpose      │
│ Installation  │ [Interactive preview]         │ Installation │
│ Disclosure    │                               │ Anatomy      │
│ Overlay       │ [Install] [Source] [Play]     │ State        │
│ Selection     │                               │ A11y         │
│ Navigation    │ Overview                      │ API          │
│ Utilities     │ When to use                   │ Testing      │
│               │ When not to use               │              │
│               │                               │              │
│               │ Anatomy                       │              │
│               │ Root                          │              │
│               │ Trigger                       │              │
│               │ Portal                        │              │
│               │ Overlay                       │              │
│               │ Content                       │              │
│               │                               │              │
│               │ Accessibility contract        │              │
│               │ Keyboard table                │              │
│               │ Focus model                   │              │
│               │ Semantics                     │              │
│               │ Test status                   │              │
│               │                               │              │
│               │ API reference                 │              │
└───────────────┴───────────────────────────────┴──────────────┘
```

---

# 32. Final design direction

## Solidiom should feel like

* A serious open-source infrastructure project
* A refined developer product
* A trustworthy accessibility foundation
* A flexible design-system partner
* A native part of the Solid ecosystem

## Solidiom should not feel like

* A clone of shadcn
* A gallery of pretty components
* A generic SaaS landing page
* A framework wrapper
* A design system with hidden visual opinions
* A research project without production discipline

## Final brand statement

> **Solidiom is the Solid-native interface system where accessible behavior, source ownership, and design freedom meet.**

## Final homepage message

# Build interfaces the Solid way.

Accessible runtime primitives and source-owned components for Solid. Start unstyled, compose with your design system, and own everything you ship.

**Behavior you trust. Code you own. Design you control.**
