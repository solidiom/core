/**
 * @solidiom/runtime — Shared first-party runtime kernel for Solidiom primitives.
 *
 * Provides controllable state, events, DOM utilities, collections,
 * overlays, presence, forms, and i18n services.
 */

// State
export {
  createControllableValue,
  type ControllableValue,
  type ControllableValueOptions,
} from "./state/controllable-value"
export {
  createDisclosureState,
  type DisclosureReason,
  type DisclosureState,
  type DisclosureStateOptions,
} from "./state/disclosure-state"

// Events
export { createChangeDetails, type ChangeDetails } from "./events/change-details"
export { composeEventHandlers } from "./events/compose-event-handlers"

// DOM
export { composeRef, type Ref } from "./dom/compose-ref"
export { createStableId, resetIdCounter } from "./dom/stable-id"
export { onOwnerCleanup, createDisposable } from "./dom/owner-cleanup"
export { observeElementSize, observeElementMutations } from "./dom/observe-element"
export {
  applySemanticAttrs,
  type SemanticAttrsOptions,
  type SemanticAttrsResult,
  type SemanticFlags,
} from "./dom/semantic-attrs"

// Collection
export {
  createCollection,
  type Collection,
  type CollectionItem,
  type CollectionOptions,
} from "./collection/collection"
export {
  resolveNavigationIntent,
  resolveNextItem,
  type NavigationIntent,
  type NavigationOptions,
} from "./collection/composite-navigation"
export {
  createRovingFocus,
  type RovingFocus,
  type RovingFocusOptions,
} from "./collection/roving-focus"
export { createTypeahead, type Typeahead, type TypeaheadOptions } from "./collection/typeahead"

// Overlay
export {
  getLayerStack,
  clearLayerStack,
  type Layer,
  type DismissReason,
  type LayerStack,
} from "./overlay/layer-stack"
export { setupDismissableLayer, type DismissableLayerOptions } from "./overlay/dismissable-layer"
export { activateFocusScope, type FocusScopeOptions } from "./overlay/focus-scope"
export { activateModalIsolation, resetModalIsolation } from "./overlay/modal-isolation"
export { resolvePortalTarget, type PortalOptions } from "./overlay/portal"
export { activateScrollLock, resetScrollLock } from "./overlay/scroll-lock"

// Presence
export {
  createPresence,
  type PresenceState,
  type PresenceOptions,
  type PresencePhase,
} from "./presence/presence"

// Form
export {
  createFormControl,
  type FormControl,
  type FormControlOptions,
  type FormControlState,
} from "./form/form-control"
export {
  getHiddenInputProps,
  type HiddenInputOptions,
  type HiddenInputProps,
} from "./form/hidden-input"
export {
  createValidation,
  type ValidationState,
  type ValidationOptions,
  type ValidationMessage,
} from "./form/validation"

// i18n
export {
  resolveDirection,
  DirectionContext,
  useDirection,
  type Direction,
  type DirectionOptions,
} from "./i18n/direction"
export { resolveLocale, type Locale, type LocaleOptions } from "./i18n/locale"

// Interaction
export {
  createPointerIntent,
  type PointerIntent,
  type PointerIntentOptions,
} from "./interaction/pointer-intent"
