# @solidiom/button

## 0.0.1

### Patch Changes

- [`71e20e7`](https://github.com/solidiom/core/commit/71e20e756dae0ac848c6820d4d2dabbacd510202) Thanks [@devx](https://github.com/devx)! - Fix `IconButton` never forwarding `aria-label` to the rendered `<button>` element. Every `IconButton` consumer previously rendered an icon-only button with no accessible name. `Button.Root` now accepts an optional `aria-label` prop and applies it, and `IconButton` forwards its (required) `aria-label` through.

  No API changes for existing callers — `aria-label` was already a required prop on `IconButtonProps`, it just wasn't reaching the DOM.

- Updated dependencies [[`c134eb6`](https://github.com/solidiom/core/commit/c134eb684446a47195a19cf7928e0c84ee475278)]:
  - @solidiom/runtime@0.1.0
